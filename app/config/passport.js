const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        //Login Logic
        //check id email exist
        const user = await User.findOne({
            email: email
        })
        if (!user) {
            return done(null, false, {
                message: 'User not found'
            })
        }

        //check if password match
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, {
                    message: 'Login successful'
                })
            }
            return done(null, false, {
                message: 'Incorrect Username or Password'
            })
        }).catch(err => {
            return done(null, false, {
                message: 'Something went wrong'
            })
        })

    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}

module.exports = init