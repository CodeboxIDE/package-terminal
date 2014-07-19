define([

], function() {
    var commands = codebox.require("core/commands");

    commands.register({
        id: "terminal.open",
        title: "Termianl: Open",
        run: function(args, context) {
            /*return codebox.tabs.add(codebox.tabs.HtmlPanel, {
                className: "component-markdown-preview",
                content: markdown.render(context.getContent())
            }, {
                type: "markdown",
                title: "Markdown: " + context.model.get("name"),
                section: "markdown"
            });*/
        }
    });
});