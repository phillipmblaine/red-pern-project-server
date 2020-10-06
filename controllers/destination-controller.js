const express = require('express');
const router = express.Router();
const validateSession = require('../middleware/validate-session');
const Destination = require('../db').import('../models/destination')

router.get('/test', function (req, res) {
    res.send('This is a test endpoint for destination-controller.js')
})

// ******************** ALL USERS ******************** //
// create destination for the current user
router.post('/create', validateSession, (req, res) => {
    Destination.create({
        xid: req.body.destination.xid,
        name: req.body.destination.name, // the only required field
        country: req.body.destination.country,
        latitude: req.body.destination.latitude,
        longitude: req.body.destination.longitude,
        description: req.body.destination.description,
        kinds: req.body.destination.kinds,
        rating: req.body.destination.rating,
        favorite: req.body.destination.favorite,
        userId: req.user.id
    })
        .then((destination) => {
            res.status(200).json({
                destination: destination,
                message: 'Destination created.'
            })
        })
        .catch((error) => res.status(500).json({ error: error }))
})

// create destination that belongs to a trip for the current user
router.post('/create/:tripId', validateSession, (req, res) => {
    Destination.create({
        xid: req.body.destination.xid,
        name: req.body.destination.name, // required field
        country: req.body.destination.country,
        latitude: req.body.destination.latitude,
        longitude: req.body.destination.longitude,
        description: req.body.destination.description,
        kinds: req.body.destination.kinds,
        rating: req.body.destination.rating,
        favorite: req.body.destination.favorite,
        userId: req.user.id,
        tripId: req.params.tripId // perhaps this can be accepted by a value grabbed for the specific trip on the front end, ex. event click
    })
        .then((destination) => {
            res.status(200).json({
                destination: destination,
                message: `Destination created, added to trip with id ${req.params.tripId}.`
            })
        })
        .catch((error) => res.status(500).json({ error: error }))
})

// get all destinations for current user
router.get('/getalldestinations', validateSession, (req, res) => {
    Destination.findAll({
        where: { userId: req.user.id }
    })
        .then(destinations => res.status(200).json(destinations))
        .catch(error => res.status(500).json({ error: error }))
})

// get one destination by id for current user
router.get('/getdestination/:id', validateSession, (req, res) => {
    Destination.findOne({ where: { id: req.params.id, userId: req.user.id } })
        .then(destination => res.status(200).json(destination))
        .catch(error => res.status(500).json({ error: error }))
})

// update destination by id for current user
router.put('/edit/:id', validateSession, (req, res) => {
    const updateDestination = {
        xid: req.body.destination.xid,
        name: req.body.destination.name, // the only required field
        country: req.body.destination.country,
        latitude: req.body.destination.latitude,
        longitude: req.body.destination.longitude,
        description: req.body.destination.description,
        kinds: req.body.destination.kinds,
        rating: req.body.destination.rating,
        favorite: req.body.destination.favorite,
        tripId: req.body.destination.tripId
    }
    const query = { where: { id: req.params.id, userId: req.user.id } }
    console.log("Current user id:", req.user.id)
    Destination.update(updateDestination, query)
        .then((destinations) => res.status(200).json({
            message: 'Update complete.',
            destinations: `${destinations} destination(s) updated.`
        }))
        .catch((error) => res.status(500).json({ error: error }))
})

// delete destination by id for current user
router.delete('/delete/:id', validateSession, (req, res) => {
    const query = { where: { id: req.params.id, userId: req.user.id } }
    Destination.destroy(query)
        .then((onSuccess = (recordsChanged) => {
            if (recordsChanged !== 0) {
                res.status(200).json({
                    message: 'Destination deleted.',
                    numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                })
            } else {
                res.status(202).json({
                    message: 'Destination not deleted.',
                    numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                })
            }
        })
        )
        .catch((error) => res.status(500).json({ error: error }))
})

module.exports = router;