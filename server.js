var express = require('express');
var request = require('request');
var path = require('path');

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/home.html'));
})

app.get('/result', function(req, res){
    res.sendFile(path.join(__dirname+'/HIN.svg'));
})

var server = app.listen(8080, function(req,res){
    console.log("server started");
})