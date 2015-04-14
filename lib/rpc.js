var Q = require("q");
var _ = require("lodash");
var shells = require("./shells");

var getShell = function(id) {
    if(!id) {
        return Q.reject(new Error("Missing Shell ID"));
    } else if(shells.manager.shells[id]) {
        return Q(shells.manager.shells[id].ps);
    }
    return Q.reject(new Error("Shell '"+ id +"' does not exist"));
};

// Run a command in a new shell
var create = function(args) {
    args.shellId = args.shellId || _.uniqueId("shell");
    return shells.manager.createShellCommand(args.shellId, args.command, args.opts || {})
    .then(function() {
        return {
            shellId: args.shellId
        };
    });
};

// List shells
var list = function() {
    return shells.manager.list();
};

// Destroy a shell
var destroy = function(args) {
    return getShell(args.shellId || args.id)
    .then(function(shell) {
        return shell.destroy();
    });
};

// Resize a shell
var resize = function(args) {
    return getShell(args.shellId || args.id)
    .then(function(shell) {
        return shell.resize(args.columns, args.rows);
    });
};

module.exports = {
    'create': create,
    'resize': resize,
    'destroy': destroy,
    'list': list
};
