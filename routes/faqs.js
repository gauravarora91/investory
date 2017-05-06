var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/faqs', function(req, res, next) {
  res.render('faqs', { title: 'FAQs' });
});

module.exports = router;
