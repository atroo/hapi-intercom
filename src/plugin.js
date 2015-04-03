var radio = require("./radio");

exports.register = function (plugin, options, next) {

    //erstma so starten
    plugin.method("intercom.getChannel", function (channel) {
        channel = channel || "universal";
        
        return radio.channel(channel);
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};