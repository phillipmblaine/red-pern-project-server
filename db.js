const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE_URL ||
    `postgresql://postgres:${encodeURIComponent(process.env.PASS)}@localhost/${process.env.NAME}`,
    {
        dialect: 'postgres',
    })

sequelize.authenticate().then(
    function () {
        console.log(`Connected to ${process.env.NAME} postgres database.`);
    },
    function (error) {
        console.log("ERROR:", error);
    }
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

// Abandoned many-to-many, going for one-to-many instead, each destination is a separate instance for each trip
// a user can have many trips --> a trip can have many destinations (or just one). Many to Many?
// db can be automatically generated, or can be manually defined as below
// const destinationTrips = sequelize.define('destinationsTrips', {}, {timestamps: false}) // timestamps: false removes the time columns
// const destinationTrips = sequelize.define('destinationsTrips', {}) // timestamps: false removes the time columns
// Destination.belongsToMany(Trip, {
//     through: destinationTrips,
//     // // as: 'trip',
//     // foreignKey: 'destinationId',
//     // sourceKey: 'id'
// })
// Trip.belongsToMany(Destination, {
//     through: destinationTrips,
//     // // as: 'destination',
//     // foreignKey: 'tripId',
//     // sourceKey: 'id'
// })

// let z;
// function createDummyData() {
//     // const user1 = User.create({
//     User.create({
//         firstName: 'firstName1',
//         lastName: 'lastName1',
//         username: 'username1',
//         email: 'email1',
//         passwordhash: 'password1',
//         role: 'admin'
//     })
//     // const destination1 = Destination.create({
//     Destination.create({
//         xid: '1',
//         name: 'name1',
//         country: 'country1',
//         latitude: 1,
//         longitude: 1,
//         description: 'description1',
//         kinds: 'kinds1',
//         rating: 1,
//         favorite: false,
//         // userId: 1
//     })
//     // const trip1 = Trip.create({
//     Trip.create({
//         tripName: 'tripName1',
//         stops: ['Japan', 'South Korea'],
//         numberOfStops: 2,
//         tripBeginDate: 2020 - 12 - 12,
//         tripEndDate: 2020 - 12 - 30,
//         // userId: 1
//     })
//     addDestinationToTrip()
//     // z = [user1, destination1, trip1]
//     // return z
// }

// createDummyData();

// const promise1 = new Promise((res, rej) => {
//     resolve('Success.')
// })
// promise1.then((value) => {
//     // console.log(value)
//     return value
// })

// console.log('user1:', user1)
// console.log('destination1:', destination1)
// console.log('trip1', trip1)

// trying hasMany to see if it can work?
// destinationsTrips.hasMany(Trip, {
//     foreignKey: 'id',
//     sourceKey:
// })

module.exports = sequelize;