import inquirer from "inquirer"
import chalk from "chalk"
import fs from "fs"
import { verify } from "crypto"

operation()
function operation() {
inquirer.prompt([{
    type:'list',
    name:'action',
    message:'O que você deseja fazer?',
    choices: [
        'Criar conta',
        'Consultar saldo',
        'Depositar',
        'Sacar',
        'Sair'
    ]
},
])
.then((answer) => {
    const action = answer['action']

    if (action === 'Criar conta') {
        createAccount()
        buildAccount()
    }
    if (action === 'Consultar saldo') {
        getAccountBalance()
    }
    if (action === 'Depositar') {
        depositar()
    }
    if (action === 'Sacar') {
        sacar()
    }
    if (action === 'Sair') {
        console.log(chalk.bgBlue.black("Obrigado por usar o Accounts"))
        process.exit()
    }
})
.catch((err) => {console.log(err);})
}

function createAccount(){
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opçoes da sua conta a seguir'))
}

function buildAccount(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para a sua conta:'
    }]).then((answer) => {
        const accountName = answer['accountName'];

        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync("accounts/" + accountName + ".json")){
            console.log(chalk.bgRed.black("Usuário existente, tente outro nome."))
            buildAccount()
            return
        }

        fs.writeFileSync("accounts/" + accountName + ".json", '{"balance": 0}', 
        function(err) {
            console.log(err)
        })
        console.log(chalk.bgGreen.green('Parabéns, sua conta foi criada em nosso banco.'));

        operation()


    }).catch((err) =>{
        console.log(err)
    })

}

function depositar(){
    inquirer.prompt([{
        name:'nameInput',
        message:'Digite o nome da sua conta:'
    }]).then((answer) =>{
        const accountName = answer['nameInput'];
        if(!checkAccount(accountName)){
            return depositar()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja depositar?'
        }]).then((answer) =>{
            const amount = answer['amount'];

            addAmount(accountName, amount)

            operation()
        }).catch((err) =>{
            console.log(err)
        })


        });

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgBlack.red("Ocorreu um erro, tente novamente mais tarde"))
        return depositar()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync("accounts/" + accountName + ".json", JSON.stringify(accountData)), function(err) {
        console.log(err)
    };
    console.log(chalk.bgRed.black("O valor foi depositado em sua conta."))
}}


function checkAccount(accountName){
    if(!fs.existsSync("accounts/" + accountName + ".json")){
        console.log(chalk.bgRed.black("Essa conta não existe, tente novamente"))
        return false
    }else{
        return true
    }
}


function getAccount(accountName){
    const accountJSON = fs.readFileSync("accounts/" + accountName + ".json", {
        encoding: 'utf-8',
        flag: 'r',
    })
    
    return JSON.parse(accountJSON)
};


function getAccountBalance(){
    inquirer.prompt([{
        name: 'accountBalance',
        message: 'Qual é o nome da sua conta?'
    }]).then((answer) => {
        const accountName = answer['accountBalance']

        if(!fs.existsSync("accounts/" + accountName + ".json")){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgGreen.black("Olá, o saldo da sua conta é de: " + accountData.balance))
        operation()
    })
    .catch((err) => {
        console.log(err)
    })
}


function sacar(){
    inquirer.prompt([{
        name:'nameInput',
        message:'Digite o nome da sua conta:'
    }]).then((answer) =>{
        const accountName = answer['nameInput'];
        if(!checkAccount(accountName)){
            return sacar()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja sacar?'
        }]).then((answer) =>{
            const amount = answer['amount'];

            addAmount(accountName, amount)

            operation()
        }).catch((err) =>{
            console.log(err)
        })


        });

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgBlack.red("Ocorreu um erro, tente novamente mais tarde"))
        return depositar()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    fs.writeFileSync("accounts/" + accountName + ".json", JSON.stringify(accountData)), function(err) {
        console.log(err)
    };
    console.log(chalk.bgRed.black("O valor foi sacado da sua conta."))
}}


