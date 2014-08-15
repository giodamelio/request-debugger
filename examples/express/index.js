var express = require("express");
var requestDebugger = require("../../");

var app = express();

app.use(requestDebugger());

app.get("/", function(req, res) {
    res.send("Hello World!");
});

app.listen(3141);
console.log("Express example listening on http://localhost:3141");

