// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        name         : String,
        mobile       : Number,
        email        : String,
        password     : String,
		creation_date: Date,
		modified_date: Date
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
		creation_date: Date,
		modified_date: Date
        
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String,
		creation_date: Date,
		modified_date: Date
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
		creation_date: Date,
		modified_date: Date
    }

});




// methods ======================
// generating a hash
/*
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
*/

// checking if password is valid
/*
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
*/
function generateHash(password) {

 return bcrypt.compareSync(password, this.user.password);	
	
	
	}




// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
