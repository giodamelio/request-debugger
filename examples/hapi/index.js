var hapi = require("hapi");
var requestDebugger = require("../../");

var server = new hapi.Server("localhost", 3141);

server.route({
    method: "GET",
    path: "/",
    handler: function(request, reply) {
        reply("Hello World!");
    }
});

server.pack.register({
    plugin: requestDebugger,
    options: {}
}, function(err) {
    if (err) console.log(err);
    server.start(function() {
        console.log("Server running at:", server.info.uri);
    });
});

