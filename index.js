'use strict';
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const app = require('./app');

//Contect to Mongo
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/contabilidad', (err, res) => {
    if (err) {
        return console.log(`Error al conectar a la BD: ${err}`);
    }
    console.log('Conexión establecida a la BD');
    app.listen(port, () => {
        console.log(`Levantado ${port}`);
    });
});