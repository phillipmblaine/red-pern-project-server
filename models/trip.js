module.exports = (sequelize, DataTypes) => {
    const Trip = sequelize.define('trip', {
        tripName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stops: { // can I use array datatype (available in postgres), or key:value pair array or something of that sort?
            // type: DataTypes.ENUM(['value1', 'value2']) // xid: nameOfDestination // does it make sense, is it possible, to have ENUM value where you can push locations (key: value like xid: name ?)
            type: DataTypes.ARRAY(DataTypes.STRING) // maybe I can use a datatype array of strings to suit my needs?
        },
        numberOfStops: {
            type: DataTypes.INTEGER
        },
        tripBeginDate: {
            type: DataTypes.DATEONLY
        },
        tripEndDate: {
            type: DataTypes.DATEONLY
        }
    })
    return Trip;
}
// with database associations, it's supposed to put in what the ownerId stuff does for us