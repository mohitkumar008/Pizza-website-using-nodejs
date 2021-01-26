const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

const PORT = process.env.PORT || 3000;

//Assets
app.use(express.static('public'));


//Set the template engine
app.set('view engine', 'ejs');
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resourses/views'));

// Get Request
require('./routes/web')(app);


// Server Listener
app.listen(PORT, () => {
    console.log(`Listning on port ${PORT}`);
});