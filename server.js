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

app.get('/getKey', (req, res) =>{
    res.send(process.env.API_KEY)
});

app.listen(PORT, () =>
    console.log(`Starting server at port ${PORT}`)
);
