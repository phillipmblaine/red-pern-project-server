module.exports = (sequelize, DataTypes) => {
    const Destination = sequelize.define('destination', {
        xid: { // unfortunately, the xid MUST come from bbox, radius, or autosuggest calls. Geoname is basic information that does not have the xid, descriptions, ratings, or categories
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING
        },
        latitude: {
            // type: DataTypes.INTEGER
            type: DataTypes.DOUBLE
        },
        longitude: {
            // type: DataTypes.INTEGER
            type: DataTypes.DOUBLE
        },
        description: { // not present in geoname call
            type: DataTypes.TEXT
        },
        kinds: { // not present in geoname call
            type: DataTypes.STRING
        },
        rating: { // not present in geoname call
            type: DataTypes.INTEGER
        },
        favorite: {
            type: DataTypes.BOOLEAN
            // allowNull: false
        }
        // should I use the timezone value? maybe i don't need it for now
    })
    return Destination;
}
// with database associations, it's supposed to put in what the ownerId stuff does for us
