const express = require('express')
const router = express.Router();

// @route    Get api/users
// @des      test route
// @access   public
router.get('/', (req, res) => res.send('user route'));

module.exports= router;