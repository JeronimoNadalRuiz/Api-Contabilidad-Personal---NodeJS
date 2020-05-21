'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const UserSchema = Schema({
    nombre: {type: String, required: true},
    usuario: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    activo: {type: String, required: true}

});
UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();//hasheamos si camb
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, password, cb){
    console.log(password);
    bcrypt.compare(candidatePassword, password, function(err, isMatch){

        if(err) return cb(err);
        cb(null, isMatch);
    });
};
UserSchema.statics.findByUsername = function(usuario, cb){
    this.findOne({usuario: usuario}, cb);
};
module.exports = mongoose.model('User', UserSchema);