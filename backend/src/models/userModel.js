import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },

    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },

    address: {
        type: String,
        required: true,
        trim: true,
    },

    role: {
        type: Number,
        enum: [1, 2, 3], // 1 for superadmin, 2 for admin, 3 for user
        required: true
    },

    status: {
        type: Number,
        enum: [0, 1], // 0 for inactive, 1 for active
        default: 0
    }
}, {timestamps: true});

userSchema.virtual('Property', {
    ref: 'Property', // The model to use
    localField: '_id', // Find jobs where `localField`
    foreignField: 'admin_id', // is equal to `foreignField`
    justOne: false, // true for one-to-one relationships, false for one-to-many
});

// Make sure virtual fields are included in output
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

export const User = mongoose.model('User', userSchema);
