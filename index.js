//Módulo externo
import inquirer from 'inquirer'
import chalk from 'chalk'

//Módulo interno
import fs from 'fs'
import { clear } from 'console'

clear()
operation()

function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }]
    ).then((answer) => {
        const action = answer['action']
        
        switch(action){
            case 'Criar Conta':
                clear()
                createAccount()
            break;
            
            case 'Depositar':
                clear()
                deposit()
            break;

            case 'Consultar Saldo':
                clear()
                getAccountBalance()
            break;

            case 'Sacar':
                clear()
                withdraw()
            break;

            case 'Sair':
                console.log(chalk.bgCyan.black('Obrigado por usar o Node Bank!'))
                process.exit()
            break;
        }
    })
    .catch((err) => {console.log(err)})
}

//create an account
function createAccount(){
    console.log(chalk.bgGreen.black("Obrigado por escolher o nosso banco!"))
    console.log("Defina as opções da sua conta a seguir.")

    buildAccount()
}

function buildAccount(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome para sua conta bancária: '
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('Conta existente no nosso banco de dados, por favor, utilize outro nome!'))
            buildAccount()
            return
        } else if (accountName == ''){
            console.log(chalk.bgRed.black("Informe um nome para a sua conta"))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', (err) => {
            console.log(err)
        })

        clear()
        console.log(chalk.bgGreen.black("Parabéns, sua conta foi registrada com sucesso!"))
        operation()
    }).catch((err) => {console.log(err)})
}

//add an amount to user account

function deposit(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta que deseja realizar o depósito?'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }
        ])
        .then((answer) => {
            const amount = answer['amount']

            //add an amount
            addAmount(accountName, amount)

        })
        .catch((err) => console.log(err))

    })
    .catch((err) => console.log(err))
}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe, informe outro nome'))
        console.log('\n\r\n\r')
        return false
    }

    return true
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount || isNaN(amount)){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente!'))
        return deposit()
    } else if(amount <= 0){
        console.log(chalk.bgRed.black('Informe um valor maior que zero para ser depositado'))
        return deposit()
    }
    
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), (err) => {
        console.log(err)
    })

    console.log(chalk.green(`R$ ${amount} depositado com sucesso!`))
    operation()
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

//show account balance
function getAccountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)
        clear()
        console.log(chalk.bgCyan.black(`Olá, seu saldo é exatamente R$ ${accountData.balance}`))
        console.log('\n\r\n\r')
        operation()
    })
    .catch(err => console.log(err))
}

//withdraw an amount from user account
function withdraw(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta que deseja sacar'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor você deseja sacar?'
            }
        ])
        .then((answer) => {
            const amount = answer['amount']

            removeAmount(accountName, amount)
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)
    
    if(!amount || isNaN(amount)){
        console.log(chalk.bgRed.black('Ocorreu um erro, informe novamente o valor para ser sacado!'))
        console.log('\n\r\n\r')
        return withdraw()
    } else if (accountData.balance < amount){
        console.log(chalk.bgRed.black('O valor que você está tentando sacar é maior que o valor atual, tente novamente!'))
        console.log('\n\r\n\r')
        return withdraw()
    }

    accountData.balance -= parseFloat(amount)
    
    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), ((err) => console.log(err)))

    console.log(chalk.bgGreen.black(`O valor de R$ ${amount} foi retirado da sua conta!`))
    operation()
}