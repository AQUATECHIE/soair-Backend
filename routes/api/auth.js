const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const auth = require('../../Middlewares/auth')
const User = require('../../models/Users')
const config = require("config")
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

// @route    Get api/auth
// @des      test route
// @access   public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
});

// @route    Post api/auth
// @des      authenticate  user and get token
// @access   public
router.post('/', [
    
    check('email', 'please include a valid email').isEmail(),
    check(
        'password', 
        'password is required').exists()
], 
async (req, res) => {
    const errors = validationResult(req);
    if( !errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});

    }

    
    try {
        const { email, password} = req.body

        // see if user exists
        let user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({error: [{msg: "invalid credentials"}] });
        }

        // check if password match
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({error: [{msg: "invalid credentials"}] });
        }
    
        

       
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, 
        config.get('jwtSecret'),{expiresIn: 36000},
        (err, token)=>{
            if(err) throw err;
            res.json({ token });
        } )

    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error')
    }


}

);

module.exports= router;