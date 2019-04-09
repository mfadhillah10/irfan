var response = require('../response/res');
var customerDao = require('../dao/customer-dao')
var logger = require('../util/logging/winston-logger');

exports.customers = function(req,res) {
    customerDao.getAll(function(error,rows) {
        if(error) {
            logger.log('error while select : ' + error);
            response.err(error,res);
        } else {
            response.ok(rows,res)
        }
    });
};

exports.getCustomerId = function(req,res) {
    customerDao.getById(req.params['id'],function(err,data) {        
        if(err) {
            logger.info('error call getbyid : ' + err);
            response.err(err,res);
        }
        response.ok(data,res);
    });
};

exports.updateCustomer = function(req,res) {
    customerDao.getById(req.body.idcustomer, function (err, data) {
        if (err) {
            console.log('error call getById :' + err);
            response.err(err, res);
        } else if (data == null) {
            response.datanotfound('customer not found', res);
        } else {
            customerDao.checkUsername(req.body.username, function (err, dataUsername) {
                if (err) {
                    console.log('error : ' + err)
                    response.uniqueField('That username is taken. Try another.', res)
                } else {
                    customerDao.checkNip(req.body.nip, function (err, dataNip) {
                        if (err) {
                            console.log('error : ' + err)
                            response.uniqueField('Nip is taken. Try another.', res)
                        } else {
                            customerDao.checkEmail(req.body.email, function (err, dataEmail) {
                                if (err) {
                                    response.uniqueField('Email is taken. Try another.', res)
                                } else {
                                    customerDao.update(req.body.idcustomer, req.body, function (err, data) {
                                        if (err) {
                                            console.log('error call update : ' + err);
                                            response.err(error, res);
                                        }
                                        response.ok('updated data : ' + data.idcustomer, res);
                                    });
                                }
                            });
                        };
                    })
                }
            })
        }
    })
}


exports.insertCustomer = function(req, res) {
    customerDao.checkUsername(req.body.username,function(err,dataUsername) {
        if (err) {
            console.log('error : ' + err)
            response.uniqueField('Username is taken. Try another.',res)
        }  else if (req.body.username == "") {
            response.uniqueField('Please Input Registration Field',res)
        }  else {
           customerDao.checkNip(req.body.nip,function(err,dataNip){
               if (err) {
                    console.log('error : ' + err)
                    response.uniqueField('Nip is taken. Try another.',res)
               }  else if (req.body.nip == "")  {
                   response.uniqueField("Please Input Registration Field", res)
               } else {
                   customerDao.checkEmail(req.body.email,function(err,dataEmail) {
                       if (err) {
                           response.uniqueField('Email is taken. Try another.',res)
                       } else {
                            customerDao.insert(req.body,req.body.password, function(err, data) {
                                if(err) {
                                    console.log('error call insert' + err);
                                    response.err(err, res);
                                } else if (req.body == null) {
                                    response.err('Please Input Registration Field',res)
                                } 
                                response.ok(data, res);
                            });
                        }
                    })
                }
            })
        }
    })
}
        

exports.del = function(req,res) {
    customerDao.getById(req.params['id'], function(err,data) {
        if(err) {
            console.log('error call getById :'+ err);
            response.err (err,res);
        } else if (data==null) {
            response.datanotfound('customer not found', res);
        }else {
            customerDao.del(req.params['id'],function(err,data) {
                if(err) {
                    console.log('error call delete : '+ err);
                    response.err(err,res);
                }
                response.ok('customer deleted with id : '+data,res);
                // console.log(req.params['id']);
            });
        }
    });
};

exports.auth = function(req,res) {
    customerDao.auth(req.body.username,req.body.password,function(err,data) {
        if (err) {
            console.log('error : ' + err);
            response.err(err,res);
        } else if (data==null) {
            response.datanotfound('Username or password not found', res)
        } else {
            response.ok(data,res);
        }
    })
}

exports.updateStatus = function(req,res) {
    customerDao.update(req.body.id,req.body,function(err,data) {
        if (err) {
            response.err('error : ' + err);
        } else if (data.status == 2) {
            response.datanotfound('Account has been deactivated',res)
        } else {
            response.ok('Account has been activated',res)
        }
    })
}