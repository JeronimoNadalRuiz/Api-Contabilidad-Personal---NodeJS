'use strict';
const Operation = require('../models/operacion');
var dateFormat = require('dateformat');
const nodemailer = require('nodemailer');

function saveOperation(req, res) {
    console.log(req.body);
    //Save to mongodb
    let operation = new Operation({
        fecha: dateFormat(req.body.fecha, "isoDateTime"),
        tipo: req.body.tipo,
        concepto: req.body.concepto,
        cantidad: req.body.cantidad,
        usuario:req.body.usuario,
        predefinido: req.body.usuario
    });

    operation.save((err, operationStored) => {
        if(err){
            res.status(500).send({message: `Error al guardar operacion ${err}`});
        }
        else{
            res.status(200).send({user: operationStored});
        }
        res.end();
    });
}

function getOperacion(req, res) {
    let operacionId = req.body.operacionId;
    Operation.find({"_id" : operacionId}, (err, operaciones) => {
        if(err) return res.status(500).send({message: `Error en petición ${err}` });
        if(!operaciones) return res.status(404).send({message: 'No se han encontrado operacion'});
        res.status(200).send({operaciones});
        res.end();
    });
}



function getConceptos(req, res) {
    console.log(req.body);
    let nombreUsuario = req.body.usuario;
    Operation.find({$and: [{"usuario" : nombreUsuario},{"predefinido": true}]}, (err, concepto) => {
        if(err) return res.status(500).send({message: `Error en petición ${err}` });
        if(!concepto) return res.status(404).send({message: 'No se han encontrado conceptos'});
        res.status(200).send({concepto});
        res.end();
    });
}

function updateOperacion(req, res) {
    console.log(req.body)
    let operacionId = req.body._id;
    let update = req.body; //información a actualiar
    Operation.findOneAndUpdate({_id:operacionId}, update, (err, operacionUpdated)=>{
        if(err) {
            res.status(500).send({message: `Error al actualizar la operacion ${err}`});
        }else{
            res.status(200).send({operacion: operacionUpdated});
        }
        res.end();
    });
}

function busqueda(req, res) {
    let nombreUsuario = req.params.user;
    let concepto = req.params.concepto;
    let skip_val = req.body.skip;
    let max_val = req.body.max;
    console.log(req.body)
    Operation.find({$and: [{"usuario" : nombreUsuario},{"concepto": concepto}]}, {}, { skip: skip_val, limit: max_val }, (err, operaciones) => {
        console.log(operaciones)
        if(err) return res.status(500).send({message: `Error en petición ${err}` });
        if(!operaciones) return res.status(404).send({message: 'No se han encontrado conceptos'});
        res.status(200).send({operaciones});
        res.end();
    }).sort({fecha: -1});
}

function getOperaciones(req, res) {
    console.log(req.body);
    let nombreUsuario = req.body.usuario;
    let skip_val = req.body.skip;
    let max_val = req.body.max;
    Operation.find({"usuario" : nombreUsuario}, {},{ limit:max_val, skip:skip_val}, (err, operaciones) => {
        console.log(operaciones)

        if(err) return res.status(500).send({message: `Error en petición ${err}` });
        if(!operaciones) return res.status(404).send({message: 'No se han encontrado conceptos'});
        res.status(200).send({operaciones});
        res.end();
    }).sort({fecha: -1});
}
function busquedaPersonal(req, res) {
    console.log(req.body);
    let skip_val = req.body.skip;
    let max_val = req.body.max;
    let cantidadMin = parseInt(req.body.cantidadMin);
    if (isNaN(cantidadMin)) {cantidadMin = 0}
    let cantidadMax = parseInt(req.body.cantidadMax);
    if (isNaN(cantidadMax)) {cantidadMax = 9999999999999999999}
    let nombreUsuario = req.body.usuario;
    let concepto = req.body.concepto;
	let tipo = req.body.tipo;
    let fechaMin = dateFormat(req.body.fechaMin, "isoDateTime");
    let fechaMax = dateFormat(req.body.fechaMax, "isoDateTime");

    Operation.find({$and: [{"usuario" : nombreUsuario},{"concepto": {$regex : ".*"+concepto+".*"}},{"tipo": {$regex : ".*"+tipo+".*"}},{"cantidad":{$gte:cantidadMin, $lte:cantidadMax}},{"fecha":{$gte:fechaMin, $lte:fechaMax}}]}, (err, operaciones) => {
        console.log(operaciones)
        if(err) return res.status(500).send({message: `Error en petición ${err}` });
        if(!operaciones) return res.status(404).send({message: 'No se han encontrado conceptos'});
        res.status(200).send({operaciones});
        res.end();
    }).sort({fecha: -1}).limit(max_val).skip(skip_val);

}

function deleteOperacion(req, res) {
    console.log(req.body)
    let operacionId = req.body.operacionId;
    let nombreUsuario = req.body.usuario;
    Operation.findOneAndRemove({_id:operacionId}, (err, operacionDeleted) => {
        if(err){
            return res.status(500).send({message: `Error al eliminar la operacion: ${err.message}`});
        }
        else{
            if(!operacionDeleted){
                return res.status(404).send({message: 'Ninguna operacion encontrada'});
            }else{
                Operation.find({"usuario" : nombreUsuario}, (err, operaciones) => {
                    if(err){
                        return res.status(500).send({message: `Error en petición ${err}` });
                    }
                    else{
                        if(!operaciones){
                            return res.status(404).send({message: 'No se han encontrado conceptos'});
                        }else{
                            res.status(200).send({operaciones});
                            res.end();
                        }
                    }
                });
            }
        }
    });
}

function enviarMail(req, res){
    let nombre = req.body.nombre;
    let texto = req.body.texto;
    let email = req.body.email;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'jeronimo.nadal@gmail.com',
               pass: 'filldepute96'
           }
    });
    const mailOptions = {
    from: email, // sender address
    to: 'jeronimo.nadal@gmail.com', // list of receivers
    subject: 'Formulario de Contacto', // Subject line
    html: '<p>'+texto+'</p></br><p>'+nombre+'</p>'// plain text body
    };    
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}

function registro(req, res){

    let email = req.body.email;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'jeronimo.nadal@gmail.com',
               pass: 'filldepute96'
           }
    });
    const mailOptions = {
    from: 'noreply@contabilidadpersonal.com', // sender address
    to: email, // list of receivers
    subject: 'Registro completado', // Subject line
    html: '<p>Bienvenido a Contabilidad Personal, el registro se ha completado correctamente</p>'// plain text body
    };    
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}
module.exports = {saveOperation, getOperaciones, getConceptos, busqueda, updateOperacion, deleteOperacion, getOperacion, busquedaPersonal, enviarMail, registro};

