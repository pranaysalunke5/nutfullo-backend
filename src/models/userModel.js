import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: String,

    email: {
        type: String,
        unique: true,
        sparse: true,
    },

    mobile: {
        type: String,
        unique: true,
        sparse: true,
    },

    role: {
        type: String,
        enum: ['admin', 'wholesaler', 'gym_partner', 'retail_partner', 'distributor','developer','sales'],
        default: 'retail_partner',
    },

    otp: {
        type: String,
        select: false,
    },

    otpExpire: {
        type: Date,
        select: false,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

export default mongoose.model('User', userSchema);