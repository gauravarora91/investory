const async = require('async')
const pg = require('pg')
var request = require('request')
var parseString = require('xml2js').parseString
const functions = require('./functions')
const conString = 'postgres://postgres:postgres@localhost:5432/investory'

var client = new pg.Client(conString)
client.connect()

exports.getPrice = (req, res) => {
  currentPage = req.session.activePage = '/Pricing'
  loginStatus = functions.checkLoginStatus(req)
  mobile = req.useragent['isMobile']
  if (mobile) {
    pageName = 'howItWorksMobile'
  } else			{
    pageName = 'howItWorks'
  }
  if (req.session.payU) {
    console.log(req.session.payU)
    var payUData = JSON.parse(JSON.stringify(req.session.payU))
    req.session.payU.flashMessage = false
  } else {
    payUData = ''
  }
  if (req.session.ForPayment) {
    schemeAsked = true
  } else {
    schemeAsked = false
  }

  async.waterfall([
    function (callback) {
      if (loginStatus) {
        current_date = new Date()
        var paid = false
        var query = client.query(' select * from usersubscriptions where userid=' + req.session.user.userid + ' and current_date <= planrenewaldate', function (err, result) {
          if (err) {
            console.log('Cant get portfolio details in goal selection')
          }
          if (result.rows.length > 0) {
            paid = true
            callback(null, paid)
          } else {
            paid = false
            callback(null, paid)
          }
        })
      } else	{
        callback(null, false)
      }
    }], function (err, result) {
    res.render(pageName, {
      user: req.user,
      payU: payUData,
      selectorDisplay: 'show',
      smessage: req.flash('signupMessage'),
      lmessage: req.flash('loginMessage'),
      loggedIn: loginStatus,
      paid: result,
      footerDisplay: 'show',
      footerData1: 'Video Tour',
      footerData2: 'FAQs'
    })
  })
}

exports.postPaymentFailure = (req, res) => {
  loginStatus = functions.checkLoginStatus(req)
  currentPage = req.session.activePage = '/Pricing/failure'
  req.session.payU = req.body
  req.session.payU.flashMessage = true
  req.session.payU.status = 'fail'
  console.log(res.json(req.body))
  res.redirect('/Pricing')
}

exports.postPaymentSuccess = (req, res) => {
  loginStatus = functions.checkLoginStatus(req)
  currentPage = req.session.activePage = '/Pricing/success'

  req.session.payU = req.body
  req.session.payU.flashMessage = true

  var orderDate = req.body.addedon
  var days = 30
  var renewDate = renewalDate(days, orderDate)
  var planId = 1
  var amount = req.body.amount
  var status = req.body.status
  var payRef = req.body.mihpayid
  var txnId = req.body.txnid
  var creation_date = new Date()
  var modified_date = new Date()

  async.waterfall([
    function (callback) {
      var query = client.query('INSERT INTO usersubscriptionsorder(userid,orderdate,amount,paymentreference,status,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8) RETURNING usersubscriptionorderid', [req.session.user.userid, orderDate, amount, payRef, status,
        creation_date, modified_date, req.session.user.name], function (err, result) {
          if (err) {
            console.log('cant insert usersubscriptionsorder data', err)
							// res.send("false");
          } else {
							// res.send(1);
            console.log('usersubscriptionorderid' + result.rows[0]['usersubscriptionorderid'])

            callback(null, result.rows[0]['usersubscriptionorderid'])
          }
        })
    }, function (id, callback) {
      var query = client.query('INSERT INTO usersubscriptions(userid,planid,usersubscriptionorderid,transactionid,price,durationdays,subscribeddate,planrenewaldate,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [req.session.user.userid, planId, id, txnId, amount, days, orderDate, renewDate,
        creation_date, modified_date, req.session.user.name], function (err, result) {
          if (err) {
            console.log('cant insert usersubscriptions data', err)
								// res.send("false");
          } else {
								// res.send(1);

            callback(null, 'done')
          }
        })
    }],
	function (err, result) {
  if (err) {
    throw err
  }
  res.redirect('/Pricing')
}

				)

				// insert into the usersubscriptionsorder and get the usersubscriptionsorderid
				// insert into the usersubscriptions
}

exports.postPay = (req, res, next) => {
  currentPage = req.session.activePage = '/Pricing/pay'
  loginStatus = functions.checkLoginStatus(req)

  async.waterfall([
    function (callback) {
      const merchantKey = 'gtKFFx'
      const salt = 'eCwWELxi'
      const txnid = functions.getTransactionID(req.session.user.userid)
      const amount = req.body.planPrice
      const productinfo = req.body.plan

			// Get from session or User database
      const firstname = req.session.user.name
      const email = req.session.user.email
      const phone = req.session.user.mobile
      const str = merchantKey + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|||||||||||' + salt
      const hash = functions.checksum(str, 'sha512').toLowerCase()

      data = {
        merchantKey: 'gtKFFx',
        hash: 'eCwWELxi',
        amount: amount,
        txnid: txnid,
        firstname: firstname,
        productinfo: productinfo,
        email: email,
        phone: phone,
        surl: 'http://54.152.36.19:3000/Pricing/success',
        furl: 'http://54.152.36.19:3000/Pricing/failure',
        hash: hash,
        service_provider: 'payu_paisa',
        action: 'https://test.payu.in/_payment'
      }

      callback(null, data)
    }],
					function (err, result) {
  if (err) { throw err }
  res.render('redirect', { data: result })
}

	)
}

exports.getBsePayment = (req, res) => {
  var userID = '109401'
  var memberID = '10940'
  var password = '123456'
  var passKey = 'test'

  async.waterfall([
    function (callback) {
						// get Password for Payment Link
      var options = {
        method: 'POST',
        url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/soap+xml; charset=utf-8'
        },
        body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword">\n         <ns:UserId>109401</ns:UserId>\n         <ns:MemberId>10940</ns:MemberId>\n         <ns:Password>123456</ns:Password>\n         <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
      }

      request(options, function (error, response, body) {
        if (error) throw new Error(error)

        parseString(body, function (err, results) {
          var password = results['s:Envelope']['s:Body'][0]['getPasswordResponse'][0]['getPasswordResult'][0]
          bsePassArray = password.toString().split('|')
          console.log('MFUPload Service Password ' + bsePassArray[1])
          callback(null, bsePassArray[1])
        })
      })
    }, function (pass, callback) {
      var options = {
        method: 'POST',
        url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/soap+xml; charset=utf-8'
        },
        body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:MFAPI  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI">\n         <ns:Flag>11</ns:Flag>\n		 <ns:UserId>109401</ns:UserId>\n         <ns:EncryptedPassword>' + pass + '</ns:EncryptedPassword>\n         <ns:param>SOHANDEMO2|723854|BSEMF</ns:param>\n            </ns:MFAPI>\n   </soap:Body>\n</soap:Envelope>'
      }

      request(options, function (error, response, body) {
        if (error) throw new Error(error)

        parseString(body, function (err, results) {
          var link = results['s:Envelope']['s:Body'][0]['MFAPIResponse'][0]['MFAPIResult'][0]
          bsePaymentStatus = link.toString().split('|')
          console.log('Payment Status ' + bsePaymentStatus[1])
          req.session.bseStatus = bsePaymentStatus
          res.redirect('/myStory')
        })
      })
    }], function (err, result) {
  })
}
