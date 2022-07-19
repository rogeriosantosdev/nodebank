//Módulo externo
import inquirer from 'inquirer'
import chalk from 'chalk'

//Módulo interno
import fs from 'fs'
import { clear } from 'console'

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
                createAccount()
            break;
            
            case 'Depositar':

            break;

            case 'Consultar Saldo':

            break;

            case 'Sacar':

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
    console.log("Obrigado por escolher o nosso banco!")
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