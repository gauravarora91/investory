var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var passport = require('passport')
var session = require('express-session')
var admin = require('./routes/admin')
var flash = require('connect-flash')
var useragent = require('express-useragent')
var dotenv = require('dotenv')

const routes = require('./app/routes.js')
const functions = require('./app/routes/functions')
const index = require('./app/routes/index')
const payment = require('./app/routes/payment')
const about = require('./app/routes/about')
const panStatus = require('./app/routes/panStatus')
const goal = require('./app/routes/goal')
const savedPlans = require('./app/routes/savedPlans')
const assetOffline = require('./app/routes/assetOffline')
const order = require('./app/routes/order')
const policies = require('./app/routes/policies')
const stories = require('./app/routes/stories')
const investment = require('./app/routes/investment')
const account = require('./app/routes/account')
const profile = require('./app/routes/profile')
const user = require('./app/routes/user')

var pp = require('./config/passport')
pp(passport)

dotenv.load({ path: '.env' })

var app = express()
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(useragent.express())
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: process.env.SESSION_SECRET}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use('/admin', admin)
app.get('/KnowUs', about.getKnownUs)
app.get('/FAQs', about.faqs)
app.get('/Investment', functions.isLoggedIn, investment.getInvestment)
app.post('/setData', investment.postSetData)
app.post('/showScheme', functions.isLoggedIn, investment.postScheme)

app.get('/GoalSelection', functions.isLoggedIn, goal.goalSelection)
app.get('/GoalInvest', functions.isLoggedIn, goal.goalInvest)

app.get('/SavedPlans', functions.isLoggedIn, savedPlans.getSavedPlans)
app.post('/SavedPlansHeader', functions.isLoggedIn, savedPlans.postPlanHeaders)

app.get('/Pricing', functions.isLoggedIn, payment.getPrice)
app.post('/Pricing/failure', functions.isLoggedIn, payment.postPaymentFailure)
app.post('/Pricing/success', functions.isLoggedIn, payment.postPaymentSuccess)
app.post('/Pricing/pay', functions.isLoggedIn, payment.postPay)

app.get('/BsePaymentStatus', functions.isLoggedIn, payment.getBsePayment)
app.post('/PANStatus', functions.isLoggedIn, panStatus.postPanStatus)
app.post('/PANValidation', functions.isLoggedIn, panStatus.postPanValidation)
app.get('/saveAssetOffline', functions.isLoggedIn, assetOffline.getSaveAsset)
app.post('/InsertOrders', functions.isLoggedIn, order.postInsertOrder)
app.post('/Proceed', functions.isLoggedIn, order.postProceedOrder)

app.get('/myStory', functions.isLoggedIn, stories.getMyStory)
app.get('/YourStory', functions.isLoggedIn, stories.getYourStory)
app.get('/profile', functions.isLoggedIn, profile.getProfile)
app.post('/profile', functions.isLoggedIn, profile.postProfile)
app.get('/Accounts', functions.isLoggedIn, account.getAccount)
app.get('/Invoices', functions.isLoggedIn, account.getInvoice)
app.get('/Transaction', functions.isLoggedIn, account.getTransaction)
app.get('/Settings', functions.isLoggedIn, account.getSetting)
app.get('/reports', functions.isLoggedIn, account.getReports)
app.get('/tocurrent', user.getToCurrent)

app.post('/adminLogin', user.postAdminLogin)


app.post('/signup', functions.askForPayment, user.postSignup)
app.post('/login', user.postLogin)
app.get('/logout', user.getLogout)
app.post('/forgot', user.postForgot)
app.get('/reset/:token', user.getReset)
app.post('/reset/:token', user.postReset)
app.get('/user_data', functions.isLoggedIn, user.getUserData)
app.get('/auth/facebook', user.getFacebookLogin)
app.get('/auth/facebook/callback', user.getFacebookCallback)
app.get('/auth/google', user.getAuthGoogle)


app.get('/Privacy', policies.getPrivacy)
app.get('/Policies', policies.getPolicies)

app.use('/', index)

routes(app, passport)

app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
