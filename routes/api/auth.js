const express = require('express')
const router = express.Router();

// @route    Get api/auth
// @des      test route
// @access   public
router.get('/', (req, res) => res.send('auth route'));

module.exports= router;