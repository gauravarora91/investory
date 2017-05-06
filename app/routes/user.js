const express = require('express')
const router = express.Router()
const async = require('async')
const pg = require('pg')
const crypto = require('crypto')
var passport = require('passport')
const functions = require('./functions')
const conString = 'postgres://postgres:postgres@localhost:5432/investory'

var client = new pg.Client(conString)
client.connect()

exports.getToCurrent = (req, res) => {
  console.log(req.session.activePage)
  res.redirect(req.session.activePage)
}

exports.postAdminLogin = (req, res) => {
  passport.authenticate('local-admin', {
    successRedirect: 'admin/index', // redirect to the secure profile section
    failureRedirect: 'admin/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
 	})(req, res)
}

exports.postSignup = (req, res) => {
  passport.authenticate('local-signup', {
	  successRedirect: '/saveAssetOffline', // redirect to the secure profile section
	  failureRedirect: '/tocurrent', // redirect back to the signup page if there is an error
	  failureFlash: true // allow flash messages
  })(req, res)
}

/*
* logout
*/

exports.getLogout = (req, res) => {
  req.session.destroy()
  req.logout()
  res.redirect('/')
}

/*
* login
*/

exports.postLogin = (req, res) => {
	 passport.authenticate('local-login', {
   successRedirect: '/saveAssetOffline', // redirect to the secure profile section
   failureRedirect: '/tocurrent', // redirect back to the signup page if there is an error
   failureFlash: true // allow flash messages
 })(req, res)
}

/*
* reset password
*/

exports.getReset = (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.')
      return res.redirect('/')
    }
    res.render('reset', {
      user: req.user
    })
  })
}

exports.postReset = (req, res, done) => {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.')
          return res.redirect('/back')
        }
        var newUser = new User()
        newUser.local.password = req.body.password
        newUser.local.resetPasswordToken = undefined
        newUser.local.resetPasswordExpires = undefined

        user.save(function (err) {
          req.logIn(user, function (err) {
            done(err, user)
          })
        })
      })
    },
    function (user, done) {
      var mailOptions = {

        from: 'nishant143n@gmail.com',
        to: newUser.local.email,
        subject: 'Your password has been changed',
        html: 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error)
        }
        console.log('Message sent: ' + info.response)
      })
    }

  ], function (err) {
    res.redirect('/')
  })
  console.log('end of token route')
}

/*
* forgot password
*/
exports.postForgot = (req, res, next) => {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex')
        done(err, token)
      })
    },
    function (token, done) {
      User.findOne({ 'user.local.email': req.body.email }, function (err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.')
          return res.redirect('/forgot')
        }
				// console.log(user.local.email);
        var newUser = new User()

        newUser.resetPasswordToken = token
        newUser.resetPasswordExpires = Date.now() + 3600000 // 1 hour

        newUser.save(function (err) {
          done(err, token, newUser)
        })
      })
    },
    function (token, user, done) {
      var nodemailer = require('nodemailer')

      var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'nishant143n@gmail.com',
          pass: 'nishant0092'
        }
      }

      var transporter = nodemailer.createTransport(smtpConfig)

      var mailOptions = {
        from: 'nishant143n@gmail.com',
        to: user.local.email,
        subject: 'Node.js Password Reset',
        html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/reset/:' + token + '\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error)
        }
        console.log('Message sent: ' + info.response)
      })
    }
  ], function (err) {
    if (err) return next(err)

    else res.redirect('/')
  })
}

/*
* user Data
*/
exports.getUserData = (req, res) => {
  console.log(req.session)
  loginStatus = functions.checkLoginStatus(req)
  console.log(functions.checkLoginStatus(req))
  res.setHeader('Content-Type', 'application/json')
  res.send(req.session)
}

/*
* social login
*/

exports.getFacebookLogin = (req, res) => { passport.authenticate('facebook', { scope: ['email'] })(req, res) }

exports.getFacebookCallback = (req, res) => {
  passport.authenticate('facebook', {
    successRedirect: '/tocurrent',
    failureRedirect: '/',
    scope: ['email']
  }), (function (req, res, next) {

  }(req, res))
}

exports.getAuthGoogle = (req, res) =>	{
  passport.authenticate('google', { scope: ['profile', 'email'] })
  router.get('/auth/google/callback',
	passport.authenticate('google', {
  successRedirect: '/tocurrent',
  failureRedirect: '/'
}))(req, res)
}

// module.exports = router;
