const {Transaction, Account, Customer} = require('../db/sequelize');
var logger = require ('winston');

exports.getAll = function(whereClause,callback){
    Transaction.findAll({
        where : whereClause,
        order : [[
            'idtransaction', 'DESC'
        ]],
        include :[{
            model : Account,
            include :[{
                model : Customer
            }]
        }]
    })
    .then ((transactions) => {
        return callback(null, transactions);
    })
    .catch ((error) => {
        logger.error(error);
        return callback(error);
    })
}

exports.getAllLimit = function(callback) {
    Transaction.findAll({
        limit : 5,
        order : [[
            'idtransaction','DESC'
        ]]
    })
    .then ((transaction)=>{
        return callback(null, transaction);
    })
    .catch ((error)=>{
        return callback(error);
    })
}

exports.getById = function(id, callback){
    Transaction.findById(id)
    .then (transaction =>{
        return callback(null, transaction);
    })
    .catch ((error)=>{
        logger.error(error);
        return callback(error);
    })
}

exports.insert = function(data, callback){
    let transaction = data ;
    let date = new Date();
    if(transaction.account==null && transaction.accountid==null){
        res.json('Account Kosong');
    }else{
        if(transaction.accountid==null){
            transaction.accountid = transaction.account.idaccount;
        }
    }
    transaction.type = "Transfer";
    transaction.date = date;
    Transaction.create(transaction)
    .then(transaction2=> {
        return callback(null,transaction2)
    })
    .catch((error)=>{
        logger.error(error);
        return callback(error);
    })
}

exports.insert2 = function(data,idReceiver,idcardSender,callback) {
    let transaction = data ;
    let date = new Date();
    if(transaction.account==null && transaction.accountid==null){
        res.json('Account Kosong');
    }else{
        if(transaction.accountid==null){
            transaction.accountid = transaction.account.idaccount;
        }
    }
    transaction.date = date;
    transaction.amountsign = 'D'
    transaction.accountid = idReceiver
    transaction.idcard = idcardSender
    transaction.type = 'Receive'
    Transaction.create(transaction)
    .then((transaction)=>{
        return callback(null,transaction)
    })
    .catch((error)=>{
        return callback(error)
    })
}

//get transaction out by accout 
exports.transactionout = function transactionout(id, callback){
    // var d = new Date();

    
    // month = ''+d.getMonth() + 1,
    // year = d.getFullYear();
    // day = ''+d.getDay() + 1;

    // var a = [year,month,day].join('-');
    // var n = a.toString();
    Transaction.findAll({
        where:{
            accountid : id,
            amountsign: 'C',
            date : {$lt: new Date(),
            $gt: new Date(new Date() - 24 * 60 * 60 * 1000)}
        },
        include : [{
            model: Account,
            include:[{
                model: Customer
            }]
        }]
    })
    .then((transaction) =>{
        return callback(null, transaction);
    })
    .catch((error) =>{
        logger.error(error);
        return callback(error);
    })
}

exports.transactionin = function transactionin(id, callback){
    let transDate = new Date();
    Transaction.findAll({
        where:{
            accountid : id,
            amountsign: 'D',
            date : sequeli        
        },
        include : [{
            model: Account,
            include:[{
                model: Customer
            }]
        }]
    })
    .then((transaction) =>{
        return callback(null, transaction);
    })
    .catch((error) =>{
        logger.error(error);
        return callback(error);
    })
}

exports.transactionoutAll = function transactionoutAll(id, callback){
    Transaction.findAll({
        where:{
            accountid : id,
            amountsign: 'C'
        },
        include : [{
            model: Account,
            include:[{
                model: Customer
            }]
        }]
    })
    .then((transaction) =>{
        return callback(null, transaction);
    })
    .catch((error) =>{
        logger.error(error);
        return callback(error);
    })
}

exports.transactioninAll = function transactioninAll(id, callback){
    Transaction.findAll({
        where:{
            accountid : id,
            amountsign: 'D'
        },
        include : [{
            model: Account,
            include:[{
                model: Customer
            }]
        }]
    })
    .then((transaction) =>{
        return callback(null, transaction);
    })
    .catch((error) =>{
        logger.error(error);
        return callback(error);
    })
}

exports.topupHistory = function topupHistory(amount,id,callback) {
    let date = new Date();
    Transaction.create({
        accountid : id,
        amountsign : 'D',
        amount : amount,
        date : date,
        type : 'Topup'
    })
    .then((result)=>{
        return callback(null,result)
    }) 
    .catch((error)=>{
        return callback(error)
    })
}


//in transactions in all
exports.transactionsinsall = function transactionsinsall(callback){
    Transaction.findAll({
        where:{
            amountsign: 'D',
        },
        include : [{
            model: Account,
            include:[{
                model: Customer
            }]
        }]
    })
    .then((transaction) =>{
        return callback(null, transaction);
    })
    .catch((error) =>{
        logger.error(error);
        return callback(error);
    })
}

//in transactions in all
exports.transactionsoutsall = function transactionsoutsall(callback){
    Transaction.findAll({
        where:{
            amountsign: 'C',
        },
        include : [{
            model: Account,
            include:[{
                model: Customer
            }]
        }]
    })
    .then((transaction) =>{
        return callback(null, transaction);
    })
    .catch((error) =>{
        logger.error(error);
        return callback(error);
    })
}