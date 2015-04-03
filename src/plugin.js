var radio = require("./radio");

exports.register = function (server, options, next) {

    //erstma so starten
    server.method("intercom.getChannel", function (channel) {
        channel = channel || "universal";
        
        return radio.channel(channel);
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};