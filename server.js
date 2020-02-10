var express = require('express');
var request = require('request');

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req,res){
    res.send("nikal lavde");
})

var server = app.listen(8080, function(req,res){
    console.log("server started");
})