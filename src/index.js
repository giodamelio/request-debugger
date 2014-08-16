var path = require("path");

var ecstatic = require("ecstatic");

// Express middleware
module.exports = function(options) {
    // Default options
    if (!options) {
        options = {};
    }
    options.path = options.path + "/" || "/request-debugger/";

    return function(req, res, next) {
        // Foreward requests to the request debugger
        res.on("close", function() {
            console.log(req, res);
        });

        // Serve the front end
        if ((options.path).indexOf(req.url) != -1) {
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
    // Default options
    options.path = options.path || "/request-debugger";

    // Serve the front end
    plugin.route({
        method: "GET",
        path: path.join(options.path, "{params*}"),
        handler: {
            directory: {
                path: path.resolve(__dirname, "./front")
            }
        }
    });

    // Foreward requests to the request debugger
    plugin.events.on("tail", function(request) {
        console.log(request, request.response);
    });  
    next();
};

module.exports.register.attributes = {
    pkg: require(path.resolve(__dirname, "../package.json"))
};

