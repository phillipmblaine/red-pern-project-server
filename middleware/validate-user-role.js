// user needs to be logged in, knows by checking req.user has a value (is not null) // validate-session already checks the presence of the user
function authUser(req, res, next) {
    if (req.user === null) {
        res.status(403)
        return res.send('Please login or register.')
    }
    next()
}

// check if the role matches the current user's role (checked by feeding user's role into the parameter of authRole)
function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401).send('Forbidden. Insufficient permissions.')
        }
        next()
    }
}

// module.exports = {
//     authUser,
//     authRole
// }