const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE_URL ||
    `postgresql://postgres:${encodeURIComponent(process.env.PASS)}@localhost/${process.env.NAME}`,
    { dialect: 'postgres', })

sequelize.authenticate().then(
    function () { console.log(`Connected to ${process.env.NAME} postgres database.`); },
    function (error) { console.log("ERROR:", error); }
);

User = sequelize.import('./models/user');
Destination = sequelize.import('./models/destination');
Trip = sequelize.import('./models/trip');

// database association: user has many destinations, destinations belongs to user
User.hasMany(Destination);
Destination.belongsTo(User);

// database association: user has many trips, trips belongs to user
User.hasMany(Trip);
Trip.belongsTo(User);

// database association: trip has many destinations, destinations belong to trip
Trip.hasMany(Destination)
Destination.belongsTo(Trip)

module.exports = sequelize;