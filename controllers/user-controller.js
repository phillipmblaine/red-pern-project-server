require('dotenv').config();
const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let validateSession = require('../middleware/validate-session');

router.get('/test', (req, res) => {
    res.send('This is a test endpoint for user-controller.js')
});

// ******************** ALL USERS ******************** //
// create new user
router.post('/register', (req, res) => {
    User.create({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        username: req.body.user.username,
        email: req.body.user.email,
        passwordhash: bcrypt.hashSync(req.body.user.password, 10), // needs bcrypt hashsync
        role: req.body.user.role
    })
        .then(
            function createSuccess(user) {
                let token = jwt.sign({ id: user.id }, process.env.SIGNATURE, {
                    expiresIn: '1d'
                });
                res.json({
                    user: user,
                    message: 'User successfully created.',
                    sessionToken: token
                })
            }
        )
        .catch(error => res.status(500).json({ error: error }))
});

// login existing user
router.post('/login', (req, res) => {
    User.findOne({
        where: { username: req.body.user.username }
    })
        .then(
            function loginSuccess(user) {
                if (user) {
                    bcrypt.compare(req.body.user.password, user.passwordhash, function (
                        error,
                        matches
                    ) {
                        if (matches) {
                            let token = jwt.sign(
                                { id: user.id },
                                process.env.SIGNATURE, { expiresIn: '1d' }
                            );
                            res.status(200).json({
                                user: user,
                                role: user.role,
                                message: `Logged in. Welcome, ${user.username}`,
                                sessionToken: token
                            });
                        } else {
                            res.status(502).json({ error: 'Login failed.' });
                        }
                    });
                } else {
                    res.status(500).json({ error: 'User does not exist.' });
                }
            })
        .catch((error) => res.status(500).send({ error: error }))
});

// get current user, including the user's saved destinations and trips
router.get('/getuser', validateSession, (req, res) => {
    User.findOne(
        { where: { id: req.user.id }, include: ['destinations', 'trips'] })
        .then(info => {
            res.status(200).json({
                info: info,
                message: 'Get user successful.'
            })
        })
        .catch(error => res.status(500).json({ error: error }))
})

// update current user's account (user information)
router.put('/edit', validateSession, (req, res) => {
    const updateUser = {
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        username: req.body.user.username,
        email: req.body.user.email
        // should the user be able to edit password / role? Reset password feature? Stretch goal ... ?
    }
    const query = { where: { id: req.user.id } };
    User.update(updateUser, query)
        .then(
            (onSuccess = (recordsChanged) => {
                if (recordsChanged !== 0) {
                    res.status(200).json({
                        message: 'User update complete.',
                        numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                    })
                } else {
                    res.status(202).json({
                        message: 'User not updated.',
                        numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                    })
                }
            }))
        .catch((error) => res.status(500).send({ error: error }))
});

// delete current user
router.delete('/delete', validateSession, (req, res) => {
    const query = { where: { id: req.user.id } };
    User.destroy(query)
        .then((recordsChanged) => res.status(200).json({
            message: 'User deleted.',
            numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
        }))
        .catch((error) => res.status(500).send({ error: error }))
})

// ******************** ADMIN ONLY ******************** //
// get all users
router.get('/getallusers', validateSession, (req, res) => {
    switch (req.user.role) {
        case ('admin'):
            User.findAll()
                .then(users => res.status(200).json(users))
                .catch((error) => res.status(500).json({ error: error }))
            break;
        case ('user'):
            res.status(401).send(`Role: ${req.user.role}. User role detected. Forbidden.`);
            break;
        default:
            res.status(403).send(`Role: ${req.user.role}. Unknown role detected. Forbidden.`)
            break;
    }
})

// get user by id
router.get('/getuser/:id', validateSession, (req, res) => {
    switch (req.user.role) {
        case ('admin'):
            User.findOne({ where: { id: req.params.id }, include: ['destinations', 'trips'] })
                .then(info => res.status(200).json({
                    info: info,
                    message: 'User found.'
                }))
                .catch(error => res.status(500).json({ error: error }))
            break;
        case ('user'):
            res.status(401).send(`Role: ${req.user.role}. User role detected. Forbidden.`);
            break;
        default:
            res.status(403).send(`Role: ${req.user.role}. Unknown role detected. Forbidden.`)
            break;
    }
})

// edit user by id
router.put('/edit/:id', validateSession, (req, res) => {
    switch (req.user.role) {
        case ('admin'):
            const updateUser = {
                firstName: req.body.user.firstName,
                lastName: req.body.user.lastName,
                username: req.body.user.username,
                email: req.body.user.email
            }
            const query = { where: { id: req.params.id } }
            User.update(updateUser, query)
                .then(
                    (onSuccess = (recordsChanged) => {
                        if (recordsChanged !== 0) {
                            res.status(200).json({
                                message: 'User update complete.',
                                numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                            })
                        } else {
                            res.status(202).json({
                                message: 'User not updated.',
                                numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                            })
                        }
                    }))
                .catch((error) => res.status(500).send({ error: error }))
            break;
        case ('user'):
            res.status(401).send(`Role: ${req.user.role}. User role detected. Forbidden.`);
            break;
        default:
            res.status(403).send(`Role: ${req.user.role}. Unknown role detected. Forbidden.`)
            break;
    }
})

// delete user by id
router.delete('/delete/:id', validateSession, (req, res) => {
    switch (req.user.role) {
        case ('admin'):
            const query = { where: { id: req.params.id } }
            User.destroy(query)
                .then((recordsChanged) => res.status(200).json({
                    message: 'User deleted.',
                    numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                }))
                .catch((error) => res.status(500).send({ error: error }))
            break;
        case ('user'):
            res.status(401).send(`Role: ${req.user.role}. User role detected. Forbidden.`);
            break;
        default:
            res.status(403).send(`Role: ${req.user.role}. Unknown role detected. Forbidden.`)
            break;
    }
})

module.exports = router;