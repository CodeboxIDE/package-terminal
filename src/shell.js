var _ = codebox.require("hr.utils");
var Class = codebox.require("hr.class");
var hash = codebox.require("utils/hash");
var Socket = codebox.require("core/socket");

var logging = codebox.require("hr.logger")("terminal");

var Shell = Class.extend({
    defaults: {},

    initialize: function() {
        Shell.__super__.initialize.apply(this, arguments);
        this.shellId = this.options.shellId || _.uniqueId("term");

        return this;
    },

    /*
     *  Connect to the terminal
     */
    connect: function() {
        var that = this;
        if (this.socket != null) {
            return this;
        }

        this.socket = new Socket({
            service: "terminal"
        });

        this.listenTo(this.socket, "close", function() {
            this.trigger("disconnect");
        });

        this.listenTo(this.socket, "do:output", function(data) {
            this.trigger("data", hash.atob(data));
        });

        this.listenTo(this.socket, "open", function() {
            this.trigger("connect");

            this.socket.do('open', {
                "shellId": that.shellId,
                "opts": {
                    "rows": 80,
                    "columns": 24,
                    "id": that.shellId,
                    "cwd": that.options.cwd
                }
            });
        });
    },

    /*
     *  Disconnect
     */
    disconnect: function() {
        if (this.socket != null) {
            this.socket.close();
        }
        return this;
    },

    /*
     *  Write content
     */
    write: function(buf) {
        if (this.socket != null) {
            this.socket.do("input", hash.btoa(buf));
        }
        return this;
    },

    /*
     *  Resize the shell
     */
    resize: function(w, h) {
        if (this.socket != null) {
            this.socket.do("resize", {
                "rows": h,
                "columns": w
            });
        }
        return this;
    },

    /*
     *  Force destroy the shell
     */
    forceDestroy: function() {
        if (this.socket != null) {
            this.socket.do("destroy");
        }
        return this;
    }
});

module.exports = Shell;
