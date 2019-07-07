var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var code = 0;       //helps in redirection when notice request is added successfully
var Binary = require('mongodb').Binary;
var fs=require('fs');

//----------------------------------------------------Showing the Notices--------------------------------------------------------------//

router.get('/student_notice', function (req, res) {
  if (typeof req.user == "undefined")
    res.render('go_userHome');
  else {
    var db = req.db;
    var dbo = db.db("temp_project");
    var collection = dbo.collection('student_notices');
    collection.find({}).toArray(function (err, result) {
      res.render('student_notice', { notices: result, code: code });
      code = 0;
    })
  }
});


//--------------------------------------------------For teachers and staff--------------------------------------------------------------//

router.get('/other_notice', function (req, res) {
  if (typeof req.user == "undefined")
    res.render('go_userHome');
  else {
    var db = req.db;
    var dbo = db.db("temp_project");
    var collection = dbo.collection('other_notices');
    collection.find({}).toArray(function (err, result) {
      res.render('other_notice', { notices: result, code: code });
      code = 0;
    })
  }
});

//--------------------------------------------------Uploading in request table-------------------------------------------------------------//

router.post('/upload1', function (req, res) {
  if (typeof req.user == "undefined")
    res.render('go_userHome');
  else {
    var db = req.db;
    var dbo = db.db("temp_project");
    var collection = dbo.collection('notice_requests');
    var form = new formidable.IncomingForm();
  //  form.uploadDir = "/nodeJS/temp_project/public/uploads";   //this has use when working locally
    form.keepExtensions = true;

    form.parse(req, function (err, fields, files) {
      if (err)
        console.log("error in parsing file!");

      if (files.upload.name != '') {//console.log(files.upload);
        var path = files.upload.path;   //the things below this are added later
        var data = fs.readFileSync(path);
        var insert_data = {};
        insert_data.file_data = Binary(data);
        var name=files.upload.name;
      }
      else{
        //  var path = '';
      var insert_data={};
      var name="";
      var type="";
      }
    //  console.log(name);console.log(type);
      var myobj = {
        subject: fields.subject,
        body: fields.body,
        path: insert_data,
        name: name,
      //  type: type
      };

      collection.insertOne(myobj, function (error, result) {
        if (error)
          console.log("error in insertion!");
        else {
          console.log("successful insertion");
          code = 1;
          res.redirect('/users/student_notice');
        }
      });

    });


  }
});


router.post('/upload2', function (req, res) {
  if (typeof req.user == "undefined")
    res.render('go_userHome');
  else {
    var db = req.db;
    var dbo = db.db("temp_project");
    var collection = dbo.collection('notice_requests');
    var form = new formidable.IncomingForm();
  //  form.uploadDir = "/nodeJS/temp_project/public/uploads";
    form.keepExtensions = true;

    form.parse(req, function (err, fields, files) {
      if (err)
        console.log("error in parsing file!");

      if (files.upload.name != '')
      {
        var path = files.upload.path;   //the things below this are added later
        var data = fs.readFileSync(path);
        var insert_data = {};
        insert_data.file_data = Binary(data);
        var name=files.upload.name;
      }
      else{
      var insert_data={};
      var name="";
      var type="";
      }
      var myobj = {
        subject: fields.subject,
        body: fields.body,
        path: insert_data,
        name: name,
      };

      collection.insertOne(myobj, function (error, result) {
        if (error)
          console.log("error in insertion!");
        else {
          console.log("successful insertion");
          code = 1;
          res.redirect('/users/other_notice');
        }
      });

    });


  }
});


//commment



module.exports = router;
