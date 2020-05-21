'use strict';
const User = require('../models/user');
const moment = require('moment');
const jwt = require('jwt-simple');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('jwtTokenSecret', 'secretvalue');

function saveUser(req, res) {
    console.log(req.body);
    //Save to mongodb
    let user = new User(req.body);

    user.save((err, userStored) => {
        if(err){
            res.status(500).send({message: `Error al guardar usuario ${err}`});
        }
        else{
            res.status(200).send({user: userStored});
        }
        res.end();
    });
}
function getUsers(req, res){
    console.log(req.body)
    let skip_val = req.body.skip;
    let max_val = req.body.max;
    User.find({ "nombre": { $ne: "admin"}}, {},{ limit:max_val, skip:skip_val}, (err, usuarios) => {
        if(err) return res.status(500).send({message: `Error en petición ${err}` });
        if(!usuarios) return res.status(404).send({message: 'No se han encontrado usuarios'});
        res.status(200).send({usuarios});
        res.end();
    });
}
function deleteUsuario(req, res) {
    console.log(req.body)
    let usuarioId = req.body._id;
    let nombreUsuario = req.body.usuario;
    User.findOneAndRemove({_id:usuarioId}, (err, usuerioDeleted) => {
        if(err){
            return res.status(500).send({message: `Error al eliminar la operacion: ${err.message}`});
        }
        else{
            if(!usuerioDeleted){
                return res.status(404).send({message: 'Ninguna operacion encontrada'});
            }else{
                User.find({"usuario" : nombreUsuario}, (err, usuarios) => {
                    if(err){
                        return res.status(500).send({message: `Error en petición ${err}` });
                    }
                    else{
                        if(!usuarios){
                            return res.status(404).send({message: 'No se han encontrado conceptos'});
                        }else{
                            res.status(200).send({usuarios});
                            res.end();
                        }
                    }
                });
            }
        }
    });
}
function desactivarUsuario(req, res) {
    console.log(req.body)
    let userId = req.body._id;
    let update = req.body; //información a actualiar
    User.findOneAndUpdate({_id:userId}, update, (err, usuarioUpdated)=>{
        if(err) {
            res.status(500).send({message: `Error al actualizar usuario ${err}`});
        }else{
            res.status(200).send({operacion: usuarioUpdated});
        }
        res.end();
    });
}
function logIn(req,res){
	console.log(req.body);
    let nombreUsuario = req.body.usuario;
    let password = req.body.password;
    /*User.findOne({"usuario" : nombreUsuario}, (err, usuario) => {
        if(err) return res.status(500).send({message: `Error en petición ${err}` });
        if(!usuario) return res.status(404).send({message: 'Usuario y/o contraseña incorrecto'});
        if(usuario.password==password){
            return res.status(200).send({message: 'Datos correctos', user:usuario});
        }else{
            console.log(usuario + password);
            return res.status(404).send({message: 'No se ha encontrado el usuario'});
        }
        res.end();
    });*/
    User.findOne({"usuario" : nombreUsuario}, (err, usuario) => {
        if(err || usuario==null){
            console.log("No encuentra el usuario");
            return res.status(401).send('Authentication error - No usuario');
        }else {
            usuario.comparePassword(password, usuario.password, function (err, isMatch) {
                if (err){
                    console.log("No encuentra el usuario");
                    return res.status(401).send({message:`Error in password' ${err}`});
                }else{
                    if (isMatch) {
                        var expires = moment().add('days', 7).valueOf();
                        var token = jwt.encode({iss: usuario.id, exp: expires}, app.get('jwtTokenSecret'));
                        res.json({email: usuario.email, token: token, expires: expires, activo:usuario.activo});
                    } else {
                        console.log(usuario + password);
                        return res.status(404).send({message: 'No se ha encontrado el usuario'});
                    }
                }
            });
        }
    });
}

module.exports = { saveUser, logIn, getUsers, desactivarUsuario, deleteUsuario};

