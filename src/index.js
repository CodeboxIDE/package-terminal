define([
    "src/tab",
    "less!src/stylesheets/main.less"
], function(TerminalTab) {
    var commands = codebox.require("core/commands");

    commands.register({
        id: "terminal.open",
        title: "Terminal: Open",
        run: function(args, context) {
            return codebox.tabs.add(TerminalTab, {
                cmd: ""
            }, {
                type: "terminal",
                title: "Terminal",
                section: "terminal"
            });
        }
    });
});