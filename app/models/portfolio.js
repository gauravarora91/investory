var mongoose = require('mongoose')
var Schema = mongoose.Schema

var portfolioschema = new Schema({
  email: String,
  mood: String,
  goal: String,
  risk_profile: String,
  years: Number,
  master_amount: Number,
  sip: Number,
  amt1: Number,
  amt2: Number,
  amt3: Number,
  creation_date: Date,
  modified_date: Date

}, {collection: 'portfolio'})

module.exports = mongoose.model('Portfolio', portfolioschema)
var Portfolio = mongoose.model('Portfolio', portfolioschema)
