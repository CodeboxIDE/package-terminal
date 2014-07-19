var socket = require("./socket");
var rpc = require("./rpc");
var shells = require("./shells");

module.exports = function(codebox) {
    codebox.logger.log("start terminal");

    shells.init(codebox);

    codebox.socket.service("terminal", socket);
    codebox.rpc.service("terminal", rpc);
};
