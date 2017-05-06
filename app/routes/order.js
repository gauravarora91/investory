/* 
* Modules *
*/
const express = require('express');
// const router = express.Router();
const async = require('async');
const pg = require('pg');
const crypto = require('crypto');
/* common functions */
const functions = require('./functions');
const conString = "postgres://postgres:postgres@localhost:5432/investory";

var client = new pg.Client(conString);
client.connect();


var currentPage;

exports.postInsertOrder = (req, res) => {

	var userID = "109401";
	var memberID = "10940";
	var password = "123456";
	var passKey = "test";

	async.waterfall([
		function (callback) {

			//user investments header
			var userId = req.session.savedplanheader.userid;
			var goalId = req.session.savedplanheader.goalid;
			var riskProfile = req.session.savedplanheader.riskprofile;
			var masterAmount = req.session.savedplanheader.masteramount;
			var totalYears = req.session.savedplanheader.totalyears;
			var sip = req.session.savedplanheader.sip;
			var status = "pending";


			creation_date = new Date();
			modified_date = new Date();

			//Header table insert
			var query = client.query("INSERT INTO userinvestmentsheader(userid,goalid,riskprofile, masteramount, totalyears, sip,status,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING userinvestmentheaderid", [userId, goalId, riskProfile, masterAmount, totalYears, sip, status,
				creation_date, modified_date, req.session.user.name], function (err, result) {
					if (err) {
						console.log("cant insert assets header allocation data", err);
						res.send("false");
					} else {
						//res.send(1);
						console.log("savedplanid" + result.rows[0]['userinvestmentheaderid']);

						req.session.userinvestmentheaderid = result.rows[0]['userinvestmentheaderid'];
						callback(null, req.session.userinvestmentheaderid)
					}
				});
		}, function (userid, callback) {

			var len = req.session.savedplandetail.length;
			//user investment orders
			var userId = req.session.savedplanheader.userid;
			var goalId = req.session.savedplanheader.goalid;
			var riskProfile = req.session.savedplanheader.riskprofile;

			var userinvestmentheaderid = req.session.userinvestmentheaderid;

			var orderDate = new Date();
			var userPan = "AKBPB7607H";
			var orderType = "invest";


			var bsetxn = [];
			var userinvestmentorderid = [];
			//user investments detail


			var x = 1;
			var y = len;

			for (i = 0; i < len; i++) {
				var transNo = getTransactionID(req.session.user.userid) + i;
				console.log("out loop" + req.session.savedplandetail[i].allocationdescription);
				var amount = req.session.savedplandetail[i].allocationamount;
				var schemeCode = req.session.savedplandetail[i].schemecode;
				var schemeDesc = req.session.savedplandetail[i].allocationdescription;
				var schemeCategory = req.session.savedplandetail[i].allocationcategory;
				var allocationPercentage = req.session.savedplandetail[i].allocationpercentage;

				var schemeId = req.session.savedplandetail[i].schemeid;


				if (x <= y) {
					bsetxn[i] = transNo;
					console.log("SchemeDesc" + schemeDesc + "id" + schemeId + "amount" + amount + "txn" + bsetxn[i]);
					var query = client.query("INSERT INTO userinvestmentorders(userinvestmentorderdate,userid,userpan,ordertype,goalid,riskprofile,schemeid,amount,bsetxnreference,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING userinvestmentorderid", [orderDate, userId, userPan, orderType, goalId, riskProfile, schemeId, amount, transNo,
						creation_date, modified_date, req.session.user.name], function (err, result1) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								console.log("userinvestmentorderid" + result1.rows[0]['userinvestmentorderid']);

								var dummy = result1.rows[0]['userinvestmentorderid'];
								userinvestmentorderid.push(dummy);
								console.log("dummy" + userinvestmentorderid + "i" + i);

								//userinvestmentorderid[i] =dummy;


								if (x >= y) {
									console.log("inside callback" + i)
									//							console.log("inside callback x"+x)
									//							console.log("inside callback y"+y)
									console.log("send" + userinvestmentorderid + "transaction" + bsetxn)
									req.session.bsetxn = bsetxn;
									callback(null, userinvestmentorderid)
								}
								x++;

								console.log("inside loop x" + x)
								console.log("inside loop y" + y)

							}


						});


				}


			}

		}, function (id, callback) {

			var len = req.session.savedplandetail.length;
			//user investment orders
			var userId = req.session.savedplanheader.userid;
			var goalId = req.session.savedplanheader.goalid;
			var riskProfile = req.session.savedplanheader.riskprofile;

			var userinvestmentheaderid = req.session.userinvestmentheaderid;


			var orderDate = new Date();
			var userPan = "AKBPB7607H";
			var orderType = "invest";



			//user investments detail


			var x = 1;
			var y = len;

			for (i = 0; i < len; i++) {
				var userinvestmentorderid = id[i];
				var transNo = getTransactionID(req.session.user.userid) + i;
				console.log("out loop" + req.session.savedplandetail[i].allocationdescription);
				var amount = req.session.savedplandetail[i].allocationamount;
				var schemeCode = req.session.savedplandetail[i].schemecode;
				var schemeDesc = req.session.savedplandetail[i].allocationdescription;
				var schemeCategory = req.session.savedplandetail[i].allocationcategory;
				var allocationPercentage = req.session.savedplandetail[i].allocationpercentage;

				var schemeId = req.session.savedplandetail[i].schemeid;
				console.log("orderid" + userinvestmentorderid);

				if (x <= y) {
					var query = client.query("INSERT INTO userinvestmentdetail(userinvestmentheaderid,schemeid,schemedescription,schemecategory,allocationpercentage,allocationamount,created,modified,createdby,orderid,schemecode) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [userinvestmentheaderid, schemeId, schemeDesc, schemeCategory, allocationPercentage, amount, creation_date, modified_date, req.session.user.name, userinvestmentorderid, schemeCode],
						function (err, result2) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								console.log("User investment details" + result2.rows);


								if (x >= y) {
									//							console.log("inside callback"+i)
									//							console.log("inside callback x"+x)
									//							console.log("inside callback y"+y)
									callback(null, x)
								}
								x++;

								console.log("inside loop x" + x)
								console.log("inside loop y" + y)





							}


						});


				}


			}
		},
		function (x, callback) {


			//get the password for the order creation 

			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmf.in/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmf.in/MFOrderEntry/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmf.in/MFOrderEntry/getPassword">\n         <ns:UserId>109401</ns:UserId>\n          <ns:Password>123456</ns:Password>\n         <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
					var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					orderBsePassArray = password.toString().split("|");
					console.log("Order ENtry Service Password " + orderBsePassArray[1]);
					callback(null, orderBsePassArray[1])

				})

			});





		},
		function (pass, callback) {

			var len = req.session.savedplandetail.length;

			x = 1; y = len;

			//order entry
			for (i = 0; i < len; i++) {


				console.log("init x" + x);
				console.log("init" + y);


				var amount = req.session.savedplandetail[i].allocationamount;

				console.log("bse" + i);
				var transCode = "NEW";
				var transNo = req.session.bsetxn[i];
				var orderId = "";
				var clientCode = "SOHANDEMO2";
				var schemeCode = req.session.savedplandetail[i].schemecode;
				var buySell = "P";
				var buySellType = "FRESH";
				var DPTxn = "P";
				var orderValue = amount;
				var quantity = "";
				var allRedeem = "N";
				var folioNo = "";
				var remarks = "";
				var KYCStatus = "Y";
				var refNo = "";
				var subBrCode = "";
				var EUIN = "E123456";
				var EUINVal = "Y";
				var minRedeem = "N";
				var DPC = "N";
				var IPAdd = "";

				console.log("transactionNo" + transNo[i]);
				var orderBody = '<ns:TransCode>' + transCode + '</ns:TransCode><ns:TransNo>' + transNo + '</ns:TransNo><ns:OrderId>' + orderId + '</ns:OrderId><ns:UserID>' + userID + '</ns:UserID><ns:MemberId>' + memberID + '</ns:MemberId><ns:ClientCode>' + clientCode + '</ns:ClientCode><ns:SchemeCd>' + schemeCode + '</ns:SchemeCd><ns:BuySell>' + buySell + '</ns:BuySell><ns:BuySellType>' + buySellType + '</ns:BuySellType><ns:DPTxn>' + DPTxn + '</ns:DPTxn><ns:OrderVal>' + orderValue + '</ns:OrderVal><ns:Qty>' + quantity + '</ns:Qty><ns:AllRedeem>' + allRedeem + '</ns:AllRedeem><ns:FolioNo>' + folioNo + '</ns:FolioNo><ns:Remarks>' + remarks + '</ns:Remarks><ns:KYCStatus>' + KYCStatus + '</ns:KYCStatus><ns:RefNo>' + refNo + '</ns:RefNo><ns:SubBrCode>' + subBrCode + '</ns:SubBrCode><ns:EUIN>' + EUIN + '</ns:EUIN><ns:EUINVal>' + EUINVal + '</ns:EUINVal><ns:MinRedeem>' + minRedeem + '</ns:MinRedeem><ns:DPC>' + DPC + '</ns:DPC><ns:IPAdd>' + IPAdd + '</ns:IPAdd><ns:Password>' +
					pass + '</ns:Password><ns:PassKey>' + passKey + '</ns:PassKey><ns:Parma1></ns:Parma1><ns:Param2></ns:Param2><ns:Param3></ns:Param3>';

				var options = {
					method: 'POST',
					url: 'http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc',
					headers: {
						'cache-control': 'no-cache',
						'content-type': 'application/soap+xml; charset=utf-8'
					},
					body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmf.in/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmf.in/MFOrderEntry/orderEntryParam</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:orderEntryParam  xmlns="http://bsestarmf.in/MFOrderEntry/orderEntryParam">\n         ' + orderBody + '  </ns:orderEntryParam>\n   </soap:Body>\n</soap:Envelope>'
				};

				console.log("in loop" + req.session.savedplandetail[i].allocationdescription);

				request(options, function (error, response, body) {
					if (error) throw new Error(error);


					parseString(body, function (err, results) {
						// Get The Result From The Soap API and Parse it to JSON

						//	console.log(buffer);
						//
						var orderResponse = results["s:Envelope"]["s:Body"][0]["orderEntryParamResponse"][0]["orderEntryParamResult"];
						bseOrderArray = orderResponse.toString().split("|");
						console.log("Transaction code - " + bseOrderArray[0]);
						console.log("Unique Reference Number - " + bseOrderArray[1]);
						console.log("Order Number - " + bseOrderArray[2]);
						console.log("UserId - " + bseOrderArray[3]);
						console.log("MemberId - " + bseOrderArray[4]);
						console.log("Client Code - " + bseOrderArray[5]);
						console.log("BSE Remarks - " + bseOrderArray[6]);
						console.log("Flag - " + bseOrderArray[7]);
						var bseStatus;
						if (bseOrderArray[7] == 1)
							bseStatus = "failure";
						else
							bseStatus = "success";

						var bseTransactionReference = bseOrderArray[1];
						var bseOrderReference = bseOrderArray[2];


						if (x <= y) {

							var query = client.query("UPDATE userinvestmentorders SET bseorderreference = $1, bsestatus = $2 WHERE bsetxnreference =$3 ", [bseOrderReference, bseStatus, bseTransactionReference], function (err, result1) {
								if (err) {
									console.log("cant insert assets header allocation data", err);
									res.send("false");
								} else {
									//res.send(1);
									// console.log("userinvestmentorderid"+result1.rows[0]['userinvestmentorderid']);


									//userinvestmentorderid = result1.rows[0]['userinvestmentheaderid'];



									if (x >= y) {
										//							console.log("inside callback"+i)
										//							console.log("inside callback x"+x)
										//							console.log("inside callback y"+y)
										callback(null)
									}
									x++;

									console.log("inside loop x" + x)
									console.log("inside loop y" + y)

								}


							});



						} else {

							console.log("count is more than the expected value" + x + "length" + y);
						}





					})

				});


			}

		},
		function (callback) {

			console.log("I am the payment ");
			//get Password for Payment Link
			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword">\n         <ns:UserId>109401</ns:UserId>\n         <ns:MemberId>10940</ns:MemberId>\n         <ns:Password>123456</ns:Password>\n         <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
					var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					bsePassArray = password.toString().split("|");
					console.log("MFUPload Service Password " + bsePassArray[1]);
					callback(null, bsePassArray[1])

				})

			});


		},
		function (uploadPass, callback) {



			//make the payment 


			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:MFAPI  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI">\n         <ns:Flag>03</ns:Flag>\n		 <ns:UserId>109401</ns:UserId>\n         <ns:EncryptedPassword>' + uploadPass + '</ns:EncryptedPassword>\n         <ns:param>10940|SOHANDEMO2|http://localhost:3000/BsePaymentStatus</ns:param>\n            </ns:MFAPI>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//console.log(results);
					//
					var link = results["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					bseLinkArray = link.toString().split("|");
					console.log("Payment link " + bseLinkArray[1]);
					// callback(null,bseLinkArray[1])
					res.render('bseRedirect', { data: bseLinkArray[1] });

				})

			});

			//Check the Payment Status
			/*		 	 var options = {
								method: 'POST',
								url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
								'cache-control': 'no-cache',
								'content-type': 'application/soap+xml; charset=utf-8'
					},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:MFAPI  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI">\n         <ns:Flag>11</ns:Flag>\n		 <ns:UserId>109401</ns:UserId>\n         <ns:EncryptedPassword>'+uploadPass+'</ns:EncryptedPassword>\n         <ns:param>SOHANTEST1|720191|BSEMF</ns:param>\n            </ns:MFAPI>\n   </soap:Body>\n</soap:Envelope>' };
			
			  request(options, function (error, response, body) {
				if (error) throw new Error(error);
			
					parseString(body, function(err, results){
				// Get The Result From The Soap API and Parse it to JSON
						
						  //console.log(results);
						//
					   var link = results["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];
					   //console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
						bsePaymentStatus = link.toString().split("|");
					   console.log("Payment Status "+bsePaymentStatus[1]);
						//return bsePaymentStatus[1];
					 // callback(null,bseLinkArray[1])
					   
			   })
				  
			  });	
					 */
		}],
		function (err, result) {

			if (err)
				throw err;




		})



};

