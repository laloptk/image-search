'use strict';

var UrlProcessing = require(process.cwd() + '/app/controllers/urlProcessing.js');

module.exports = function (app, db, baseUrl) {
   var urlProcessing = new UrlProcessing(db);

   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });
   
   app.route("/new/:url(*)")
      .get(urlProcessing.urlProcess);
      
   app.route("/:id([0-9]+)")
      .get(urlProcessing.urlRedirect);
};
