const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please enter a password.'],
        validate: {
            validator: function(val){
                return val == this.password;
            },
            message: "Password and confirm password does not match."
        }
    },
    passwordChangedAt: Date
})

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined;
    next();
})

userSchema.methods.comparePasswordInDb = async function(pswd, pswddb){
    return await bcrypt.compare(pswd,pswddb)
}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const pswdChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(pswdChangedTimeStamp, JWTTimestamp)

        return JWTTimestamp < pswdChangedTimeStamp; 
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
