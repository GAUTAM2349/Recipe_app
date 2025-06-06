const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { ForgotPasswordRequest } = require("../models");
const { transporter } = require("../utils/nodemailer");
const bcrypt = require("bcrypt");
const { User } = require("../models");


const forgotPasswordRequest = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found.",
    });
  }

  const generatedId = uuidv4();

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.user.email,
    subject: "Password Reset Request",
    html: `<a href="${process.env.BASE_URL}/reset-password/${generatedId}">Click here to reset your password</a>`,
  };

  try {
    const passwordResetRequest = await ForgotPasswordRequest.create({
      id: generatedId,
      userId: user.id,
      isActive: true,
    });

    if (!passwordResetRequest) {
      return res.status(500).json({
        success: false,
        message: "Failed to create reset request.",
      });
    }

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent.",
    });
  } catch (error) {
    console.error("Error sending reset email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send password reset email.",
      error: error.message,
    });
  }
};



const resetPassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body;

        console.log(JSON.stringify(req.user));

        const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
            where: { userId: req.user.id }
        });

        if (!forgotPasswordRequest.isActive) {
            return res.status(400).json({
                message: 'Reset link has expired or is no longer valid.',
            });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long.',
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = req.user;

        await User.update(
            { password: hashedPassword },
            { where: { id: user.id } }
        );

        await ForgotPasswordRequest.update(
            { isActive: false },
            { where: { id: forgotPasswordRequest.id } }
        );

        return res.status(200).json({
            message: 'Password updated successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong while updating the password.',
            error: error.message,
        });
    }
};






module.exports = { forgotPasswordRequest,resetPassword };
