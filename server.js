const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
let Phone = require('./models/phones.model');

const app = express();

//----Tell server to use whatever port you have available
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//----Use the url if available
mongoose.connect(process.env.URL || "mongodb://admin:admins1@ds217099.mlab.com:17099/phone-store", { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;

//Runs once when connection is open
connection.once('open', () => { console.log("MongoDB database connection established successfully"); });

//Bind connection to error event (to get notification of connection errors)
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

//If application is in production
app.get('/', function (req, res) {
    Phone.find().then( phones => res.json(phones));
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}` );
});
