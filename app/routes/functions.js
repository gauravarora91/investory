var crypto = require('crypto')

function checkLoginStatus (req) {
  if (req.session.loggedIn) {
    return true
  } else {
    return false
  }
}

function mail (from, to, subject, text) {
  var apiKey = 'key-cd53eadfa9793e5786ddbdf759cf0c44'
  var domain = 'sandbox36a9c8afddc44d2781db5e3780497211.mailgun.org'
  var mailgun = require('mailgun-js')({ apiKey: apiKey, domain: domain })
  var data = {
    from: from,
    to: to,
    subject: subject,
    text: text
  }
  mailgun.messages().send(data, function (error, body) {
    if (error) {
      console.log(error)
    }
  })
}

function renewalDate (days, oldDate) {
  var split1 = oldDate.split(' ')
  var split2 = split1[0].split('-')
  var newDate = new Date(split2[0] + '-' + split2[1] + '-' + split2[2])
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

function checksum (str, algorithm, encoding) {
  return crypto
    .createHash(algorithm)
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

function getTransactionID (userid) {
  var date = new Date()
  var hour = date.getHours()
  hour = (hour < 10 ? '0' : '') + hour
  var min = date.getMinutes()
  min = (min < 10 ? '0' : '') + min
  var sec = date.getSeconds()
  sec = (sec < 10 ? '0' : '') + sec
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  month = (month < 10 ? '0' : '') + month
  var day = date.getDate()
  day = (day < 10 ? '0' : '') + day
  console.log('in gettxn' + sec)
  return year + month + day + hour + min + sec + userid
}

function checkPan (req) {
  if (req.session.panMessage) {
    return true
  } else {
    return false
  }
}

function checkPaymentStatus (req) {
  console.log(req.session.payment + 'checkStatus')
  if (req.session.payment) {
    return true
  } else {
    return false
  }
}

var mood = [
    { name: 'Broke' },
    { name: 'Nerdy' },
    { name: 'Rich' },
    { name: 'Responsible' },
    { name: 'Loved' },
    { name: 'Social' }
]

var navActive = [
    { mStoryAct: '' },
    { reportsAct: '' },
    { myProfileAct: '' },
    { accountAct: '' },
    { messagesAct: '' }
]

/*
* middlewares
*/

function isLoggedIn (req, res, next) {
  var a = req.isAuthenticated()
  if (a) {
    req.session.loggedIn = true
    req.session.user = req.user
    return next()
  }
  req.session.user = ''
  req.session.loggedIn = false
  return next()
}

function askForPayment (req, res, next) {
  if (req.body.askScheme || req.session.ForPayment) {
    req.session.ForPayment = true
  } else {
    req.session.ForPayment = false
  }
  return next()
}

module.exports = {
  'checkLoginStatus': checkLoginStatus,
  'mail': mail,
  'renewalDate': renewalDate,
  'checksum': checksum,
  'getTransactionID': getTransactionID,
  'checkPan': checkPan,
  'checkPaymentStatus': checkPaymentStatus,
  'mood': mood,
  'navActive': navActive,
  'isLoggedIn': isLoggedIn,
  'askForPayment': askForPayment
}
