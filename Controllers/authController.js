const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomError')
const util = require('util')
const sendEmail = require('./../Utils/email');
const crypto = require('crypto')

const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

const createSendResponse = (user, statusCode, res) => {
    const token = signToken(user._id)
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = User.create(req.body);

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = asyncErrorHandler(async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email && !password){
        const error = new CustomError("Please provide email and password for login in", 400);
        return next(error);
    }

    const user = await User.findOne({ email }).select('+password');
    const isMatch = await user.comparePasswordInDb(password, user.password);

    if(!user || isMatch){
        const error = new CustomError('Incorrect email or password', 400);
        return next(error)
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = asyncErrorHandler(async (req,res,next) => {
    const testToken = req.headers.authorization
    let token;

    if(testToken && testToken.startsWith('Bearer')){
        token = testToken.split(' ')[1];
    }
    if(!token){
        next(new CustomError('You are not logged in!', 401));
    }

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    const user = await User.findById(decodedToken.id);

    if(!user){
        const error = new CustomError('The User with the given token does not exict', 401);
        next(error);
    }
    
    if(await user.isPasswordChanged(decodedToken.iat)){
        const error = new CustomError('The password has been changed recently. please login again', 401)
        return next(error);
    }

    req.user = user;
    next();
})

exports.restrict = (...role) => {
    return (req,res,next) => {
        if(role.includes(req.user.role)){
            const error = new CustomError("You do not have permission to perform this action", 401);
            next(error);
        }
        next();
    }
}

exports.forgotPassword = asyncErrorHandler(async (req,res,next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user){
        const error = new CustomError('We could not find the user with given email', 401);
        next(error);
    }

    const resetToken = user.createResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. PLease use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link works only for 10 minutes.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request received',
            message: message
        });

        res.status(200).json({
            status: 'success',
            message: 'password reset link send to the user email'
        })
    }catch (err){
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({validateBeforeSave: false})

        return next(new CustomError('There was an error sending password reset emial. Please try agin later', 500));
    }
})

exports.passwordReset = asyncErrorHandler(async (req,res,next) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}})

    if(!user){
        const error = new CustomError('Token is invalid or has expired!', 400);
        next(error);
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    user.save();

    const loginToken = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: loginToken
    })
})

exports.updatePassword = asyncErrorHandler(async(req,res,next) => {
    const user = User.findById(req.user._id).select('+password');

    if(user.comparePasswordInDb(req.body.currentPassword, user.password)){
        return next(new CustomError("The current password you provided is wrong", 401));
    }

    user.password = req.body.password,
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
})