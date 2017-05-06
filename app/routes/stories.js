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

exports.getMyStory = (req, res) => {
	currentPage = req.session.activePage = "/myStory";
	if (req.session.bseStatus) {
		panMsg = req.session.bseStatus;
	} else {
		panMsg = "";
	}
	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "yourStoryMobile";
	else
		pageName = "yourStory";
	loginStatus = functions.checkLoginStatus(req);
	if (loginStatus == true) {
		var query = client.query("SELECT goal.name,count(userinvestmentsheader.goalid) FROM userinvestmentsheader INNER JOIN goal ON userinvestmentsheader.goalid = goal.goalid WHERE userinvestmentsheader.userid=$1 and status in ('pending', 'reconciled') GROUP BY  goal.name ", [req.session.user.userid],
		function (err, result) {
			if (err)
				console.log("Cant get assets values");
			//console.log("details header"+result.rows[0]['count']);
			if (result.rows.length > 0) {
				if (result.rows[0]['count'] > 0) {
					investmentData = result.rows;
					console.log(investmentData[0].count);
				}
			} else {
				investmentData = false;
			}
			res.render(pageName, {
				user: req.user,
				invest: investmentData,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path: 'myStoryData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs",
				panMessage: panMsg
			});
		})
	}
	else {
		res.render(pageName, {
			user: req.user,
			invest: "",
			selectorDisplay: "show",
			loggedIn: loginStatus,
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			path: 'myStoryData',
			footerDisplay: "hide",
			footerData1: "Blog",
			footerData2: "FAQs",
			panMessage: panMsg
		});
	}
};

exports.getYourStory = (req, res) => {
		currentPage = req.session.activePage = "/YourStory";

		loginStatus = functions.checkLoginStatus(req);

		mobile = req.useragent["isMobile"];
		if (mobile)
			pageName = "yourStoryMobile";
		else
			pageName = "yourStory";


		res.render(pageName, {

			user: req.user,
			selectorDisplay: "show",
			loggedIn: loginStatus,
			path: 'profileData',
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			footerDisplay: "hide",
			footerData1: "Blog",
			footerData2: "FAQs"
		});
	};

