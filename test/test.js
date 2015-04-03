// Load modules

var Boom = require('boom');
var Hapi = require('hapi');

var expect = require('chai').expect;

// Declare internals

var server;

beforeEach(function (done) {
    server = new Hapi.Server();
    server.connection();

    var options = {};

    server.register({
        register: require("../"),
        options: options
    }, function (err) {
        done(err);
    });


});

describe("hapi intercom publish/subscribe", function () {

    it("should register without error", function (done) {
        done();
    });

    it("should register to a an event and trigger it", function (done) {

        server.route({
            method: 'GET',
            path: '/1',
            config: {
                handler: function (request, reply) {
                    server.methods.intercom.getChannel("test").on("triggerTest", function () {
                        reply({
                            success: true
                        });
                    });
                    server.methods.intercom.getChannel("test").emit("triggerTest");
                }
            }
        });

        server.start(function (err) {
            server.inject({
                method: 'GET',
                url: '/1'
            }, function (res) {

                expect(res.result).to.be.an.object;
                expect(res.result.success).to.equal(true);

                done();
            });
        });
    });

});

describe("hapi intercom request/response", function () {

    it("should reply to an request", function (done) {
        server.route({
            method: 'GET',
            path: '/1',
            config: {
                handler: function (request, reply) {
                    server.methods.intercom.getChannel("test").reply("test", function () {
                        return new Promise(function (resolve, reject) {
                            setTimeout(function () {
                                resolve();
                            }, 100);
                        });
                    });
                    server.methods.intercom.getChannel("test").request("test").then(function () {
                        reply({
                            success: true
                        });

                    });
                }
            }
        });

        server.start(function (err) {
            server.inject({
                method: 'GET',
                url: '/1'
            }, function (res) {

                expect(res.result).to.be.an.object;
                expect(res.result.success).to.equal(true);

                done();
            });
        });
    });
    
    it("should wrap the callback result in a promise", function (done) {
        server.route({
            method: 'GET',
            path: '/1',
            config: {
                handler: function (request, reply) {
                    server.methods.intercom.getChannel("test").reply("test", function () {
                        return {
                            works: true
                        };
                    });
                    server.methods.intercom.getChannel("test").request("test").then(function (res) {
                        reply(res);

                    });
                }
            }
        });

        server.start(function (err) {
            server.inject({
                method: 'GET',
                url: '/1'
            }, function (res) {

                expect(res.result).to.be.an.object;
                expect(res.result.works).to.equal(true);

                done();
            });
        });
    });

});