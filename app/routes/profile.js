/* 
* Modules *
*/
const express = require('express');
const router = express.Router();
const async = require('async');
const pg = require('pg');
const crypto = require('crypto');
/* common functions */
const functions = require('./functions');
const conString = "postgres://postgres:postgres@localhost:5432/investory";

var client = new pg.Client(conString);
client.connect();


var currentPage;

exports.getProfile = (req, res) => {
	currentPage = req.session.activePage = "/profile";
	
	  mobile = req.useragent["isMobile"];
    if(mobile)
   		pageName = "profileMobile";
	else
		pageName = "yourStory";
		 
	
	loginStatus = functions.checkLoginStatus(req);
	
    //profile
     
   var query=client.query("select * from users inner join profile on users.userid = profile.userid where users.userid=$1",[req.session.user.userid],function(err,result){
            if(err)
                console.log("Cant get profile details from users table");
            if(result.rows.length>0)
                {
                    
                    var len=result.rows.length;
    
                    console.log("Profile",result.rows[0]);
	               res.render(pageName,{
	  
	  	           user : req.user ,
				   profile: result.rows[0],
                   message: 'updated',
	  	           selectorDisplay: "show",
	  		       loggedIn: loginStatus,
	               smessage: req.flash('signupMessage'),
		           lmessage: req.flash('loginMessage'),
	  	            path:'profileData',
	 
	  	            footerDisplay: "hide",
	                footerData1: "Blog",
	               footerData2: "FAQs"
  });
			
		}
		
	});
  
};

exports.postProfile = (req, res) => {
	   currentPage = req.session.activePage = "/profile";

loginStatus = functions.checkLoginStatus(req);

                var dob=req.body.calendar;
                var age=req.body.age;
                var gender=req.body.gender;
                var maritalstatus=req.body.maritalstatus;
                var address=req.body.address;
                var pincode=req.body.pincode;
                var city=req.body.city;
                var pan=req.body.pan;
     // console.log("dob",dob);
                 // name:req.body.username,
                //email:req.body.email,
                //mobile:req.body.mnumber,
                // bank_details:req.body.bankdetails     
			   //email:req.session.userEmail
                //var created//new date();
                //var modified=//new date();    ,$10,$11 ,created,modified
       
      // console.log(dob,age,gender,maritalstatus,address,pincode,city,pan);
        console.log("profile Post",req.user.userid);
	var query=client.query("update profile set userid=$1,age=$2,gender=$3,maritalstatus=$4,address=$5,pincode=$6,city=$7,pan=$8,createdby=$9,dob=to_date($10, 'DD-MM-YYYY') where userid=$1", [req.session.user.userid, age, gender, maritalstatus, address, pincode, city, pan, req.session.user.name,dob
	],function(err,result){
	        if(err)
	            console.log("Cant get update profile details from users table",err);
	        if(result.rows.length>0)
	            {
	        		 console.log("Insert to profile details Success..!");
			  }

	    res.redirect("/profile");
	});
};

