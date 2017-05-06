var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var paymentschema = new Schema({
		email:String,
		plan:String,
		plan_price:Number,
		paid:String,
		creation_date: Date,
		modified_date: Date
		
},{collection:'schemepayment'});


module.exports = mongoose.model('schemepayment', paymentschema);
var Payment = mongoose.model('schemepayment', paymentschema);