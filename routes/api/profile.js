const express = require('express')
const router = express.Router();

// @route    Get api/profile
// @des      test route
// @access   public
router.get('/', (req, res) => res.send('profile route'));

module.exports= router;