const response = require('../response/res');
const transactionDao = require ('../dao/transaction-dao');
const accountDao = require('../dao/account-dao');

exports.transactions = function(req,res){
    let whereClause={};
    if (req.query.account) {
        whereClause.accountid = req.query.account;
    }

    transactionDao.getAll(whereClause,function(err,rows){
        if(err){
            response.err(err,res);
        }
            response.ok(rows,res);
    });
}

exports.transactionLimit = function(req,res) {
    transactionDao.getAllLimit(function(err,data){
        if(err) {
            response.err(err,res);
        } else {
            response.ok(data,res);
        }
    })
}

exports.transactionById = function(req, res){
    transactionDao.getById(req.params['id'],function(err, rows){
        if(err){
            response.err(err,res);
        }
            response.ok(rows, res);
    });
}

exports.insertTransaction = function(req,res){
    accountDao.getNorek(req.body.idcard,function(err,dataAccount){
        if(err) {
            response.err(err,res);
        } else if (dataAccount==null) {
            response.datanotfound('Account Number is not found',res);
        } else if (dataAccount.status == 2) {
            response.datanotfound('Account destinantion is dormant',res)
        }
        else  {
            accountDao.getAccountSender(req.body.accountid,function(err,dataSender) {
                if (err) {
                    response.err(err,res)
                } else if (dataSender==null) {
                    response.datanotfound('Wrong Account Id',res)
                }
                else if (dataSender.balance < req.body.amount) {
                    response.datanotfound('Your Balance is less than the amount that you want transfer.',res)
                } else if (req.body.amount < 1000 ) {
                    response.datanotfound('Transfer must be more than Rp.1000',res)
                } else if (dataSender.norek == req.body.idcard) {
                    response.datanotfound('You transfer to your account.gak boleh',res)
                }
                else{
                    accountDao.checkPin(req.body.pin,req.body.accountid,function(err,dataPin){
                        if(err) {
                            response.err(err,res)
                        } else if (dataPin == null) {
                            response.datanotfound('Wrong Pin',res)
                        }
                        else {
                           accountDao.checkStatus(req.body.accountid,function(err,data){
                               if(err) {
                                   response.err(err,res)
                               } else if (data == null) {
                                   response.datanotfound('Your status is not active. Please contact our service.',res)
                               } else {
                                   response.ok('Are you sure to continue your transfer to: ' + req.body.idcard + ' on behalf of ' + dataAccount.customer.firstname + ' with a nominal value of Rp.' + req.body.amount ,res)
                               }
                           }) 
                        }
                    })
                }
                });
            }
    });
}

exports.transfer = function(req,res) {
    transactionDao.insert(req.body, function(err,data){
        accountDao.getNorek(req.body.idcard,function(err,dataAccount){
            if(err) {
                response.err(err,res);
            } else if (dataAccount==null) {
                response.datanotfound('Account Number is not found',res);
            } else if (dataAccount.status == 2) {
                response.datanotfound('Account destinantion is dormant',res)
            }
            else  {
                accountDao.getAccountSender(req.body.accountid,function(err,dataSender) {
                    if (err) {
                        response.err(err,res)
                    } else if (dataSender==null) {
                        response.datanotfound('Wrong Account Id',res)
                    }
                    else if (dataSender.balance < req.body.amount) {
                        response.datanotfound('Your Balance is less than the amount that you want transfer.',res)
                    } else if (req.body.amount < 1000) {
                        response.datanotfound('Transfer must be more than Rp.1000',res)
                    } else if (dataSender.norek == req.body.idcard) {
                        response.datanotfound('You transfer to your account.gak boleh',res)
                    } 
                    else{
                        accountDao.checkPin(req.body.pin,req.body.accountid,function(err,dataPin){
                            if(err) {
                                response.err(err,res)
                            } else if (dataPin == null) {
                                response.datanotfound('Wrong Pin',res)
                            } else {
                            if(err){
                                response.err(err,res);
                            } else {
                                accountDao.checkStatus(req.body.accountid,function(err,data){
                                    if(err) {
                                        response.err(err,res)
                                    } else if (data == null) {
                                        response.datanotfound('Your status is not active. Please contact our service.',res)
                                    } else {
                                        accountDao.updateSenderBalance(req.body.accountid,dataSender.balance,req.body.amount, function(err,data) {
                                            if (err) {
                                                response.err(err,res)
                                            } else {
                                                accountDao.updateReceiverBalance(req.body.idcard,dataAccount.balance,req.body.amount,function(err,data){
                                                    if(err) {
                                                        response.err(err,res)
                                                    } else {
                                                        transactionDao.insert2(req.body,dataAccount.idaccount,dataSender.norek,function(err,data){
                                                            if (err) {
                                                                response.err(err,res)
                                                            } else {
                                                                response.ok("Success transaction.",res)                                                    
                                                            }
                                                        })
                                                    }
                                                }) 
                                            }
                                        }) 
                                    }
                                }) 
                                             
                                }
                            }
                        })
                    }
                    });
                }
        });
        
    });
}


//transaksi in date
exports.transactionIn = function(req, res){
    transactionDao.transactionin(req.params['in'], function(err, data){
        if(err){
            response.err(err, res);
        }else if(data == null){
            response.datanotfound('data is not found.', res);
        }
        response.ok(data, res);
    });
}

//transaksi out date

exports.transactionOut = function(req, res){
    transactionDao.transactionout(req.params['out'], function(err, data){
        if(err){
            response.err(err, res);
        }else if(data == null){
            response.datanotfound('data is not found.', res);
        }
        response.ok(data, res);
    });
}

//transaksi in 
exports.transactionInAll = function(req, res){
    transactionDao.transactioninAll(req.params['in'], function(err, data){
        if(err){
            response.err(err, res);
        }else if(data == null){
            response.datanotfound('data is not found.', res);
        }
        response.ok(data, res);
    });
}

//transaksi out

exports.transactionOutAll = function(req, res){
    transactionDao.transactionoutAll(req.params['out'], function(err, data){
        if(err){
            response.err(err, res);
        }else if(data == null){
            response.datanotfound('data is not found.', res);
        }
        response.ok(data, res);
    });
}


//get all ini transactions
//transaksi in date
exports.transactionsinall = function(req, res){
    transactionDao.transactionsinsall(function(err, data){
        if(err){
            response.err(err, res);
        }else if(data == null){
            response.datanotfound('data is not found.', res);
        }
        response.ok(data, res);
    });
}


//get all ini transactions
//transaksi in date
exports.transactionsoutall = function(req, res){
    transactionDao.transactionsoutsall(function(err, data){
        if(err){
            response.err(err, res);
        }else if(data == null){
            response.datanotfound('data is not found.', res);
        }
        response.ok(data, res);
    });
}



