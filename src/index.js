var path = require("path");

var ecstatic = require("ecstatic");

var RequestDebugger = require("./request-debugger");

// Express middleware
module.exports = function(options) {
    if (!options) {
        options = {};
    }

    // Create our request-debugger
    var requestDebugger = new RequestDebugger(options);

    return function(req, res, next) {
        // Foreward requests to the request debugger
        res.on("close", function() {
            requestDebugger.emit("request", req, res);
        });

        // Serve the front end
        if ((options.path + "/" || "/request-debugger/").indexOf(req.url) != -1) {
            console.log("HERE");
            ecstatic({
                root: path.resolve(__dirname, "./front"),
                baseDir: options.path || "/request-debugger/"
            })(req, res, next);
        } else {
            next();
        }
    };
};

// Hapi Plugin
module.exports.register = function(plugin, options, next) {
    // Create our request-debugger
    var requestDebugger = new RequestDebugger(options);

    // Serve the front end
    plugin.route({
        method: "GET",
        path: path.join(options.path || "/request-debugger", "{params*}"),
        handler: {
            directory: {
                path: path.resolve(__dirname, "./front")
            }
        }
    });

    // Foreward requests to the request debugger
    plugin.events.on("tail", function(request) {
        requestDebugger.emit("request", request, request.response);
    });
    next();
};

module.exports.register.attributes = {
    pkg: require(path.resolve(__dirname, "../package.json"))
};

