//import LocalStrategy constructor
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

//function to initialize passports and use inputted functions
function initialize(passport, getUserByEmail, getUserById)  {
    //arrow function to authenticate user; call done when finished authentication
    const authenticateUser = async (email, password, done) => {
        //get user from database by email- CHANGE for DB
        const user = getUserByEmail(email)
        //if no user found with that email
        if (user == null) {
            //finish and return message indicating no match
            return done(null, false, {message: 'No user with that email' })
        }
        //asynchronous
        try {
            //if password matches database, return user
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            // if passwords do not match, send message
            else {
                return done(null, false, {message: 'Password incorrect'})
            }
        }
        //catch and return error
        catch (e) {
            return done(e)
        }
    }
    //add authentication strategy and create new instance of local strategy
    //calls authenticateUser to perform authentication
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize