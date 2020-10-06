const express = require('express');
const router = express.Router();
const validateSession = require('../middleware/validate-session');
const Trip = require('../db').import('../models/trip');
// const Destination = require('../db').import('../models/destination');

router.get('/test', function (req, res) {
    res.send('This is a test endpoint for trip-controller.js')
})

// ******************** ALL USERS ******************** //
// create a trip for the current user
router.post('/create', validateSession, (req, res) => {
    Trip.create({
        tripName: req.body.trip.tripName,
        stops: req.body.trip.stops,
        numberOfStops: req.body.trip.numberOfStops,
        tripBeginDate: req.body.trip.tripBeginDate,
        tripEndDate: req.body.trip.tripEndDate,
        userId: req.user.id
    })
        .then((trip) => {
            res.status(200).json({
                trip: trip,
                message: 'Trip created.'
            })
        })
        .catch((error) => res.status(500).json({ error: error }))
})

// get all trips for the current user
router.get('/getalltrips', validateSession, (req, res) => {
    Trip.findAll({ where: { userId: req.user.id } })
        .then(trips => res.status(200).json(trips))
        .catch(error => res.status(500).json({ error: error }))
})

// get one trip by id for the current user
router.get('/gettrip/:id', validateSession, (req, res) => {
    Trip.findOne({ where: { id: req.params.id, userId: req.user.id } })
        .then(trip => res.status(200).json(trip))
        .catch(error => res.status(500).json({ error: error }))
})

// update trip by id for current user
router.put('/edit/:id', validateSession, (req, res) => {
    const updateTrip = {
        tripName: req.body.trip.tripName,
        stops: req.body.trip.stops,
        numberOfStops: req.body.trip.numberOfStops,
        tripBeginDate: req.body.trip.tripBeginDate,
        tripEndDate: req.body.trip.tripEndDate
    }
    const query = { where: { id: req.params.id, userId: req.user.id } }
    Trip.update(updateTrip, query)
        .then((trips) => res.status(200).json({
            message: 'Update complete.',
            trips: `${trips} trip(s) updated.`,
        }))
        .catch((error) => res.status(500).json({ error: error }))
})

// delete trip by id for current user
router.delete('/delete/:id', validateSession, (req, res) => {
    const query = { where: { id: req.params.id, userId: req.user.id } }
    Trip.destroy(query)
        .then(
            (onSuccess = (recordsChanged) => {
                if (recordsChanged !== 0) {
                    res.status(200).json({
                        message: 'Trip deleted.',
                        numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                    })
                } else {
                    res.status(202).json({
                        message: 'Trip not deleted.',
                        numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                    })
                }
            }))
        .catch((error) => res.status(500).json({ error: error }))
})

module.exports = router;