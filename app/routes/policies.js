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

exports.getPolicies = (req, res) => {
	currentPage = req.session.activePage = "/Policies";
	mobile = req.useragent["isMobile"]
	if (mobile) {
		res.render('policyMobile.ejs', {
			selectorDisplay: "show",
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			loggedIn: loginStatus,
			user: req.user,
			footerDisplay: "show",
			footerData1: "Blog",
			footerData2: "FAQs"

		});
	}
	else {

		res.render('policies.ejs', {
			selectorDisplay: "show",
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			loggedIn: loginStatus,
			user: req.user,
			footerDisplay: "show",
			footerData1: "Blog",
			footerData2: "FAQs"


		});
	}

};

exports.getPrivacy = (req, res) => {
	currentPage = req.session.activePage = "/Privacy";

	mobile = req.useragent["isMobile"]
	if (mobile) {
		res.render('privacyMobile.ejs', {
			selectorDisplay: "show",
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			loggedIn: loginStatus,
			user: req.user,
			footerDisplay: "show",
			footerData1: "Blog",
			footerData2: "FAQs"

		});
	}
	else {
		res.render('privacy.ejs', {
			selectorDisplay: "show",
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			loggedIn: loginStatus,
			user: req.user,
			footerDisplay: "show",
			footerData1: "Blog",
			footerData2: "FAQs"


		});
	}


};

