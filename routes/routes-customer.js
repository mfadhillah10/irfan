'use strict';

module.exports = function(app) {
    var todolist = require('../controller/customer-controller');

    app.route('/customers')
        .get(todolist.customers);

    app.route('/customer')
        .post(todolist.insertCustomer)

    app.route('/customer')
        .put(todolist.updateCustomer)

    app.route('/customer/:id')
        .delete(todolist.del)

    app.route('/customer/:id')
        .get(todolist.getCustomerId)

    app.route('/customer/auth')
        .post(todolist.auth)

    app.route('/customer/status')
        .put(todolist.updateStatus)

    // app.route('customer/account/:id').get(todolist.getaccount);
}