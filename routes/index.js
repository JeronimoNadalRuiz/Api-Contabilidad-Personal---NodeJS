'use strict';
const express = require('express');
const productController = require('../controllers/operacion');
const userController = require('../controllers/user');
const api = express.Router();
const jwtauth = require('../lib/jwtauth');
const requireAuth = require('../lib/requireAuth');

//Listening
//product

//user
api.post('/usuario', userController.saveUser);
api.post('/login', userController.logIn);
api.post('/usuarios', userController.getUsers);
api.put('/usuario', userController.desactivarUsuario);
api.post('/usuario/eliminar', userController.deleteUsuario);

api.post('/operacion', jwtauth, requireAuth,productController.saveOperation);
api.post('/operacion/conceptos',jwtauth, requireAuth, productController.getConceptos);
api.post('/operacion/id/',jwtauth, requireAuth, productController.getOperacion);
api.post('/operacion/busqueda',jwtauth, requireAuth, productController.getOperaciones);
api.post('/operacion/busquedaPersonal',jwtauth, requireAuth, productController.busquedaPersonal);
api.put('/operacion',jwtauth, requireAuth, productController.updateOperacion);
api.post('/operacion/eliminar',jwtauth, requireAuth, productController.deleteOperacion);
api.post('/enviarMail',jwtauth, requireAuth, productController.enviarMail);

api.get('/operacion/busqueda2/:user/:concepto',jwtauth, requireAuth, productController.busqueda);

module.exports = api;