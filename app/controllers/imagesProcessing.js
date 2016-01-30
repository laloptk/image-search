'use strict';

var Bing = require('node-bing-api')({ accKey: 'your key here' });

function imagesProcessing(db) {
    var queries = db.collection("queries");
    var queryProjection = {"_id" : false};
    
    this.apiResponse = function(req, res){
        var skip = 0;
        if(req.query.offset) {
            skip = parseInt(req.query.offset) * 10;
        } 
         Bing.composite(req.params.url, {
          top: 10,  // Number of results (max 15 for news, max 50 if other) 
          skip: skip,   // Skip first n results 
          sources: "image", //Choices are web+image+video+news+spell 
          newsSortBy: "Date" //Choices are Date, Relevance 
        }, function(error, result, body){
           if(error) {
               throw error;
           }
           storeQueries(req);
           res.send(processResult(body));
        });
    };
    
    this.latestQueries = function(req, res) {
        
        queries.find({}, queryProjection ).sort({"when" : -1}).limit(10).toArray(function(err, documents) {
            if(err) {
               throw err;
           }
            res.send(documents);
        });
        
    };
    
    
    var processResult = function(body) {
        var imagesArray = [];
        var completeObj = body.d.results[0].Image;
        for(var index in completeObj) {
            var thisObject = {"url": completeObj[index].MediaUrl, "snippet" : completeObj[index].Title, "thumbnail" : completeObj[index].Thumbnail.MediaUrl, "context" : completeObj[index].SourceUrl };
            imagesArray.push(thisObject);
        }
        
        return imagesArray;
    };
    
    var storeQueries = function(req) {
        var date = new Date();
        queries.insert({"term": req.params.url, "when": date }, function (err) {
               if (err) {
                  throw err;
               }
        });
    };
}

module.exports = imagesProcessing;