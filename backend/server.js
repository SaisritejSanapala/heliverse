const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

const { MONGODB_URL } = require('./config');

global.__basedir = __dirname;

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connnected', () => {
    console.log("DB connected")
});

mongoose.connection.on('error', (error) => {
    console.log("Error occurred while connecting to db", error)
});




require('./models/user_model');
require('./models/group_model');




app.use(require('./routes/user_route'));
app.use(require('./routes/file_route'));


app.listen(PORT, () => {
    console.log("Server started on port", PORT);

}) 