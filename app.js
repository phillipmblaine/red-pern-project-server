require("dotenv").config();
let express = require('express');
let app = express();
let user = require('./controllers/user-controller');
let trip = require('./controllers/trip-controller');
let destination = require('./controllers/destination-controller');
const sequelize = require('./db');

sequelize.sync();
// force drops the database (gets rid of the tables)
// sequelize.sync({force: true});

app.use(require('./middleware/headers'))
app.use(express.json());
// test endpoint
app.use('/test', function (req, res) {
    res.send('This is a test endpoint for app.js.')
})
app.use('/user', user);
app.use('/trip', trip);
app.use('/destination', destination);

app.listen(process.env.PORT, function () {
    console.log(`${process.env.NAME} is listening on port ${process.env.PORT}.`)
})