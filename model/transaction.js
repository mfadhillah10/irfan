module.exports = (sequelize, type) => {
    return sequelize.define('transaction', {
        idtransaction : {
            field : 'idtransaction',
            type : type.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        amount : type.INTEGER,
        amountsign : type.STRING,
        type : type.STRING,
        date : type.DATE,
        idcard : type.INTEGER,
        accountid : {
            type : type.INTEGER,
            onDelete : 'CASCADE',
            
            reference : {
                model : 'account',
                key : 'idaccount'
            }
        }
    }, {
        tableName : 'transaction',
        timestamps : false
    })
}