module.exports = (sequelize,type) => {
    return sequelize.define('customer', {
        idcustomer: {
            field:'idcustomer',
            type:type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname:type.STRING,
        lastname : type.STRING,
        gender : type.STRING,
        address : type.STRING,
        phonenumber : type.STRING,
        email : type.STRING,
        username : type.STRING,
        password : type.STRING,
        level : type.INTEGER,
        status: type.STRING,
        nip : type.STRING
    }, {
        tableName : 'customer',
        timestamps: false
    })
}