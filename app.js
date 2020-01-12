var express = require('express');
var app = express();
var path = require('path');
app.use( express.static( __dirname + '/libs' ));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/test.html'));
    console.log("Started server on 5000");
});

app.listen(5000);