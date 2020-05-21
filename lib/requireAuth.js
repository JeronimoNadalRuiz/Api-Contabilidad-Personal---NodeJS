'use strict';
var jwt = require('jwt-Simple');
module.exports = (req, res, next)=>{
        if (!req.user) {res.end('No estás autorizado a ver esta ruta')}
        else {next();}
};