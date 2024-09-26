import { User } from "../models/userModel.js";

// Middleware for admin authorization
const authorizeAdmin = async (req, res, next) => {
    try {
        const admin_id = req.body.admin_id; // Assuming admin_id is passed in the request body

        // Find the user (admin) by ID
        const admin = await User.findById(admin_id);
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false
            });
        }

        // Check if the user has an admin or superadmin role
        if (admin.role == 3 || admin.role == 1) {
            return res.status(403).json({
                message: "Unauthorized: Only admins can access this route",
                success: false
            });
        }

        // Check if the admin account is active
        if (admin.status !== 1) {
            return res.status(403).json({
                message: "Unauthorized: Your account is inactive. Please contact support.",
                success: false
            });
        }

        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Authorization failed",
            error: error.message,
        });
    }
};

const authorizeSuperAdmin = async (req, res, next) => {
    try {
        const admin_id = req.body.admin_id; // Assuming admin_id is passed in the request body  

        // Find the user (admin) by ID
        const admin = await User.findById(admin_id);
        console.log(admin);
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false
            });
        }

        // Check if the user has an admin or superadmin role    
        if (admin.role !== 1) {
            return res.status(403).json({
                message: "Unauthorized: Only superadmins can access this route",
                success: false
            });
        }   

        // Check if the admin account is active
        if (admin.status !== 1) {
            return res.status(403).json({
                message: "Unauthorized: Your account is inactive. Please contact support.",
                success: false
            });
        }   

        // Proceed to the next middleware/controller    
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Authorization failed",
            error: error.message,
        });
    }
};

export { authorizeAdmin, authorizeSuperAdmin };
