var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var assetSchema = new Schema({
    from: Number,
    to: Number,
    risk_profile:String,
    allocation:String,
    asset_value:String
       
});

// the schema is useless so far
// we need to create a model using it
var Asset = mongoose.model('Asset', assetSchema);

// make this available to our users in our Node applications
module.exports = Asset;
  
// create a new user called chris



/*

router.get("/GoalSelection", function(req, res){
  Asset.find({}, function(err, Assetlist){
    if(err) throw err;
    if(Assetlist.length > 1){
      res.render("mood", {data: Assetlist})
    } else{
      res.render("mood", {data: "No assets added yet!"})
    }
  });
});

*/




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Investory' });
});


module.exports = router;


