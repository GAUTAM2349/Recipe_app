const express = require("express");
const { forgotPassword, forgotPasswordRequest, resetPassword } = require("../controllers/password");
const router = express.Router();

router.post('/forgot-password', forgotPasswordRequest);
router.post('/reset-password', resetPassword);


module.exports = router;