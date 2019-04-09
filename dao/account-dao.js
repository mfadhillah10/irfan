const {
    Account,
    Customer
} = require('../db/sequelize');
var logger = require('../util/logging/winston-logger');

exports.getList = function getList(id, callback) {
    Account.findAll({
            where: {
                customerid: id
            },
            include: [Customer]
        })
        .then((account) => {
            return callback(null, account);
        })
        .catch((error) => {
            logger.error(error);
            return callback(error);
        })
};

exports.getById = function getById(idaccount, callback) {
    Account.findById(idaccount)
        .then((account) => {
            return callback(null, account);
        })
        .catch((error) => {
            logger.error(error);
            return callback(error);
        })
};

exports.getAll = function getAll(whereClause,callback) {
    Account.findAll({
            where : whereClause,
            order : [[
                'idaccount', 'DESC'
            ]],
            include: [Customer]
        })
        .then((accounts) => {
            return callback(null, accounts);
        })
        .catch((error) => {
            logger.error(error);
            return callback(error);
        })
};


exports.insert = function insert(data, callback) {
    let account = data;
    if (account.customer == null && account.customerid == null) {
        res.json('Data kosong');
    } else {
        if (account.customerid == null) {
            account.customerid = account.customer.idcustomer;
            console.log(account.customerid);  
        }

    }

    Account.create(account)
        .then(account => {
            return callback(null, account);
        })
        .catch((error) => {
            logger.error(error);
            return callback(error);
        })
};

exports.update = function update(id, data, callback) {
    account = data;
    Account.update(account, {
            where: {
                idaccount: id
            },
            returning: true,
            plain: true
        })
        .then(result => {
            logger.info('result  update:');
            logger.info(result);
            return callback(null, data);
        })
        .catch((error) => {
            logger.error(error);
            return callback(error);
        })
};

exports.updateSenderBalance = function (accountid,balance,amount,callback) {

    Account.update({balance : balance - amount},
       { where :{ idaccount : accountid },
       returning: true,
        plain: true
    })
    .then(account=>{
        return callback(null,account)
    })
    .catch((error)=>{
        return callback(error)
    })
}

exports.updateReceiverBalance = function(idcard,balance,amount,callback) {
    Account.update({balance:balance+amount},
        {where :{norek:idcard},
        returning: true,
        plain: true
    
    })
    .then(account=> {
        return callback(null,account)
    })
    .catch((error)=>{
        return callback(error)
    })
}

exports.topup = function(norek,balance,amount,callback) {
    Account.update({balance:balance+amount},
        {where :{norek:norek},
        returning: true,
        plain: true
    })
    .then(account=> {
        return callback(null,account)
    })
    .catch((error)=>{
        console.log(error)
        return callback(error)
    })
}

exports.del = function del(id2, callback) {
    Account.destroy({
            where: {
                idaccount: id2
            }
        })
        .then(result => {
            logger.info('result  delete:');
            logger.info(result);
            return callback(null, id2);
        })
        .catch((error) => {
            logger.error(error);
            return callback(error);
        })
};

exports.getNorek = function getNorek(norek,callback) {
    Account.findOne({
        where: {
            norek:norek
        },   include: [Customer]
    })
    .then(account=> {
        return callback(null,account)
    })
    .catch((error)=> {
        return callback(error)
    })
}

exports.getAccountSender = function getNorekSender(idaccount,callback) {
    Account.findOne({
        where: {
            idaccount : idaccount
        },  include: [Customer]
    })
    .then(account=> {
        return callback(null,account)
    })
    .catch((error)=> {
        return callback(error)
    })
}

exports.getBycustomer = function getBycustomer(id, callback){
    Account.findAll({
        where:{
            customerid : id
        },
        include: [Customer]
    })
    .then((account) => {
        return callback(null, account);
    })
    .catch((error) => {
        logger.error(error);
        return callback(error);
    })
}

exports.checkPin = function checkPin(pin,id,callback) {
    Account.findOne({
        where:{pin:pin,
            $and : {idaccount:id}
        }
    })
    .then((checked)=>{
        return callback (null,checked)
    })
    .catch((error)=>{
        return callback (error)
    })
}

exports.changePin = function changePin(pin,id,callback) {
    Account.update({pin : pin},
        {where : {idaccount: id}
    })
    .then((checked)=>{
        return callback (null,checked)
    })
    .catch((error)=>{
        return callback (error)
    })
}

exports.checkStatus = function checkStatus(id,callback) {
    Account.findOne({
        where : {status : 1,
        $and :{idaccount : id}
        }
    })
    .then((checked) => {
        return callback(null,checked)
    })
    .catch((error)=>{
        return callback (error)
    })
}

