module.exports = (sequelize, type) => {
    return sequelize.define('account', {
        idaccount: {
            field: 'idaccount',
            type:type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        norek:{
            field: 'norek',
            type: type.INTEGER
        },
        pin:{
            field: 'pin',
            type: type.INTEGER
        },
        opendate: {
            field: 'opendate',
            type: type.DATE
        },
        balance: {
            field: 'balance',
            type: type.DECIMAL
        },
        status: {
            field: 'status',
            type: type.INTEGER
        },
        customerid: {
            type: type.INTEGER,
            onDelete: 'CASECADE',

            references: {
                model: 'customer',
                key: 'idcustomer'
            }
        }
    }, {
        tableName: 'account',
        timestamps: false
    });
}