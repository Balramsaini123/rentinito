import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    property_name: {
        type: String,
        required: true,
        trim: true
    },

    property_address: {
        type: String,
        required: true,
        trim: true
    },

    property_type: {
        type: Number,
        enum: [1, 2, 3], // 1: Room, 2: Shop, 3: Flat
        required: true
    },

    property_description: {
        type: String,
        required: true,
        trim: true
    },

    property_rent_amount: {
        type: String, // you need to include currency symbols, etc.
        required: true,
        trim: true
    },

    agrement_time: {
        type: String,
        required: true,
        trim: true
    },

    property_images: {
        type: [String], // Array of image file paths
        required: true,
        trim: true
    },

    property_papers: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /\.(pdf|docx)$/i.test(v); // Ensure the file is a PDF or DOCX
            },
            message: props => `${props.value} is not a valid PDF or DOCX file!`
        }
    },

    status: {
        type: Number,
        enum: [0, 1],
        default: 0, // Default to inactive
        required: true
    }

}, { timestamps: true });

propertySchema.virtual('property_type_lable').get(function() {
    const types = {
        1: 'Room',
        2: 'Shop',
        3: 'Flat'
    };
    return types[this.property_type];
});

propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

export const Property = mongoose.model('Property', propertySchema);
