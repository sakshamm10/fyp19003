var express = require('express');
var request = require('request');
var path = require('path');
const fileupload = require('express-fileupload');

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(fileupload());

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/home.html'));
});

app.post('/result', function(req, res){
    var NTFile = req.files.inputNT;
    var filePath = __dirname + '/' + 'NTinput.nt';
    
    NTFile.mv(filePath, (error) => {
        if (error){
            console.log(error);
        }
    });
    
    res.sendFile(path.join(__dirname+'/HIN.svg'));
});

var server = app.listen(8080, function(req,res){
    console.log("server started");
})