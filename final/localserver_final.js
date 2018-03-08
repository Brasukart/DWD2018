
//(2018 - update February 15) Config.js
//(2018 - updated February 14) Adding Database
//(2018 - updated February 13) Recreating the Express server exercise from DWD Servers class, but this time for localhosting. I'm comparing the originalr "server.js" with the "myapp/app.js" express file.
//(2018 - update March) - Adding Cheerio to parse HTML data from a URL and then exihibit this data on the browser while storing it on my database.

var config = require("./config.js");
var express = require ('express');
var bodyParser = require ('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true});
var url ="https://www.indeed.com/cmp/Findly---New-York---NYU-(Hosted-Jobs)/jobs/Assistant-Associate-Research-Scientist-820be15f2b19585f?sjdu=Zzi_VW2ygsY1fzh3Ma9ZsE4zIT1NTXCwgFBhdjeTC3MlEUIEyXxTWn9zDNDDoDOmN1o3gDCq0F_RyXjtt2GzkQ&tk=1c830c9jga35rd1f&vjs=3";
var port = 8080;
var path = require ('path');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app = express();

//Connect to mLab MongoDB database (after installing the node module)
var mongojs = require('mongojs');
//Bad idea to put your password in a file that's going to be sent to Github. Better use a config.js - but don't know how to access it!
// var db = mongojs("brasil.gabriel:Idunnodwd2018@ds235768.mlab.com:35768/dwd2018", ["DBtest00"]);

var db = mongojs(config.db_username +":" + config.db_password + "@ds235768.mlab.com:35768/dwd2018", ["DBtest00"]);
console.log(config.db_username);
//mongodb://<dbuser>:<dbpassword>@ds235768.mlab.com:35768/dwd2018
//var db = mongojs("username:password@example.com:port/mydb", ["mycollection"]);

app.listen(port, function(){
  console.log('Local host server on port ' + port);
})

//Use cheerio to parse the "body" of a page and return a ".class"
request(url, function(err, resp, body){
  var $ = cheerio.load(body);
  var companyName =$('.company');
  //have to declare second variable (cheerio jquery youtube video)
  var companyNameText = companyName.text();

  console.log(companyNameText);

  //save it to Database

  // db.DBtest00.save({"companyNameText":companyName.text}, function(err, saved){
  //     if( err || !saved) console.log("Cheerio Not saved");
  //
  //     else console.log("Cheerio saved");




})



//DB: Pull all records
db.DBtest00.find({}, function(err, saved){
  if(err||!saved){
    console.log("No Results");
  }
  else {
      saved.forEach(function(record){
        console.log(record);
      });
  }
});

app.use(urlencodedParser);

//activating TEMPLATE in "/views/template.ejs"
app.set('view engine', 'ejs');

//Allows for Express to access the static files (CSS, Images, etc) inside ""/public". Otherwise the .EJS file can't access CSS like a ".HTML" can.//
app.use(express.static(__dirname + '/public'));

//(OPTION 01)this uses the templates as the response to a request get/post//
//"person.name" and "person.other" are referencing the "template.ejs" file
// app.get('/templatetest', function (req, res){
//    var data= {person: {name: "Shawn", other: "blah"}};
//    res.render('template.ejs', data);
// });



//(OPTION 02) Array of DATA//
// app.get('/templatetest', function (req, res){
//    var data= {people: [{name: "Shawn", other: "blah"}, {name: "Juca", other: "No"}, {name: "Pedro", other: "Nope"}]};
//    res.render('template.ejs', data);
// });

//(OPTION 02-B test) Array of DATA//
// app.get('/templatetest', function (req, res){
//    var data= {people: [{name: "textfield", other: "blah"}, {name: "textfield02", other: "No"}, {name: "Pedro", other: "Nope"}]};
//    res.render('template.ejs', data);
//
// });


//"post" request
// app.post('/processit', function(req, res) {
//     var textvalue = req.body.textfield;
//     var textvalue02 = req.body.textfield02;
//     res.send("What make you think you are going to achieve " + textvalue +" ?!!"+ "And how dare you say " + textvalue02 +"? Not COOL!");
//     //DB: Insert a record into the Database. (update Shawn 0215: cut and pasted the "db.DBtest00.save..."" inside this "app.post")
//     // db.DBtest00.save({"textfield":textvalue, "textfield02":textvalue02}, function(err, saved){
//     //     if( err || !saved) console.log("Not saved");
//     //
//     //     else console.log("saved");
//     // });
//   });


//simple request//
// app.get('/somethingelse', function(req, res){
//   res.send('Fala aê mundo!')
// })
