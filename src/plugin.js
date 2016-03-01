"use strict";

const radio = require("./radio");

exports.register = function (server, options, next) {

    //erstma so starten
    server.method("intercom.getChannel", function (channel, options) {
		channel = channel || "universal";
		options = options || {};
        //options.remote connects to redis
		
        return radio.channel(channel, options);
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};