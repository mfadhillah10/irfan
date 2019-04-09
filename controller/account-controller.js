var response = require('../response/res');
var accountDao = require('../dao/account-dao');
var transactionDao = require('../dao/transaction-dao');
var logger = require('../util/logging/winston-logger');

exports.accounts = function (req, res) {
    let whereClause = {};
    if (req.query.customer) {
        whereClause.customerid = req.query.customer;
    }
    accountDao.getAll(whereClause,function (error, rows) {
        if (error) {
            logger.error('error while select: ' + error);
            response.err(error, res);
        }
         else {
            response.ok(rows, res)
        }
    });
};

exports.getById = function (req, res) {
    accountDao.getById(req.params['id'], function (err, data) {
        if (err) {
            logger.error('error call getById : ' + err);
            response.err(err, res);
        }else if (data == null) {
            response.datanotfound('account not found', res);
        }
        response.ok(data, res);
    });
};

//test untuk get customer
exports.getList = function (req, res) {
    accountDao.getList(req.query.customer, function (err, data) {
        if (err) {
            logger.error('error call getById : ' + err);
            response.err(err, res);
        }
        response.ok(data, res);
        // res.json(data);
    });
}

exports.update = function (req, res) {
    logger.info('request for update :');
    logger.debug(req.body);
    accountDao.getById(req.body.idaccount, function (err, data) { //check account exists
        if (err) {
            logger.error('error call getById : ' + err);
            response.err(err, res);
        } else if (data == null) {
            response.datanotfound('account not found', res);
        } else {
            //if exists, then continue update
            accountDao.update(req.body.idaccount, req.body, function (err, data) {
                if (err) {
                    logger.error('error call update : ' + err);
                    response.err(err, res);
                }
                response.ok('updated data : ' + data.id, res);
            });
        }
    });
};

exports.insert = function (req, res) {
    accountDao.insert(req.body, function (err, rows) {
        console.log(req.body);
        if (err) {
            logger.error('error call insert : ' + err);
            response.err(err, res);
        }
        response.ok('data inserted with id ' + rows.idaccount, res);
    });
};

exports.del = function (req, res) {
    accountDao.getById(req.params['id'], function (err, data) { 
        if (err) {
            logger.error('error call getById : ' + err);
            response.err(err, res);
        } else if (data == null) {
            response.datanotfound('account not found', res);
        } else {
            // response.ok(data, res);
            accountDao.del(req.params['id'], function (err, data) {
                if (err) {
                    logger.error('error call delete : ' + err);
                    return response.err(err, res);
                }
                response.ok('account deleted with id : ' + data, res);
            });
        }
    });
};

exports.getNorek = function(req,res) {
    accountDao.getNorek(req.body.norek,function(err,data) {
        if(err) {
            response.err(err,res);
        } else if (data==null) {
            response.datanotfound('Account Number is not found.',res);
        } else {
            response.ok(data.balance,res);
        }
    })
}

//get account by customer
exports.getByCustomer = function(req,res){
    accountDao.getBycustomer(req.params['customerid'], function(err, data){
        if(err){
            response.err(err, res);
        }else if(data == null){
            response.datanotfound("Customer is not found", res);
        }else{
            response.ok(data, res);
        }
    })
}

exports.checkPin = function(req,res) {
    accountDao.checkPin(req.body.pin,req.body.idaccount,function(err,data) {
        if(err) {
            response.err(err,res);
        } else if (data  == null) {
            response.datanotfound("Wrong Pin",res);
        } else {
           response.ok('Validated',res);
        }
    })
}

exports.updatePin = function(req,res) {
    accountDao.checkPin(req.body.pin,req.body.idaccount,function(err,data) {
        if(err) {
            response.err(err,res);
        } else if (data  == null) {
            response.datanotfound("Wrong Pin",res);
        } else {
            accountDao.changePin(req.body.newPin,req.body.idaccount,function(err,data){
                if (err) {
                    response.err(err,res);
                } else {
                    response.ok("Your new PIN is :" + data.pin,res);
                }
            })
        }
    })
}

exports.topup = function(req,res) {
    accountDao.getNorek(req.body.norek,function(err,dataUser){
        if(err) {
            response.err(err,res);
        } else if (dataUser == null) {
            response.datanotfound("Account Number is not found",res);
        } else {
            accountDao.topup(dataUser.norek,dataUser.balance,req.body.amount,function(err,data) {
                if (err) {
                    response.err(err,res);
                } else {
                    transactionDao.topupHistory(req.body.amount,dataUser.idaccount,function(err,data){
                        if (err) {
                            response.err(err,res);
                        } else {
                            response.ok('Top up is success',res);
                        }
                    })
                }
            })
        }
    })
}

exports.topupValidation = function(req,res)  {
accountDao.getNorek(req.body.norek,function(err,dataUser){
    if(err) {
        response.err(err,res);
    } else if (dataUser == null) {
        response.datanotfound("Account Number is not found",res);
    } else {
       response.ok("Are you sure you want to continue top up for this user " + dataUser.customer.firstname + " with account number : " + req.body.norek + " ?",res)
    }
})
}

exports.updateStatus = function(req,res) {
    accountDao.update(req.body.idaccount,req.body,function(err,data){
        if(err) {
            response.err(err,res);
        } else if (data.status == 2) {
            response.datanotfound('Status has been deactivated',res);
        } else {
            response.ok('Status has been activated',res);
        }
    })
}
