module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        firstName: {
            type: DataTypes.STRING(32), // the number in parentheses limits character length // a boolean binary can be optionally placed in: (length: number, binary: true/false) // char vs string: char is fixed length, string is variable
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        passwordhash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // value for checking if admin or not
        role: { // is it acceptable to declare user role immediately upon user creation?
            type: DataTypes.STRING(16),
            allowNull: false
        }
    })
    return User;
}