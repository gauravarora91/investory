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

exports.getSaveAsset = (req, res) => {

	console.log("offline save = " + req.session.offlinegoalName);

	if (req.session.offlinegoalName) {
		//store data



		if (!loginStatus) {

			var creation_date = new Date();
			var modified_date = new Date();
			var status = 'active';
			console.log('body:ofline ' + req.session.offlinegoalName);


			async.waterfall([
				function (callback) {

					var query = client.query("select goalid from goal where goal.name=$1", [req.session.offlinegoalName], function (err, result) {
						if (err) {
							console.log("cant insert assets header allocation data", err);
							res.send("false");
						} else {
							//res.send(1);
							console.log("goalid" + result.rows[0]['goalid']);

							callback(null, result.rows[0]['goalid'])
						}


					});

				},


				function (goalid, callback) {

					//insert to the saved plans header

					console.log("mA0" + req.session.offlinemasterAmount);
					var query = client.query("INSERT INTO savedplansheader(userid,goalid,riskprofile, masteramount, totalyears, sip,status,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING savedplanid", [req.session.user.userid, goalid, req.session.offlineriskProfile, req.session.offlinemasterAmount, req.session.offlinetotalYears, req.session.offlinesip, status,
						creation_date, modified_date, req.session.user.name], function (err, result) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								console.log("savedplanid" + result.rows[0]['savedplanid']);

								callback(null, result.rows[0]['savedplanid'])
							}
						});
				},
				function (savedPlanId, callback) {

					//insert to the saved plans details
					var percentage = [req.session.offlineequityPercentage, req.session.offlinehybridPercentage, req.session.offlinedebtPercentage];
					var amount = [req.session.offlineequityAmount, req.session.offlinehybridAmount, req.session.offlinedebtAmount];
					var type = 'allocation';
					var category = ['Equity', 'Hybrid', 'Debt'];

					console.log("id=" + savedPlanId);

					/*,(savedPlanId,type,category[1],category[1],percentage[1],amount[1],creation_date,modified_date,req.session.user.name),(savedPlanId,type,category[2],category[2],percentage[2],amount[2],creation_date,modified_date,req.session.user.name)*/

					var query = client.query("INSERT INTO savedplansdetail(savedplanid,allocationtype,allocationcategory, allocationdescription, allocationpercentage, allocationamount,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9),($10,$11,$12,$13,$14,$15,$16,$17,$18),($19,$20,$21,$22,$23,$24,$25,$26,$27)", [savedPlanId, type, category[0], category[0], percentage[0], amount[0], creation_date, modified_date, req.session.user.name, savedPlanId, type, category[1], category[1], percentage[1], amount[1], creation_date, modified_date, req.session.user.name, savedPlanId, type, category[2], category[2], percentage[2], amount[2], creation_date, modified_date, req.session.user.name]
						, function (err, result) {
							if (err) {
								console.log("cant insert assets detail allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								// console.log(result.rows[0]);
								callback(null)
							}
						});
				}],
				function (err, result) {

					if (err)
						throw err;

					async.waterfall([function (callback) {

						//Fetch Header 
						//store the data in a json
						var query = client.query("SELECT * FROM savedplansheader where userid=$1 ORDER BY created DESC LIMIT 1 ", [req.session.user.userid],
							function (err, result) {
								if (err)
									console.log("Cant get assets values");



								asetData = result.rows[0];
								callback(null, asetData)
							})


					},
					function (headerData, callback) {
						console.log(headerData)



						var query = client.query("SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2 ORDER BY created DESC LIMIT 3 ", [headerData.savedplanid, 'allocation'],
							function (err, result) {
								if (err)
									console.log("Cant get assets values");



								asetDataDetail = result.rows;
								console.log(asetDataDetail[1]);


								callback(null, headerData, asetDataDetail)
							})


						//fetch Detail
						//using header id
						//store the data in a json

					}, function (headerData, detailData, callback) {

						console.log("data", headerData.riskprofile);
						//initialize query
						//using the json data
						//pass the query

						var amount = {

							amount1: detailData[0].allocationamount,
							amount2: detailData[1].allocationamount,
							amount3: detailData[2].allocationamount

						}
						//console.log(amount);

						var time = headerData.totalyears;
						var sip = headerData.sip;
						var riskProfile = headerData.riskprofile;
						// callback(null,query);


						var schemecamntde = 0, schemecamnteq = 0, schemecamnthy = 0;
						var schememamntde = 0, schememamnteq = 0, schememamnthy = 0;
						var schemeagamnthy = 0, schemeagamnteq = 0, schemeagamnteq = 0;
						//select * from schemesmaster where $1 between sipfrom and sipto and $2 between yearfrom and yearto and riskprofile = $3
						var j = 0, k = 0, l = 0;
						var query = client.query("select * from schemesmaster where $1 between sipfrom and sipto and $2 between yearfrom and yearto and riskprofile = $3", [sip, time, riskProfile],
							function (err, result) {
								if (err)
									console.log("Cant get assets values");

								scheme = result.rows;
								//console.log(scheme.length+"scheme"+scheme[1].name+scheme[1].category+"schemecode"+scheme[1].code);


								for (i = 0; i < scheme.length; i++) {


									if ((scheme[i].category) == "Equity") {
										j = j + 1;
									}

									if ((scheme[i].category) == "Hybrid") {
										k = k + 1;
									}

									if ((scheme[i].category) == "Debt") {
										l = l + 1;
									}



								}
								console.log("j" + j + "k" + k + "l" + l);


								for (i = 0; i < scheme.length; i++) {

									if (j == 0 || j == 1) {
										schemecamnteq = amount.amount1;
									}
									else {
										schemecamnteq = amount.amount1 / j;
									}
									if (k == 0 || k == 1) {
										schemecamnthy = amount.amount2;
									}
									else {
										schemecamnthy = amount.amount2 / k;
									}
									if (l == 0 || l == 1) {
										schemecamntde = amount.amount3;
									} else {
										schemecamntde = amount.amount3 / l;
									}
								}

								console.log("Equity" + schemecamnteq + "Hybrid" + schemecamnthy + "Debt" + schemecamntde);

								var schemeAmount = {

									equityAmt: schemecamnteq,
									hybridAmt: schemecamnthy,
									debtAmt: schemecamntde

								}

								var amt = [];

								for (i = 0; i < scheme.length; i++) {



									if (scheme[i].riskprofile == "Aggressive") {

										var amtamount1 = 0, amtmd4 = 0;




										if ((scheme[i].category) == "Equity") {
											var amtamount2 = 0, remainamt = 0, amtremainadded = 0, amtagg = 0;

											var amtrounded1 = 0, amtrounded2 = 0, amtrounded5 = 0;



											//remainamt=amount.amount1-totalrounded;


											console.log("Equity j value", j);

											for (var n = 0; n < j; n++) {
												amtrounded5 = Math.floor((schemecamnteq) / 1000) * 1000;
												amtamount1 = schemecamnteq - amtrounded5;
												amtagg += amtamount1;
												console.log("Equity rating 1", amtagg, amtrounded5);

											}


											if ((scheme[i].rating) >= 2) {

												console.log("Equity in schemes", amtrounded5);
												amt[i] = amtrounded5;
											}
											if ((scheme[i].rating) == 1) {
												console.log("Equity in schemes" + amtrounded5);
												var amountagg = amtrounded5 + amtagg;
												amountagg = Math.round((amountagg) / 1000) * 1000;
												amt[i] = amountagg;
											}

											if ((scheme[i].rating) == 0) {
												console.log("Equity" + schemecamnteq);
												amt[i] = schemecamnteq;
											}



										}

										var amtamount1 = 0, amtmd4 = 0, amtrounded1 = 0;
										if ((scheme[i].category) == "Hybrid") {
											var amtamount2 = 0;
											amtrounded1 = Math.floor((schemecamnthy) / 1000) * 1000;
											amtamount1 = schemecamnthy - amtrounded1;
											amtamount1 += amtamount1;

											amtmd4 = schemecamnthy + amtamount1;
											amt7 = Math.round(amtmd4 / 1000) * 1000;
											if ((scheme[i].rating) >= 1) {
												if ((scheme[i].rating) > 1) {

													console.log("Hybrid" + amtrounded1);
													amt[i] = amtrounded1;
												}

												if ((scheme[i].rating) == 1) {

													console.log("Hybrid" + amt7);
													amt[i] = amt7;
												}
											}
											if ((scheme[i].rating) == 0) {
												console.log("Hybrid" + schemecamnthy);
												amt[i] = schemecamnthy;
											}



										}


										var amtamount1 = 0, amtmd4 = 0, amtrounded1 = 0;
										if ((scheme[i].category) == "Debt") {
											var amtamount2 = 0;
											amtrounded1 = Math.floor((schemecamntde) / 1000) * 1000;
											amtamount1 = schemecamntde - amtrounded1;
											amtamount1 += amtamount1;
											amtmd4 = schemecamntde + amtamount1;
											amt8 = Math.round(amtmd4 / 1000) * 1000;
											if ((scheme[i].rating) >= 1) {
												if ((scheme[i].rating) > 1) {

													console.log("Debt" + amtrounded1);
													amt[i] = amtrounded1;
												}
												if ((scheme[i].rating) == 1) {

													console.log("Debt" + amt8);
													amt[i] = amt8;
												}
											}
											if ((scheme[i].rating) == 0) {

												console.log("Debt" + schemecamntde);
												amt[i] = schemecamntde;
											}

										}





									} else {

										var amtrounded1 = 0;
										if ((scheme[i].category) == "Equity") {



											if ((scheme[i].rating) > 1) {
												amtrounded1 = Math.floor((schemecamnteq) / 1000) * 1000;
												console.log("Equity" + amtrounded1);
												amt[i] = amtrounded1;

											}
											if ((scheme[i].rating) == 1) {
												amtme1 = Math.round(schemecamnteq / 1000) * 1000;
												console.log("Equity" + amtme1);
												amt[i] = amtme1;
											}
											if ((scheme[i].rating) == 0) {
												console.log("Equity" + schemecamnteq);
												amt[i] = schemecamnteq;
											}


										}
										var amtamount1 = 0, amtmd4 = 0, amtrounded1 = 0;
										if ((scheme[i].category) == "Hybrid") {

											if ((scheme[i].rating) > 1) {
												amtrounded1 = Math.floor((schemecamnthy) / 1000) * 1000;
												console.log("Hybrid" + amtrounded1);
												amt[i] = amtrounded1;
											}
											if ((scheme[i].rating) == 1) {

												amtme1 = Math.round(schemecamnthy / 1000) * 1000;
												console.log("Hybrid" + amtme1);
												amt[i] = amtme1;
											}
											if ((scheme[i].rating) == 0) {
												console.log("Hybrid" + schemecamnthy);
												amt[i] = schemecamnthy;
											}


										}
										var amtamount1 = 0, amtmd4 = 0, amtrounded1 = 0;
										if ((scheme[i].category) == "Debt") {

											if ((scheme[i].rating) > 1) {
												amtrounded1 = Math.floor((schemecamntde) / 1000) * 1000;

												console.log("Debt" + amtrounded1);
												amt[i] = amtrounded1;

											}
											if ((scheme[i].rating) == 1) {
												amtme4 = Math.round(schemecamntde / 1000) * 1000;
												console.log("Debt" + amtme4);
												amt[i] = amtme4;
											}
											if ((scheme[i].rating) == 0) {
												console.log("Debt" + schemecamntde);
												amt[i] = schemecamntde;
											}





										}
									}
								}

								//insert into the details

								for (i = 0; i < scheme.length; i++) {

									var percentage = 0;

									var type = 'scheme';
									var category = scheme[i].category;
									var schemeDescription = scheme[i].name;
									var schemeCode = scheme[i].code;
									var schemeId = scheme[i].schemeid;
									console.log(scheme[i].code);
									// var schemeCode = scheme[i].code;
									creation_date = new Date();
									modified_date = new Date();
									console.log("amt=" + amt[i]);

									/*,(savedPlanId,type,category[1],category[1],percentage[1],amount[1],creation_date,modified_date,req.session.user.name),(savedPlanId,type,category[2],category[2],percentage[2],amount[2],creation_date,modified_date,req.session.user.name)*/

									var query = client.query("INSERT INTO savedplansdetail(savedplanid,allocationtype,allocationcategory, allocationdescription, allocationpercentage, allocationamount,created,modified,createdby,schemecode,schemeid) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [headerData.savedplanid, type, category, schemeDescription, percentage, amt[i], creation_date, modified_date, req.session.user.name, schemeCode, schemeId]
										, function (err, result) {
											if (err) {
												console.log("cant insert assets detail allocation data", err);
												//res.send("false");
											} else {
												//res.send(1);
												console.log("result" + result.rows);

												//callback(null)

											}


										});
								}



								//calculateScheme();
								//res.redirect("/Pricing");
								callback(null);
							})
						//fetch the scheme info

					}], function (err, result) {


						req.session.showAssetAfterLogin = true;

						req.session.offlinegoalName = null;
						req.session.offlineriskProfile = null;
						req.session.offlinemasterAmount = null;
						req.session.offlinetotalYears = null;
						req.session.offlinesip = null;
						req.session.offlineequityAmount = null;
						req.session.offlinehybridAmount = null;
						req.session.offlinedebtAmount = null;
						req.session.offlineequityPercentage = null;
						req.session.offlinehybridPercentage = null;
						req.session.offlinedebtPercentage = null;
						console.log("save offline")
						console.log("offline unset save = " + req.session.showAssetAfterLogin);
						res.redirect('/tocurrent');
						//dislay the scheme information
					})




				}

			)

		}
		else {

			//	console.log('body: you are not loggedIn' );
			res.redirect('/tocurrent');

		}


	} else {

		console.log("dont save")
		res.redirect('/tocurrent');
	}


};

