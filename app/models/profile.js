var mongoose = require('mongoose')
var Schema = mongoose.Schema

var profiledataSchema = new Schema({
  name: String,
  mobile: Number,
  email: String,
  dob: Date,
  age: String,
  gender: String,
  marital_status: String,
  address: String,
  pincode: Number,
  city: String,
  pan: String,
  bank_details: String,
  creation_date: Date,
  modified_date: Date
}, {collection: 'profile'})

module.exports = mongoose.model('profile', profiledataSchema)

var Profile = mongoose.model('profile', profiledataSchema)
