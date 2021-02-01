require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 80;
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')


//Database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...')
}).catch(err => {
    console.log('Connection failed')
});


// Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

//Event Emmiter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// Session Configration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
}))

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());

//Flash config
app.use(flash());


//Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())


//Global Middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    res.locals.login = req.login
    next()
})


//Set the template engine
app.set('view engine', 'ejs');
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resourses/views'));

// Routes
require('./routes/web')(app);
app.use((req, res) => {
    res.status(404).render('errors/404')
})

// Server Listener
const server = app.listen(PORT, () => {
    console.log(`Listning on port ${PORT}`);
});


// Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

//For admin
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})
