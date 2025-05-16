const express = require('express');
const { register, login } = require('../controllers/auth');

const router = express.Router();


// Public routes
router.post('/register', (req,res,next)=>{ console.log("came inside route"); next();} ,register);
router.post('/login', (req,res,next)=>{ console.log("came inside route"); next();} ,login);


module.exports = router;