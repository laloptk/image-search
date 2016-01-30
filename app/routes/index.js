'use strict';

var ImagesProcessing = require(process.cwd() + '/app/controllers/imagesProcessing.js');

module.exports = function (app, db) {
   var imagesProcessing = new ImagesProcessing(db);

   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });
   
   app.route("/api/imagesearch/:url(*)")
      .get(imagesProcessing.apiResponse);
      
   app.route("/api/latest/imagesearch/")
      .get(imagesProcessing.latestQueries);
      
};
