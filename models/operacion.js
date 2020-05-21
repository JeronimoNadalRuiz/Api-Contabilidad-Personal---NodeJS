'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OperacionSchema = Schema({
    fecha: {type: Date, required: true},
    tipo: {type: String, enum:['Ingreso', 'Gasto'], required: true},
    concepto: {type: String, required: true},
    cantidad: {type: Number, required: true},
    usuario: {type: String, required: true},
    predefinido: {type: Boolean, default: false},
});
module.exports = mongoose.model('Operacion', OperacionSchema);