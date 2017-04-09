var assert = require('assert');
var sinon = require('sinon');

/* Dependency modules */
var socketService = require('../socketService.js');
var logger = require('../logger.js');

/* Modules being tested */
var server = require('../server.js');

describe('Server tests', function() {
    var messageRouterSpy, loggerSpy, serverOnSpy, serverCloseSpy;
    var testConfig = {
        port: 3000,
        host: 'localhost'
    };
    before(function () {
        messageRouterSpy = sinon.spy();
        loggerSpy = sinon.spy(logger, 'log');
        sinon.stub(socketService, 'createServerSocket')
            .returns({
                on: (serverOnSpy = sinon.spy()),
                close: (serverCloseSpy = sinon.spy())
            });
    });
    it('can create a socket server', function () {
        var testServer = server.create(messageRouterSpy, testConfig);

        assert.equal(testServer.on.callCount, 2, "Server socket 'on' called an unexpected # of times");
        assert.ok(testServer.on.firstCall.calledWith('connection', sinon.match.func));
        assert.ok(testServer.on.secondCall.calledWith('error', sinon.match.func));

        assert.equal(process.listenerCount('exit'), 1, "Listener not added for process exit");
        assert.ok(process.listenerCount('SIGINT') >= 1, "Listener not added for process interruption/cancel");
    });
    it('can assign handlers to client on connection', function () {
        var testServer = server.create(messageRouterSpy, testConfig);
        var clientSocket = {
            on: sinon.spy()
        };

        testServer.on.firstCall.args[1](clientSocket);
        assert.ok(loggerSpy.called);
        assert.equal(clientSocket.on.callCount, 2, "Client socket 'on' called an unexpected # of times");
        assert.ok(clientSocket.on.firstCall.calledWith('message', sinon.match.func));
        assert.ok(clientSocket.on.secondCall.calledWith('error', sinon.match.func));
    });
    // it('can call messageRouter handle on client message', function () {

    // });
    it('can cleanup server', function () {
        var testServer = server.create(messageRouterSpy, testConfig);

        server.cleanup(testServer);
        assert.ok(loggerSpy.called);
        assert.ok(serverCloseSpy.called, "Server not closed up on cleanup");
    });
    afterEach(function () {
        messageRouterSpy.reset();
        loggerSpy.reset();
        serverOnSpy.reset();
        serverCloseSpy.reset();
    });
});