exports.postProceedOrder = (req, res) => {

	//bse credentials	
	var userID = "109401";
	var memberID = "10940";
	var password = "123456";
	var passKey = "test";


	async.waterfall([
		function (callback) {
			console.log(req.body.savedplanid);
			var query = client.query("SELECT * FROM savedplansheader  where savedplansheader.userid=$1 and savedplansheader.savedplanid = $2 ", [req.session.user.userid, req.body.savedplanid],
				function (err, result) {
					if (err)
						console.log("Cant get assets values" + err);


					console.log("details header" + result.rows.length);
					asetData = result.rows[0];
					console.log(asetData);
					if (result.rows.length > 0) {

						req.session.savedplanheader1 = asetData;
						console.log(req.session.savedplanheader1);
						callback(null, asetData)

					}



				})


		},
		function (asetData, callback) {


			//user investments header
			var userId = req.session.savedplanheader1.userid;
			var goalId = req.session.savedplanheader1.goalid;
			var riskProfile = req.session.savedplanheader1.riskprofile;
			var masterAmount = req.session.savedplanheader1.masteramount;
			var totalYears = req.session.savedplanheader1.totalyears;
			var sip = req.session.savedplanheader1.sip;
			var status = "pending";

			console.log(userId, goalId);

			creation_date = new Date();
			modified_date = new Date();

			//Header table insert
			var query = client.query("INSERT INTO userinvestmentsheader(userid,goalid,riskprofile, masteramount, totalyears, sip,status,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING userinvestmentheaderid", [userId, goalId, riskProfile, masterAmount, totalYears, sip, status,
				creation_date, modified_date, req.session.user.name], function (err, result) {
					if (err) {
						console.log("cant insert assets header allocation data", err);
						res.send("false");
					} else {
						//res.send(1);
						console.log("savedplanid" + result.rows[0]['userinvestmentheaderid']);


						req.session.userinvestmentheaderid1 = result.rows[0]['userinvestmentheaderid'];
						callback(null, req.session.userinvestmentheaderid1)



					}


				});




		}, function (assetData, callback) {

			var query = client.query("SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2", [req.body.savedplanid, 'scheme'],
				function (err, result) {
					if (err)
						console.log("Cant get assets values");



					asetDataAllocationDetail = result.rows;

					console.log(asetDataAllocationDetail);
					req.session.savedplandetail1 = asetDataAllocationDetail;
					callback(null, asetDataAllocationDetail)




				})




		}, function (asetDataAllocationDetail, callback) {

			var len = req.session.savedplandetail1.length;
			//user investment orders
			var userId = req.session.savedplanheader1.userid;
			var goalId = req.session.savedplanheader1.goalid;
			var riskProfile = req.session.savedplanheader1.riskprofile;

			var userinvestmentheaderid = req.session.userinvestmentheaderid1;

			var orderDate = new Date();
			var userPan = "AKBPB7607H";
			var orderType = "invest";


			var bsetxn1 = [];
			var userinvestmentorderid = [];
			//user investments detail


			var x = 1;
			var y = len;

			for (i = 0; i < len; i++) {
				var transNo = getTransactionID(req.session.user.userid) + i;
				console.log("out loop" + req.session.savedplandetail1[i].allocationdescription);
				var amount = req.session.savedplandetail1[i].allocationamount;
				var schemeCode = req.session.savedplandetail1[i].schemecode;
				var schemeDesc = req.session.savedplandetail1[i].allocationdescription;
				var schemeCategory = req.session.savedplandetail1[i].allocationcategory;
				var allocationPercentage = req.session.savedplandetail1[i].allocationpercentage;

				var schemeId = req.session.savedplandetail1[i].schemeid;


				if (x <= y) {
					bsetxn1[i] = transNo;
					console.log("SchemeDesc" + schemeDesc + "id" + schemeId + "amount" + amount + "txn" + bsetxn1[i]);
					var query = client.query("INSERT INTO userinvestmentorders(userinvestmentorderdate,userid,userpan,ordertype,goalid,riskprofile,schemeid,amount,bsetxnreference,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING userinvestmentorderid", [orderDate, userId, userPan, orderType, goalId, riskProfile, schemeId, amount, transNo,
						creation_date, modified_date, req.session.user.name], function (err, result1) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								console.log("userinvestmentorderid" + result1.rows[0]['userinvestmentorderid']);

								var dummy = result1.rows[0]['userinvestmentorderid'];
								userinvestmentorderid.push(dummy);
								console.log("dummy" + userinvestmentorderid + "i" + i);

								//userinvestmentorderid[i] =dummy;


								if (x >= y) {
									console.log("inside callback" + i)
									//							console.log("inside callback x"+x)
									//							console.log("inside callback y"+y)
									console.log("send" + userinvestmentorderid + "transaction" + bsetxn1)
									req.session.bsetxn1 = bsetxn1;
									callback(null, userinvestmentorderid)
								}
								x++;

								console.log("inside loop x" + x)
								console.log("inside loop y" + y)

							}


						});


				}


			}

		}, function (id, callback) {

			var len = req.session.savedplandetail1.length;
			//user investment orders

			var userId = req.session.savedplanheader1.userid;
			var goalId = req.session.savedplanheader1.goalid;
			var riskProfile = req.session.savedplanheader1.riskprofile;

			var userinvestmentheaderid = req.session.userinvestmentheaderid1;


			var orderDate = new Date();
			var userPan = "AKBPB7607H";
			var orderType = "invest";



			//user investments detail


			var x = 1;
			var y = len;

			for (i = 0; i < len; i++) {
				var userinvestmentorderid = id[i];
				var transNo = getTransactionID(req.session.user.userid) + i;
				console.log("out loop" + req.session.savedplandetail1[i].allocationdescription);
				var amount = req.session.savedplandetail1[i].allocationamount;
				var schemeCode = req.session.savedplandetail1[i].schemecode;
				var schemeDesc = req.session.savedplandetail1[i].allocationdescription;
				var schemeCategory = req.session.savedplandetail1[i].allocationcategory;
				var allocationPercentage = req.session.savedplandetail1[i].allocationpercentage;

				var schemeId = req.session.savedplandetail1[i].schemeid;
				console.log("orderid" + userinvestmentorderid);

				if (x <= y) {
					var query = client.query("INSERT INTO userinvestmentdetail(userinvestmentheaderid,schemeid,schemedescription,schemecategory,allocationpercentage,allocationamount,created,modified,createdby,orderid,schemecode) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [userinvestmentheaderid, schemeId, schemeDesc, schemeCategory, allocationPercentage, amount, creation_date, modified_date, req.session.user.name, userinvestmentorderid, schemeCode],
						function (err, result2) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								console.log("User investment details" + result2.rows);


								if (x >= y) {
									//							console.log("inside callback"+i)
									//							console.log("inside callback x"+x)
									//							console.log("inside callback y"+y)
									callback(null, x)
								}
								x++;

								console.log("inside loop x" + x)
								console.log("inside loop y" + y)





							}


						});


				}


			}
		},
		function (x, callback) {


			//get the password for the order creation 

			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmf.in/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmf.in/MFOrderEntry/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmf.in/MFOrderEntry/getPassword">\n         <ns:UserId>109401</ns:UserId>\n          <ns:Password>123456</ns:Password>\n         <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
					var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					orderBsePassArray = password.toString().split("|");
					console.log("Order ENtry Service Password " + orderBsePassArray[1]);
					callback(null, orderBsePassArray[1])

				})

			});





		},
		function (pass, callback) {

			var len = req.session.savedplandetail1.length;

			x = 1; y = len;

			//order entry
			for (i = 0; i < len; i++) {


				console.log("init x" + x);
				console.log("init" + y);


				var amount = req.session.savedplandetail1[i].allocationamount;

				console.log("bse" + i);
				var transCode = "NEW";
				var transNo = req.session.bsetxn1[i];
				var orderId = "";
				var clientCode = "SOHANDEMO2";
				var schemeCode = req.session.savedplandetail1[i].schemecode;
				var buySell = "P";
				var buySellType = "FRESH";
				var DPTxn = "P";
				var orderValue = amount;
				var quantity = "";
				var allRedeem = "N";
				var folioNo = "";
				var remarks = "";
				var KYCStatus = "Y";
				var refNo = "";
				var subBrCode = "";
				var EUIN = "E123456";
				var EUINVal = "Y";
				var minRedeem = "N";
				var DPC = "N";
				var IPAdd = "";

				console.log("transactionNo" + transNo[i]);
				var orderBody = '<ns:TransCode>' + transCode + '</ns:TransCode><ns:TransNo>' + transNo + '</ns:TransNo><ns:OrderId>' + orderId + '</ns:OrderId><ns:UserID>' + userID + '</ns:UserID><ns:MemberId>' + memberID + '</ns:MemberId><ns:ClientCode>' + clientCode + '</ns:ClientCode><ns:SchemeCd>' + schemeCode + '</ns:SchemeCd><ns:BuySell>' + buySell + '</ns:BuySell><ns:BuySellType>' + buySellType + '</ns:BuySellType><ns:DPTxn>' + DPTxn + '</ns:DPTxn><ns:OrderVal>' + orderValue + '</ns:OrderVal><ns:Qty>' + quantity + '</ns:Qty><ns:AllRedeem>' + allRedeem + '</ns:AllRedeem><ns:FolioNo>' + folioNo + '</ns:FolioNo><ns:Remarks>' + remarks + '</ns:Remarks><ns:KYCStatus>' + KYCStatus + '</ns:KYCStatus><ns:RefNo>' + refNo + '</ns:RefNo><ns:SubBrCode>' + subBrCode + '</ns:SubBrCode><ns:EUIN>' + EUIN + '</ns:EUIN><ns:EUINVal>' + EUINVal + '</ns:EUINVal><ns:MinRedeem>' + minRedeem + '</ns:MinRedeem><ns:DPC>' + DPC + '</ns:DPC><ns:IPAdd>' + IPAdd + '</ns:IPAdd><ns:Password>' +
					pass + '</ns:Password><ns:PassKey>' + passKey + '</ns:PassKey><ns:Parma1></ns:Parma1><ns:Param2></ns:Param2><ns:Param3></ns:Param3>';

				var options = {
					method: 'POST',
					url: 'http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc',
					headers: {
						'cache-control': 'no-cache',
						'content-type': 'application/soap+xml; charset=utf-8'
					},
					body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmf.in/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmf.in/MFOrderEntry/orderEntryParam</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:orderEntryParam  xmlns="http://bsestarmf.in/MFOrderEntry/orderEntryParam">\n         ' + orderBody + '  </ns:orderEntryParam>\n   </soap:Body>\n</soap:Envelope>'
				};

				console.log("in loop" + req.session.savedplandetail1[i].allocationdescription);

				request(options, function (error, response, body) {
					if (error) throw new Error(error);


					parseString(body, function (err, results) {
						// Get The Result From The Soap API and Parse it to JSON

						//	console.log(buffer);
						//
						var orderResponse = results["s:Envelope"]["s:Body"][0]["orderEntryParamResponse"][0]["orderEntryParamResult"];
						bseOrderArray = orderResponse.toString().split("|");
						console.log("Transaction code - " + bseOrderArray[0]);
						console.log("Unique Reference Number - " + bseOrderArray[1]);
						console.log("Order Number - " + bseOrderArray[2]);
						console.log("UserId - " + bseOrderArray[3]);
						console.log("MemberId - " + bseOrderArray[4]);
						console.log("Client Code - " + bseOrderArray[5]);
						console.log("BSE Remarks - " + bseOrderArray[6]);
						console.log("Flag - " + bseOrderArray[7]);
						var bseStatus;
						if (bseOrderArray[7] == 1)
							bseStatus = "failure";
						else
							bseStatus = "success";

						var bseTransactionReference = bseOrderArray[1];
						var bseOrderReference = bseOrderArray[2];


						if (x <= y) {

							var query = client.query("UPDATE userinvestmentorders SET bseorderreference = $1, bsestatus = $2 WHERE bsetxnreference =$3 ", [bseOrderReference, bseStatus, bseTransactionReference], function (err, result1) {
								if (err) {
									console.log("cant insert assets header allocation data", err);
									res.send("false");
								} else {


									if (x >= y) {
										//							
										callback(null)
									}
									x++;

									console.log("inside loop x" + x)
									console.log("inside loop y" + y)

								}


							});



						} else {

							console.log("count is more than the expected value" + x + "length" + y);
						}





					})

				});


			}

		},
		function (callback) {

			console.log("I am the payment ");
			//get Password for Payment Link
			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword">\n         <ns:UserId>109401</ns:UserId>\n         <ns:MemberId>10940</ns:MemberId>\n         <ns:Password>123456</ns:Password>\n         <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
					var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					bsePassArray = password.toString().split("|");
					console.log("MFUPload Service Password " + bsePassArray[1]);
					callback(null, bsePassArray[1])

				})

			});


		},
		function (uploadPass, callback) {



			//make the payment 


			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:MFAPI  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI">\n         <ns:Flag>03</ns:Flag>\n		 <ns:UserId>109401</ns:UserId>\n         <ns:EncryptedPassword>' + uploadPass + '</ns:EncryptedPassword>\n         <ns:param>10940|SOHANDEMO2|http://localhost:3000/BsePaymentStatus</ns:param>\n            </ns:MFAPI>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//console.log(results);
					//
					var link = results["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					bseLinkArray = link.toString().split("|");
					console.log("Payment link " + bseLinkArray[1]);
					// callback(null,bseLinkArray[1])
					res.render('bseRedirect', { data: bseLinkArray[1] });

				})

			});


		}],
		function (err, result) {

			if (err)
				throw err;




		})



};

// module.exports = router;