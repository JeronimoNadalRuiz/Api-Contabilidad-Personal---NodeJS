var url = require('url');
var UserModel = require('../models/user');
var jwt = require('jwt-simple');
module.exports = function(req, res, next){
    var parsed_url = url.parse(req.url, true);
    var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];
    console.log("EL TOKEN QUE ME LLEGA ES: " + token);
    if(token){
        try{
            console.log("INICIO INTENTO DE DECODIFICACIÓN");
            var decoded = jwt.decode(token, 'secretvalue');
            console.log("jwt.decode() bien con valor: " + decoded);
            if(decoded.exp <= Date.now()){ res.end('Access token has expired', 400); }
            console.log("findeONe - 0");
            UserModel.findOne({'_id': decoded.iss}, function(err, user){
                console.log("findeONe - 1 ");
                if(!err) { req.user = user; return next(); }
            });
        }catch(err){ console.log(err); return next();}
    }else{
        console.log("ERROR: token vacio - El else del IF(token");
        next();
    }
    console.log("llega justo antes del return inicial");
};
