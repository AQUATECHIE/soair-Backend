const express = require('express')
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config")
const {check, validationResult} = require('express-validator');

const User = require('../../models/Users')

// @route    Post api/users
// @des      register  user
// @access   public
router.post('/', [
    check('name', 'NAme is required').not()
    .isEmpty(),
    check('email', 'please include a valid email').isEmail(),
    check('password', 'please input a correct password with 6 or more char').isLength({ min:6 })
], 
async (req, res) => {
    const errors = validationResult(req);
    if( !errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});

    }

    
    try {
        const {name, email, password} = req.body

        // see if user exists
        let user = await User.findOne({email});

        if(user) {
            return res.status(400).json({error: [{msg: "User already exists"}] });
        }

    
    
        //  Get users gravatar
        const avatar =  gravatar.url(email, {
            s:'200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });
    
    
        //  encrypt password

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
    
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