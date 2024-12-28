const express = require('express')
const router = express.Router();

// @route    Get api/post
// @des      test route
// @access   public
router.get('/', (req, res) => res.send('posts route'));

module.exports= router;