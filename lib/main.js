var socket = require("./socket");
var rpc = require("./rpc");

module.exports = function(codebox) {
    codebox.logger.log("start terminal");

    codebox.socket.service("terminal", socket);
    codebox.rpc.service("terminal", rpc);
};
