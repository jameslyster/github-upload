const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//create express app
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//parse requests of content type - application.json
app.use(bodyParser.json());

//Configure the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
})

//access folders
app.use(express.static(__dirname +  '/public'));

//Open index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



//Require addresses routes
require('./app/routes/address.routes.js')(app);

require('./app/routes/login.routes.js')(app);

//listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});