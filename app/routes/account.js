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

exports.getAccount = (req, res) => {
	currentPage = req.session.activePage = "/Accounts";

	loginStatus = functions.checkLoginStatus(req);


	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "accountsMobile";
	else
		pageName = "yourStory";

	console.log("invoices", req.session.user.userid);
	var query = client.query("select to_char(a.userinvestmentorderdate,'dd-Mon-yyyy') as investdate, b.name, a.amount,NULLIF(a.units,0) as units from userinvestmentorders a, schemesmaster b where a.schemeid = b.schemeid and a.userid=$1", [req.session.user.userid], function (err, result) {
		if (err)
			console.log("Cant get portfolio details in goal selection" + err);
		console.log("ja be loude" + result.rows.length)

		if (result.rows.length > 0) {
			console.log("statements");


			var len = result.rows.length;


			res.render(pageName, {

				user: req.user,
				stmt: result.rows,
				length: len,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountInvoicesData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs"
			});
		} else {

			res.render(pageName, {

				user: req.user,
				stmt: false,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountInvoicesData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs"
			});


		}
	});
};

exports.getInvoice = (req, res) => {
	currentPage = req.session.activePage = "/Invoices";
	loginStatus = functions.checkLoginStatus(req);
	var today = new Date();
	var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "myInvoicesMobile";
	else
		pageName = "yourStory";
	console.log("invoices", req.session.user.userid);
	var query = client.query("select to_char(a.userinvestmentorderdate,'dd-Mon-yyyy') as investdate, b.name, a.amount,NULLIF(a.units,0) as units from userinvestmentorders a, schemesmaster b where a.schemeid = b.schemeid and a.amount > 0 and a.userid=$1 order by 1 desc", [req.session.user.userid], function (err, result) {
		if (err)
			console.log("Cant get portfolio details in goal selection");
		if (result.rows.length > 0) {
			console.log("statements");
			var len = result.rows.length;
			res.render(pageName, {
				user: req.user,
				stmt: result.rows,
				length: len,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountInvoicesData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs",
				date: date,
				currentPage: currentPage
			});
		}
	});
};

exports.getTransaction = (req, res) => {

	currentPage = req.session.activePage = "/transaction";

	loginStatus = functions.checkLoginStatus(req);
	mobile = req.useragent["isMobile"]
	if (mobile) {
		res.render('transactionMobile.ejs', {

		});
	} else {
		res.render('yourStory.ejs', {

			user: req.user,
			selectorDisplay: "show",
			loggedIn: loginStatus,
			path: 'accountData',
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			path1: 'accountTransactionData',
			footerDisplay: "hide",
			footerData1: "Blog",
			footerData2: "FAQs",
			currentPage: currentPage
		});
	}
};

exports.getSetting = (req, res) => {

	currentPage = req.session.activePage = "/Settings";

	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "settingsMobile";
	else
		pageName = "yourStory";


	loginStatus = functions.checkLoginStatus(req);
	res.render(pageName, {

		user: req.user,
		selectorDisplay: "show",
		loggedIn: loginStatus,
		path: 'accountData',
		smessage: req.flash('signupMessage'),
		lmessage: req.flash('loginMessage'),
		path1: 'accountSettingsData',
		footerDisplay: "hide",
		footerData1: "Blog",
		footerData2: "FAQs",
		currentPage: currentPage
	});
};

exports.getReports = (req, res) => {
	currentPage = req.session.activePage = "/reports";

	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "reportsMobile";
	else
		pageName = "yourStory";


	loginStatus = functions.checkLoginStatus(req);
	res.render(pageName, {

		user: req.user,
		selectorDisplay: "show",
		loggedIn: loginStatus,
		path: 'reportsData',
		smessage: req.flash('signupMessage'),
		lmessage: req.flash('loginMessage'),
		footerDisplay: "hide",
		footerData1: "Blog",
		footerData2: "FAQs"
	});
};

