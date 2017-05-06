/*
* Modules *
*/
const express = require('express')
const router = express.Router()
const async = require('async')
const pg = require('pg')
const crypto = require('crypto')
/* common functions */
const functions = require('./functions')

var conString = process.env.DATABASE_URL
var client = new pg.Client(conString)
client.connect()

var currentPage

function getUserSubscriptions (req) {
  return function (callback) {
    var paid = false
    var query = 'select * from usersubscriptions where userid=' + req.session.user.userid
    console.log(query)
    client.query(query, function (err, result) {
      if (err) {
        console.log(err)
        callback(err)
      }
      if (result.rows.length > 0) {
      	paid = true
      	//req.session.paid = true;
      	callback(null, paid)
      } else {
      	paid = false
      	//req.session.paid = false;
      	callback(null, paid)
      }
    })
  }
}

function fetchSavedPlans (something, callback) {
  console.log('something: ' + something)
  return function (callback) {
    var query = client.query("SELECT * FROM savedplansheader inner join goal on savedplansheader.goalid = goal.goalid where savedplansheader.userid=$1 and savedplansheader.status = 'active' ORDER BY savedplansheader.created DESC  ", [req.session.user.userid],
    function (err, result) {
      if (err) {
        console.log('Cant get assets values' + err)
      }
      console.log('details header' + result.rows.length)
      asetData = result.rows
      console.log(asetData)
      if (result.rows.length > 0) {
        // req.session.savedplanheader = asetData;
        callback(null, asetData)
      } else {
        res.render('savedPlans', {
          user: req.user,
          selectorDisplay: 'show',
          assetPlanDetail: false,
          plansHeader: false,
          plansDetail: false,
          loggedIn: loginStatus,
          smessage: req.flash('signupMessage'),
          lmessage: req.flash('loginMessage'),
          footerDisplay: 'hide',
          footerData1: 'Blog',
          footerData2: 'FAQs'
        })
      }
    })
  }
}


function getSavedPlansDetail (something, callback) {
  return function (callback) {
    var x = 1
    var y = headerData.length
    for (i = 0; i < headerData.length; i++) {
      var asetDataAllocationDetail = []
      if (x <= y) {
        var query = client.query('SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2', [headerData[i].savedplanid, 'allocation'],
          function (err, result) {
            if (err) {
              console.log('Cant get assets values')
            }
            asetDataAllocationDetail = result.rows
            // req.session.savedplandetail = asetDataDetail;
            console.log(asetDataAllocationDetail)
            if (x >= y) {
              if (pay) {
                callback(null, asetData, asetDataAllocationDetail)
              } else {
                // only render the data present in the header
                res.render('savedPlans', {
                  user: req.user,
                  plansHeader: asetData,
                  assetPlanDetail: asetDataAllocationDetail,
                  plansDetail: false,
                  selectorDisplay: 'show',
                  loggedIn: loginStatus,
                  smessage: req.flash('signupMessage'),
                  lmessage: req.flash('loginMessage'),
                  footerDisplay: 'hide',
                  footerData1: 'Blog',
                  footerData2: 'FAQs'
                })
              }
            }
            x++
          })
      }
    }
  }
}


exports.getSavedPlans = (req, res) => {
  async.waterfall([
    getUserSubscriptions(req),
    // fetchSavedPlans,
    // getSavedPlansDetail
  ], function (error, success) {
    if (error) { console.log(error) }
    console.log('done')
    // return alert('Done!')
  })
}

// exports.getSavedPlans = (req, res) => {
//   async.waterfall([,
// 		 function (pay, callback) {
//      }
//   ]);
// }

// 			// Fetch Header
// 			// store the data in a json
//    async.waterfall([
//      function (headerData, asetDataAllocationDetail, callback) {
//        var x = 1
//        var y = headerData.length
//        var asetDataDetail = {}
//        console.log('header length' + headerData.length)
//        for (i = 0; i < headerData.length; i++) {
//          if (x <= y) {
//            var query = client.query('SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2', [headerData[i].savedplanid, 'scheme'],
// 								function (err, result) {
//   if (err) {
//     console.log('Cant get assets values')
//   }
//   asetDataDetail = result.rows
//   console.log('saved detail' + asetDataDetail)
//   console.log(asetDataAllocationDetail)
//   console.log(headerData)
//   console.log(asetDataDetail)
//   if (x >= y) {
//     res.render('savedPlans', {
//       user: req.user,
//       assetPlanDetail: asetDataAllocationDetail,
//       plansHeader: headerData,
//       plansDetail: asetDataDetail,
//       selectorDisplay: 'show',
//       loggedIn: loginStatus,
//       smessage: req.flash('signupMessage'),
//       lmessage: req.flash('loginMessage'),
//       footerDisplay: 'hide',
//       footerData1: 'Blog',
//       footerData2: 'FAQs'
//     })
//   }
//   x++
// })
//          }
//        }
//      }], function (err, result) {
//    })
//  }
//   ], function (err, result) {
// 		// console.log(result);
//   })
//}

