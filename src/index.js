var path = require("path");

var logger = require("debug")("request-debugger");

var RequestDebugger = require("./request-debugger");

// Express middleware
module.exports = function(options) {
    var requestDebugger = new RequestDebugger(options);
    return function(req, res, next) {
        res.on("close", function() {
            requestDebugger.emit("request", req, res);
        });
        next();
    };
};

// Hapi Plugin
module.exports.register = function(plugin, options, next) {
    var requestDebugger = new RequestDebugger(options);
    plugin.events.on("tail", function(request) {
        requestDebugger.emit("request", request, request.response);
    });
    next();
};

module.exports.register.attributes = {
    pkg: require(path.resolve(__dirname, "../package.json"))
};

