var pg = require('pg')
var functions = require('./routes/functions')

var conString = process.env.DATABASE_URL
var client = new pg.Client(conString)
client.connect()

module.exports = function (app, passport) {
  app.post('/Discard', functions.isLoggedIn, function (req, res) {
    client.query('update savedplansheader set status=$1 where savedplanid=$2', [
      'inactive', req.body.savedplanid
    ], function (err, result) {
      if (err) {
        console.log('cant insert assets header allocation data', err)
        res.send('false')
      } else {
        res.send('true')
      }
    })
  })
}