exports.postPlanHeaders = (req, res) => {
  loginStatus = checkLoginStatus(req)
  if (loginStatus) {
    var creation_date = new Date()
    var modified_date = new Date()
    var status = 'active'
    console.log('body: ' + req.body)
    async.waterfall([
      function (callback) {
        var query = client.query('select goalid from goal where goal.name=$1', [req.body.goalName], function (err, result) {
          if (err) {
            console.log('cant insert assets header allocation data', err)
            res.send('false')
          } else {
						// res.send(1);
            console.log('goalid' + result.rows[0]['goalid'])
            callback(null, result.rows[0]['goalid'])
          }
        })
      },

      function (goalid, callback) {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>SavedPlanHeader')
        console.log(req.session.user.userid)
        console.log(goalid)
        console.log(req.body.riskProfile)
        console.log(req.body.masterAmount)
        console.log(req.body.totalYears)
        console.log(req.body.sip)
				// insert to the saved plans header
        var query = client.query('INSERT INTO savedplansheader(userid,goalid,riskprofile, masteramount, totalyears, sip,status,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING savedplanid', [req.session.user.userid, goalid, req.body.riskProfile, req.body.masterAmount, req.body.totalYears, req.body.sip, status, creation_date, modified_date, req.session.user.name], function (err, result) {
          if (err) {
            console.log('cant insert assets header allocation data', err)
            res.send('false')
          } else {
							// res.send(1);
            console.log('savedplanid' + result.rows[0]['savedplanid'])
            callback(null, result.rows[0]['savedplanid'])
          }
        })
      },
      function (savedPlanId, callback) {
				// insert to the saved plans details
        var percentage = [req.body.equityPercentage, req.body.hybridPercentage, req.body.debtPercentage]
        var amount = [req.body.equityAmount, req.body.hybridAmount, req.body.debtAmount]
        console.log('I m here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(percentage[0])
        console.log(percentage[1])
        console.log(percentage[2])
        console.log(amount[0])
        console.log(amount[1])
        console.log(amount[2])

        var type = 'allocation'
        var category = ['Equity', 'Hybrid', 'Debt']
        console.log('id=' + savedPlanId)
				/*, (savedPlanId,type,category[1],category[1],percentage[1],amount[1],creation_date,modified_date,req.session.user.name),(savedPlanId,type,category[2],category[2],percentage[2],amount[2],creation_date,modified_date,req.session.user.name) */
        var query = client.query('INSERT INTO savedplansdetail(savedplanid,allocationtype,allocationcategory, allocationdescription, allocationpercentage, allocationamount,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9),($10,$11,$12,$13,$14,$15,$16,$17,$18),($19,$20,$21,$22,$23,$24,$25,$26,$27)', [savedPlanId, type, category[0], category[0], percentage[0], amount[0], creation_date, modified_date, req.session.user.name, savedPlanId, type, category[1], category[1], percentage[1], amount[1], creation_date, modified_date, req.session.user.name, savedPlanId, type, category[2], category[2], percentage[2], amount[2], creation_date, modified_date, req.session.user.name]
					, function (err, result) {
  if (err) {
    console.log('cant insert assets detail allocation data', err)
    res.send('false')
  } else {
    console.log(result.rows)
    callback(null)
  }
})
      }],
			function (err, result) {
  if (err) {
    throw err
  }
  async.waterfall([function (callback) {
					// Fetch Header
					// store the data in a json
    var query = client.query('SELECT * FROM savedplansheader where userid=$1 ORDER BY created DESC LIMIT 1 ', [req.session.user.userid],
						function (err, result) {
  if (err) {
    console.log('Cant get assets values')
  }
							// console.log("saved plan header"+req.session.savedplanheader.sip);

  asetData = result.rows[0]
  req.session.savedplanheader = asetData
  console.log('saved plan header' + req.session.savedplanheader.goalid)
  console.log('saved plan header' + req.session.savedplanheader.riskprofile)
  console.log('saved plan header' + req.session.savedplanheader.masteramount)
  console.log('saved plan header' + req.session.savedplanheader.totalyears)
  console.log('saved plan header' + req.session.savedplanheader.userid)
  callback(null, asetData)
})
  },
    function (headerData, callback) {
      console.log(headerData)
      var query = client.query('SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2 ORDER BY created DESC LIMIT 3 ', [headerData.savedplanid, 'allocation'],
						function (err, result) {
  if (err) {
    console.log('Cant get assets values')
  }
  asetDataDetail = result.rows
  console.log(asetDataDetail[1])
  callback(null, headerData, asetDataDetail)
})

					// fetch Detail
					// using header id
					// store the data in a json
    }, function (headerData, detailData, callback) {
      console.log('data', headerData.riskprofile)
					// initialize query
					// using the json data
					// pass the query

      var amount = {

        amount1: detailData[0].allocationamount,
        amount2: detailData[1].allocationamount,
        amount3: detailData[2].allocationamount

      }
					// console.log(amount);

      var time = headerData.totalyears
      var sip = headerData.sip
      var riskProfile = headerData.riskprofile
					// callback(null,query);

      if (req.body.lumpsum) {
        console.log('lumpsum' + req.body.lumpsum)
        var amt = []
        amt[0] = req.body.masterAmount

        var query = client.query('select * from lumpsum_schemes where $1 between fromamount and toamount and $2 between fromyear and toyear and riskprofile = $3', [req.body.masterAmount, time, riskProfile],
							function (err, result) {
  if (err) {
    console.log('Cant get assets values')
  }

  scheme = result.rows
  console.log('daadadadadadadad' + scheme.length)
  for (i = 0; i < scheme.length; i++) {
    var percentage = 100
    var type = 'scheme'
    var category = scheme[i].category
    var schemeDescription = scheme[i].name
    var schemeCode = scheme[i].code
    var schemeId = scheme[i].lumpsumschemeid
    console.log(scheme[i].code)
									// var schemeCode = scheme[i].code;
    creation_date = new Date()
    modified_date = new Date()
    console.log('amt=' + amt[i])
									/* req.session.savedplandetail[i].allocationamount = amt[0];
									 req.session.savedplandetail[i].schemecode = schemeCode;
									req.session.savedplandetail[i].allocationdescription = schemeDescription;
									req.session.savedplandetail[i].allocationcategory = category;
									req.session.savedplandetail[i].allocationpercentage = percentage;
									req.session.savedplandetail[i].schemeid = schemeId; */

    var query = client.query('INSERT INTO savedplansdetail(savedplanid,allocationtype,allocationcategory, allocationdescription, allocationpercentage, allocationamount,created,modified,createdby,schemecode,schemeid) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [headerData.savedplanid, type, category, schemeDescription, percentage, req.body.masterAmount, creation_date, modified_date, req.session.user.name, schemeCode, schemeId]
										, function (err, result) {
  if (err) {
    console.log('cant insert assets detail allocation data', err)
												// res.send("false");
  } else {
												// res.send(1);
    console.log('result' + req.body.masterAmount)
												// callback(null)
  }
})
  }
								// calculateScheme();
								// res.redirect("/Pricing");
  callback(null, amt)
})
      } else {
        var schemecamntde = 0, schemecamnteq = 0, schemecamnthy = 0
        var schememamntde = 0, schememamnteq = 0, schememamnthy = 0
        var schemeagamnthy = 0, schemeagamnteq = 0, schemeagamnteq = 0
						// select * from schemesmaster where $1 between sipfrom and sipto and $2 between yearfrom and yearto and riskprofile = $3
        var j = 0, k = 0, l = 0
        var query = client.query('select * from schemesmaster where $1 between sipfrom and sipto and $2 between yearfrom and yearto and riskprofile = $3 order by category ', [sip, time, riskProfile],
							function (err, result) {
  if (err) {
    console.log('Cant get assets values')
  }
  scheme = result.rows
								// console.log(scheme.length+"scheme"+scheme[1].name+scheme[1].category+"schemecode"+scheme[1].code);

  for (i = 0; i < scheme.length; i++) {
    if ((scheme[i].category) == 'Equity') {
      j = j + 1
    }

    if ((scheme[i].category) == 'Hybrid') {
      k = k + 1
    }

    if ((scheme[i].category) == 'Debt') {
      l = l + 1
    }
  }
  console.log('j' + j + 'k' + k + 'l' + l)

  for (i = 0; i < scheme.length; i++) {
    if (j == 0 || j == 1) {
      schemecamnteq = amount.amount1
    } else {
      schemecamnteq = amount.amount1 / j
    }
    if (k == 0 || k == 1) {
      schemecamnthy = amount.amount2
    } else {
      schemecamnthy = amount.amount2 / k
    }
    if (l == 0 || l == 1) {
      schemecamntde = amount.amount3
    } else {
      schemecamntde = amount.amount3 / l
    }
  }

  console.log('Equity' + schemecamnteq + 'Hybrid' + schemecamnthy + 'Debt' + schemecamntde)

  var schemeAmount = {

    equityAmt: schemecamnteq,
    hybridAmt: schemecamnthy,
    debtAmt: schemecamntde

  }

  var amt = []

  for (i = 0; i < scheme.length; i++) {
    if (scheme[i].riskprofile == 'Aggressive') {
      var amtamount1 = 0, amtmd4 = 0

      if ((scheme[i].category) == 'Equity') {
        var amtamount2 = 0, remainamt = 0, amtremainadded = 0, amtagg = 0

        var amtrounded1 = 0, amtrounded2 = 0, amtrounded5 = 0

											// remainamt=amount.amount1-totalrounded;

        console.log('Equity j value', j)

        for (var n = 0; n < j; n++) {
          amtrounded5 = Math.floor((schemecamnteq) / 1000) * 1000
          amtamount1 = schemecamnteq - amtrounded5
          amtagg += amtamount1
          console.log('Equity rating 1', amtagg, amtrounded5)
        }

        if ((scheme[i].rating) >= 2) {
          console.log('Equity in schemes', amtrounded5)
          amt[i] = amtrounded5
        }
        if ((scheme[i].rating) == 1) {
          console.log('Equity in schemes' + amtrounded5)
          var amountagg = amtrounded5 + amtagg
          amountagg = Math.round((amountagg) / 1000) * 1000
          amt[i] = amountagg
        }

        if ((scheme[i].rating) == 0) {
          console.log('Equity' + schemecamnteq)
          amt[i] = schemecamnteq
        }
      }

      var amtamount1 = 0, amtmd4 = 0, amtrounded1 = 0
      if ((scheme[i].category) == 'Hybrid') {
        var amtamount2 = 0
        amtrounded1 = Math.floor((schemecamnthy) / 1000) * 1000
        amtamount1 = schemecamnthy - amtrounded1
        amtamount1 += amtamount1

        amtmd4 = schemecamnthy + amtamount1
        amt7 = Math.round(amtmd4 / 1000) * 1000
        if ((scheme[i].rating) >= 1) {
          if ((scheme[i].rating) > 1) {
            console.log('Hybrid' + amtrounded1)
            amt[i] = amtrounded1
          }

          if ((scheme[i].rating) == 1) {
            console.log('Hybrid' + amt7)
            amt[i] = amt7
          }
        }
        if ((scheme[i].rating) == 0) {
          console.log('Hybrid' + schemecamnthy)
          amt[i] = schemecamnthy
        }
      }

      var amtamount1 = 0, amtmd4 = 0, amtrounded1 = 0
      if ((scheme[i].category) == 'Debt') {
        var amtamount2 = 0
        amtrounded1 = Math.floor((schemecamntde) / 1000) * 1000
        amtamount1 = schemecamntde - amtrounded1
        amtamount1 += amtamount1
        amtmd4 = schemecamntde + amtamount1
        amt8 = Math.round(amtmd4 / 1000) * 1000
        if ((scheme[i].rating) >= 1) {
          if ((scheme[i].rating) > 1) {
            console.log('Debt' + amtrounded1)
            amt[i] = amtrounded1
          }
          if ((scheme[i].rating) == 1) {
            console.log('Debt' + amt8)
            amt[i] = amt8
          }
        }
        if ((scheme[i].rating) == 0) {
          console.log('Debt' + schemecamntde)
          amt[i] = schemecamntde
        }
      }
    } else {
      var amtrounded1 = 0
      if ((scheme[i].category) == 'Equity') {
        if ((scheme[i].rating) > 1) {
          amtrounded1 = Math.floor((schemecamnteq) / 1000) * 1000
          console.log('Equity' + amtrounded1)
          amt[i] = amtrounded1
        }
        if ((scheme[i].rating) == 1) {
          amtme1 = Math.round(schemecamnteq / 1000) * 1000
          console.log('Equity' + amtme1)
          amt[i] = amtme1
        }
        if ((scheme[i].rating) == 0) {
          console.log('Equity' + schemecamnteq)
          amt[i] = schemecamnteq
        }
      }
      var amtamount1 = 0, amtmd4 = 0, amtrounded1 = 0
      if ((scheme[i].category) == 'Hybrid') {
        if ((scheme[i].rating) > 1) {
          amtrounded1 = Math.floor((schemecamnthy) / 1000) * 1000
          console.log('Hybrid' + amtrounded1)
          amt[i] = amtrounded1
        }
        if ((scheme[i].rating) == 1) {
          amtme1 = Math.round(schemecamnthy / 1000) * 1000
          console.log('Hybrid' + amtme1)
          amt[i] = amtme1
        }
        if ((scheme[i].rating) == 0) {
          console.log('Hybrid' + schemecamnthy)
          amt[i] = schemecamnthy
        }
      }
      var amtamount1 = 0, amtmd4 = 0, amtrounded1 = 0
      if ((scheme[i].category) == 'Debt') {
        if ((scheme[i].rating) > 1) {
          amtrounded1 = Math.floor((schemecamntde) / 1000) * 1000

          console.log('Debt' + amtrounded1)
          amt[i] = amtrounded1
        }
        if ((scheme[i].rating) == 1) {
          amtme4 = Math.round(schemecamntde / 1000) * 1000
          console.log('Debt' + amtme4)
          amt[i] = amtme4
        }
        if ((scheme[i].rating) == 0) {
          console.log('Debt' + schemecamntde)
          amt[i] = schemecamntde
        }
      }
    }
  }

								// insert into the details

								/* var	schemeData = {[

												  ]}

											var panJSON = JSON.stringify(data);	*/

  for (i = 0; i < scheme.length; i++) {
    var percentage = 0

    var type = 'scheme'
    var category = scheme[i].category
    var schemeDescription = scheme[i].name
    var schemeCode = scheme[i].code
    var schemeId = scheme[i].schemeid
    console.log(scheme[i].code)
									// var schemeCode = scheme[i].code;
    creation_date = new Date()
    modified_date = new Date()
    console.log('amt=' + amt[i])

									/*, (savedPlanId,type,category[1],category[1],percentage[1],amount[1],creation_date,modified_date,req.session.user.name),(savedPlanId,type,category[2],category[2],percentage[2],amount[2],creation_date,modified_date,req.session.user.name) */

    var query = client.query('INSERT INTO savedplansdetail(savedplanid,allocationtype,allocationcategory, allocationdescription, allocationpercentage, allocationamount,created,modified,createdby,schemecode,schemeid) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [headerData.savedplanid, type, category, schemeDescription, percentage, amt[i], creation_date, modified_date, req.session.user.name, schemeCode, schemeId]
										, function (err, result) {
  if (err) {
    console.log('cant insert assets detail allocation data', err)
												// res.send("false");
  } else {
												// res.send(1);
    console.log('result' + result.rows)

												// callback(null)
  }
})
  }

								// calculateScheme();
								// res.redirect("/Pricing");
  callback(null, amt)
})
      }
					// fetch the scheme info
    }], function (err, amount) {
    var query = client.query('SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2', [req.session.savedplanheader.savedplanid, 'scheme'],
						function (err, result) {
  if (err) {
    console.log('Cant get assets values')
  }

  var asetDataDetail = result.rows
  req.session.savedplandetail = asetDataDetail

  var sdata = []
  sdata[0] = scheme

  sdata[1] = amount
							//	console.log("lumpsum amount"+req.session.savedplandetail[0].allocationamount)
  res.send(sdata)
							// callback(null,headerData,asetDataDetail)
})

					// dislay the scheme information
  })
}

		)
  } else {
		//	console.log('body: you are not loggedIn' );
    res.send(0)
  }
}

// module.exports = router;
