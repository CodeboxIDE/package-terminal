// Requires
var Q = require('q');
var _ = require('lodash');
var path = require('path');
var os = require('os');
var shux = require('shux');

var utils = require('./utils');

var manager = shux();

var init = function(codebox) {
    var events = codebox.events;
    var workspace = codebox.workspace;

    // Monkey patch createShell
    var oldCreateShell = manager.createShell.bind(manager);
    manager.createShell = function(id, opts) {
        opts = opts || {};
        return Q.all([
            workspace.path("."),
            (
                (opts.command || opts.args)?
                    Q(opts.command) :
                    manager.getDefaultShell()
            )
        ])
        .spread(function(wroot, shellCmd) {
            opts = _.defaults(opts, {
                cwd: "/"
            });
            opts.command = shellCmd;
            opts.cwd = path.join(wroot, opts.cwd || "./");
            return opts;
        })
        .then(function(opts) {
            return oldCreateShell(id, opts);
        });
    };

    // Simplify shell creation
    manager.createShellCommand = function(shellId, args, opts) {
        var exitCMD = "read -p  $'####\\n# Press \\e[00;31mENTER\\e[00m to close this shell ...\\n####\\n'";

        // Spawn shell
        console.log(shellId, (_.isString(args) ?
                    [args] :
                    (args || [])
                ).concat([';', exitCMD]).join(' '));
        return manager.createShell(_.defaults({}, opts || {}, {
            id: shellId,
            command: 'bash',
            arguments: [
                '-c',
                (_.isString(args) ?
                    [args] :
                    (args || [])
                ).concat([';', exitCMD]).join(' ')
            ],
            cwd: workspace.root()
        }));
    };

    // Get the systems default shell
    // this is memoized to only be called once
    manager.getDefaultShell = _.memoize(function() {
        var cmd = {
            'linux': 'getent passwd $USER | cut -d: -f7',
            'darwin': 'finger $USER | grep Shell | cut -d ":" -f3 | cut -d " " -f2'
        }[os.platform()];

        // If on unknown platform
        if(!cmd || !process.env.USER) {
            return Q('bash');
        }

        return utils.exec(cmd)
        .get('stdout')
        .then(function(shellCmd) {
            return shellCmd.trim();
        }, function() {
            // Fallback to bash on failure
            return 'bash';
        });
    });

    // Pre cache call to getDefaultShell
    manager.getDefaultShell();

    // Utility function for connecting emitter to eventbus
    var emit = function shellEmit(eventId, shellId) {
        return events.emit(eventId, {
            shellId: shellId
        });
    };

    // Connect shell manger to event bus
    manager.on('exit', _.partial(emit, 'shell.exit'));
    manager.on('spawn', _.partial(emit, 'shell.spawn'));

    manager.on('attach', _.partial(emit, 'shell.attach'));
    manager.on('detach', _.partial(emit, 'shell.detach'));
};

module.exports = {
    manager: manager,
    init: init
};
