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

afterEach(function() {
    server.stop();
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
    
    it("should reply with a rejected promise when no handler is bound", function (done) {
        server.route({
            method: 'GET',
            path: '/1',
            config: {
                handler: function (request, reply) {
                    server.methods.intercom.getChannel("testing").request("testing").then(function (res) {
                    }).catch(function(err) {
                        expect(err).to.be.an.instanceof(Error);
                        
                        reply(err);
                    });
                }
            }
        });

        server.start(function (err) {
            server.inject({
                method: 'GET',
                url: '/1'
            }, function (res) {
                done();
            });
        });
    });

});

describe("hapi intercom command/comply", function () {

    it("should comply to a command", function (done) {
        server.route({
            method: 'GET',
            path: '/1',
            config: {
                handler: function (request, reply) {
                    console.log("START");
                    server.methods.intercom.getChannel("test").comply("test", function () {
                        console.log("COMPLY");
                        reply({
                            success: true
                        });
                    });
                    server.methods.intercom.getChannel("test").command("test");
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
	
	it("comply should return a promise", function (done) {
        server.route({
            method: 'GET',
            path: '/1',
            config: {
                handler: function (request, reply) {
                    console.log("START");
                    server.methods.intercom.getChannel("test").comply("test", function () {
						return true;
                    });
                    server.methods.intercom.getChannel("test").command("test").then(function(suc) {
						reply({
                            success: suc
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
});
