'use strict';

function urlProcessing(db) {
    var urls = db.collection('urls');
    var sum = { $group: { _id:  null, count: { $sum: 1 } } };
    var urlProjection = {"_id": false};

    this.urlProcess = function(req, res) {
        var url = req.params.url;
        var reURL = /^https?:\/\/www.[a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/g;
        var docNum = 0;
        
        if(reURL.test(url)) {
            
            urls.findOne({}, urlProjection, function(err, result) {
                if(err) {
                    throw err;
                }
                
                if(result) {
                    urls.aggregate([sum]).toArray( function(err, result) {
                        if (err) throw err;
                        docNum = result[0].count;
                    });
                    
                    urls.findOne({"original_url": url}, urlProjection, function(err, doc) {
                        if(err) {
                            throw err;
                        }
                        
                        if(doc) {
                            res.json(doc);
                        } else {
                            urls.insert({"original_url": url, "short_url": "https://usho-laloptk.c9users.io/" + (docNum + 1)}, function(err) {
                                if(err) {
                                    throw err;
                                }
                                
                                res.json({"original_url": url, "short_url": "https://usho-laloptk.c9users.io/" + (docNum + 1) });
                            });
                        }
                    });
                } else {
                   docNum = 1;
                   urls.insert({"original_url": url, "short_url":  "https://usho-laloptk.c9users.io/" + (docNum + 1) }, function(err) {
                       if(err) {
                            throw err;
                        }
                                
                        res.json({"original_url": url, "short_url":  "https://usho-laloptk.c9users.io/" + (docNum + 1)});
                   });
                }
            });
        } else {
            res.send("You entered an invalid URL");
        }
    };
    
    this.urlRedirect = function(req, res) {
        var id = req.params.id;
        
        urls.findOne({ "short_url": "https://usho-laloptk.c9users.io/" + id }, urlProjection, function(err, doc) {
            if(err) {
                throw err;
            }
            
            if(doc) {
                res.redirect(doc.original_url);
            } else {
                res.send("That short url is not in use yet");
            }
        });
        
    };
}

module.exports = urlProcessing;