const express = require('express');
const path = require('path');


require('dotenv').config();


const app = express();

const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));


app.get('/', function (req, res) {

    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () =>
    console.log(`Starting server at port ${PORT}`)
);