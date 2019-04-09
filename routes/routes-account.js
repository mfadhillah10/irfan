'use strict';

module.exports = function (app) {
    var controller = require('../controller/account-controller');

    app.route('/accounts').get(controller.accounts);
    app.route('/account/:id').get(controller.getById);
    app.route('/account').post(controller.insert);
    app.route('/account').put(controller.update);
    app.route('/account/:id').delete(controller.del);
    app.route('/account/norek').post(controller.getNorek);
    app.route('/account/checkPin').post(controller.checkPin);
    app.route('/account/updatePin').put(controller.updatePin);
    app.route('/account/topup').put(controller.topup);
    app.route('/account/status').put(controller.updateStatus);
    app.route('/account/validate').post(controller.topupValidation);

    //get account by customer
    app.route('/account/customer/:customerid').get(controller.getByCustomer);
}