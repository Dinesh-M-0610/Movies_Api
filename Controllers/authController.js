const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomError')
const util = require('util')

const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
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

    if(testToken && testToken.startsWith('bearer')){
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
    
    if(user.isPasswordChanged(decodedToken.iat)){
        const error = new CustomError('The password has been changed recently. please login again', 401)
        return next(error);
    }

    req.user = user;
    next();
})