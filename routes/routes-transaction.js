'use strict'

module.exports = function(app){
    var todolist = require('../controller/transaction-controller');

    app.route('/transactions')
    .get(todolist.transactions);

    app.route('/transaction/:id')
    .get(todolist.transactionById);

    app.route('/transaction')
    .post(todolist.insertTransaction);

    app.route('/transaction/transfer')
    .post(todolist.transfer);

    app.route('/transactions/limit')
    .get(todolist.transactionLimit);

    //ip in transaction
    app.route('/transaction/indate/:in').get(todolist.transactionIn)
    app.route('/transaction/outdate/:out').get(todolist.transactionOut)

    app.route('/transaction/in/:in').get(todolist.transactionInAll)
    app.route('/transaction/out/:out').get(todolist.transactionOutAll)

    //ip in transaksi all in and out
    app.route('/transactions/in').get(todolist.transactionsinall)
    app.route('/transactions/out').get(todolist.transactionsoutall)
}

   