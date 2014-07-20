var Q = require("q");
var _ = require("lodash");

var socket = require("./socket");
var rpc = require("./rpc");
var shells = require("./shells");

module.exports = function(codebox) {
    codebox.logger.log("start terminal");

    shells.init(codebox);

    codebox.socket.service("terminal", _.partial(socket, codebox));
    codebox.rpc.service("terminal", rpc);
};
