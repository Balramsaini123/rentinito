import { Property } from "../models/propertyModel.js";
import { User } from "../models/userModel.js";

const Property_Register = async (req, res) => {
    try {
        const  { admin_id, property_name, property_address, property_type, property_description, property_rent_amount, agrement_time } = req.body;

        // Check for required fields
        if (!admin_id || !property_name || !property_address || !property_type || !property_description || !property_rent_amount || !agrement_time) {
            return res.status(401).json({
                message: "Invalid data",
                success: false
            });
        }

        const admin = await User.findById(admin_id);
        if (!admin || admin.role !== 2 || admin.status !== 1) {
            return res.status(404).json({
                message: "Admin not found or not authorized",
                success: false
            });
        }
        // Handle the uploaded images
        const propertyImages = req.files["propertyImages"] ? req.files["propertyImages"].map(file => file.path) : [];
        const propertyPapers = req.files["propertyPapers"] ? req.files["propertyPapers"][0].path : null;
        // Create the property record
        await Property.create({
            admin_id,
            property_name,
            property_address,
            property_type,
            property_description,
            property_rent_amount,
            agrement_time,
            property_images: propertyImages, // Save the paths of uploaded images
            property_papers: propertyPapers // Handle this field as needed
        });

        return res.status(201).json({
            message: "Property created successfully",
            success: true,
        });

    } catch (error) {
        res.status(400).json({ 
            message: 'Validation failed', 
            error: error.message
        });
    }
}

async function propertyGet(req, res) {
    const _id = req.params.propertyId;
    try {
        
        const property = await Property.findById(_id)
        if (!property) {
            return res.status(404).send({ message: 'Property not found' });
        }
        res.status(200).send(property);
    } catch (error) {
        
        res.status(500).send({ error: error.message });
    }
}

async function propertiesGet(req, res) {
    try {
        const properties = await Property.find();
        if (!properties || properties.length === 0) {
            return res.status(404).send({ message: 'Properties not found' });
        }
        res.status(200).send(properties);
    } catch (error) {
        
        res.status(500).send({ error: error.message });
    }
}

async function propertyUpdate(req, res) {

    const id = req.params.propertyId;
    try {
        const property = await Property.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true } // This returns the updated document
        );
        if (!property) {
            return res.status(404).send({ message: 'Property not found' });
        }

        res.status(200).send({ message: 'Property updated successfully', property });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
} 

async function propertyDelete(req, res) {

    const id = req.params.propertyId;
    try {
        const property = await Property.findByIdAndDelete(id);
        if (!property) {
            return res.status(404).send({ message: 'Property not found' });
        }
        res.status(200).send({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
export { Property_Register, propertyGet, propertiesGet, propertyUpdate, propertyDelete };
