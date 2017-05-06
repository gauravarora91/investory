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

router.get('/', functions.isLoggedIn, function (req, res) {
  loginStatus = functions.checkLoginStatus(req)
  currentPage = req.session.activePage = '/'
  mobile = req.useragent['isMobile']
  if (mobile) {
    res.render('mobile.ejs', {
      user: req.user,
      smessage: req.flash('signupMessage'),
      lmessage: req.flash('loginMessage'),
      selectorDisplay: 'hide',
      loggedIn: loginStatus,
      footerDisplay: 'show',
      footerData1: 'Blog',
      footerData2: 'FAQs',
      moods: mood

    })
  } else {
    res.render('index.ejs', {
      user: req.user,
      smessage: req.flash('signupMessage'),
      lmessage: req.flash('loginMessage'),
      selectorDisplay: 'hide',
      loggedIn: loginStatus,
      footerDisplay: 'show',
      footerData1: 'Blog',
      footerData2: 'FAQs',
      moods: functions.mood
    })
  }
})

module.exports = router
