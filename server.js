var express = require('express');
var request = require('request');
var path = require('path');
const fileupload = require('express-fileupload');
const { exec } = require('child_process');
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
var fs = require('fs');

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(fileupload());
var viz = new Viz({Module, render});

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/home.html'));
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

    exec("php NT2Dot.php NTinput.nt", {maxBuffer: 1000 * 1024}, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        
        let dotInput = stdout;
        
        fs.writeFile('dot_input.txt', dotInput, (err) => {
            if (err) throw err;
            console.log('Saved!');
        });
        
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