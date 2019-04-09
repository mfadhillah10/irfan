const {Customer,Account} = require('../db/sequelize')
var logger = require('../util/logging/winston-logger');
var bcrypt = require('bcrypt-nodejs');
var saltRounds = bcrypt.genSaltSync(10)


exports.getAll = function getAll(callback) {
    Customer.findAll({
        order : [[
            'idcustomer','DESC'
        ]]}
    )
    .then ((customers)=> {
        return callback(null,customers);
    })
    .catch((error)=> {
        logger.error(error);
        return callback(error);
    })
}


exports.getById = function getById(id,callback) {
    Customer.findById(id)
    .then((customer)=> {
        return callback(null, customer);
    })
    .catch((error)=> {
        logger.error(error);
        return callback(error);
    })
};

exports.insert = function insert(data,pass,callback) {
    let account = data;
    let date = new Date();
    account.password = bcrypt.hashSync(pass,saltRounds)
    Customer.create(account)
    .then(customer => {
        account.customerid = customer.idcustomer;
        account.norek = Math.floor(100000000 + Math.random() * 900000000);
        account.pin = 1234;
        account.opendate = date;
        account.status = 2;
        Account.create(account)
        .then(insertAccount => {
            return callback(null, insertAccount);
        })
        .catch((err)=>{
            return callback(err);
        })
    })
    .catch((error)=> {
        logger.error(error);
        return callback(error);
    })
}

exports.update = function update(id,data,callback) {
    Customer.update(data, {
        where: { idcustomer: data.idcustomer },
        returning: true,
        plain: true
    })
    .then(result => {
        logger.info('result update: ');
        logger.info(result);
        return callback(null,data);
    })
    .catch((error) =>{
        logger.error(error);
        return callback(error);
    })
};

exports.del = function del(id,callback) {
    Customer.destroy({
        where: {idcustomer:id}
    })
    .then(result=> {  
        return callback(null,result);
    })
    .catch((error)=>{
        logger.error(error);
        return callback(error);
    })
}

exports.auth = function auth(username,password,callback) {
    Customer.findOne({
        where:{username:username
        }
    })
    .then((customers)=>{
        let compare = bcrypt.compareSync(password,customers.password)
        if(!Customer) {
            return callback(null,error)
        } else if (!compare) {
            return callback(null,err)
        }
        return callback(null,customers)
    })
    .catch((error)=>{
         console.log(error);
         return callback(error);
    })
}

exports.checkUsername = function checkUniqueField(username,callback) {
    Customer.count({
        where:
            {username:username}
    })
    .then((checked)=>{
        if(checked !=0){
        return (null,error)
        }
        return callback (null,checked)
    })
    .catch((error)=> {
        return callback(error);
    })
}

exports.checkNip = function checkNip(nip,callback) {
    Customer.count({
        where: {nip : nip}
    })
    .then((checked)=>{
        if(checked !=0){
            return (null,error)
            }
        return callback (null,checked)
    })
    .catch((error)=>{
        return callback (error)
    })
}

exports.checkEmail = function checkEmail(email,callback) {
    Customer.count({
        where: {email : email}
    })
    .then((checked)=>{
        if(checked !=0){
            return (null,error)
            }
        return callback (null,checked)
    })
    .catch((error)=>{
        return callback (error)
    })
}