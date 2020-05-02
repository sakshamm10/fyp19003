var express = require('express');
var request = require('request');
var path = require('path');
const fileupload = require('express-fileupload');
const { exec } = require('child_process');
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(fileupload());
app.use(express.static(__dirname + '/'));
var viz = new Viz({Module, render});

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/result', function(req, res){
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    var NTFile = req.files.inputNT;
    if (NTFile.name.substring(NTFile.name.length-3) != '.nt'){
        return res.status(400).send('Please upload an NT file.');
    }

    var filePath = __dirname + '/' + 'NTinput.nt';
    
    NTFile.mv(filePath, (error) => {
        if (error){
            console.log(error);
        }
    });

    exec("php NT2Dot.php NTinput.nt", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        
        let dotInput = stdout;
        
        viz.renderString(dotInput, {engine: 'fdp'})
        .then(function(element){
            console.log(element);
            res.send(element);
        }).catch(error => {
            console.log(error);
        });
    });
});

var server = app.listen(8080, function(req,res){
    console.log("server started");
})