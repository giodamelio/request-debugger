var events = require("events");
var util = require("util");

// Create our request debugger
var requestDebugger = function(options) {
    this.on("request", function(request, response) {
        console.log("Request:", request);
        console.log("Response:", response);
    });
};

// Make it inherit from EventEmitter
util.inherits(requestDebugger, events.EventEmitter);

// Export it
module.exports = requestDebugger;

