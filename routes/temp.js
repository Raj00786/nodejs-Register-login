var express = require('express')
var router = express.Router()

// middleware that is specific to this router

router.use(function timeLog (req, res) {
  console.log('Time: ', Date.now())
})

// define the home page route
router.get('/birds', function (req, res,next) {
  res.send('Birds home page');
  console.log(req.timeLog);
  next();
});



// define the about route
router.get('/about', function (req, res) {
  res.send('About birds');
})

module.exports = router;