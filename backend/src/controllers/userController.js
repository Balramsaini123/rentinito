import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
const SECRET_KEY = 'Balramsaini@123#$';
import jwt from 'jsonwebtoken';

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Invalid data",
                success: false
            })
        };
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        if (user.status === 1) {
            const token = await jwt.sign({ _id: user._id.toString() }, SECRET_KEY, { expiresIn: "1h" });
            return res.status(200).cookie("token", token).json({
                message: `Welcome back ${user.fullName}`,
                user,
                token,
                success: true
            });
        } else {
            return res.status(401).json({
                message: "Your account is deactivated. Please contact admin.",
                success: false
            });
        }

    } catch (error) {
        console.log(error);
    }
}

const Logout = async (req, res) => {
    return res.status(200).cookie("token", "", { expiresIn: new Date(Date.now()), httpOnly: true }).json({
        message: "User logged out successfully.",
        success: true,
    });
}


const Register = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, address, role } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !phoneNumber || !address) {
            return res.status(401).json({
                message: "Invalid data",
                success: false
            });
        }

        // Check if email already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "This email is already used",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 7);

        // Determine the role: default to user (role 3), or admin (role 2)
        let assignedRole = 3; // Default to user role (3)
        let status = 1; // Default active for users
        let message = "Account created successfully.";

        if (role && role === 2) {
            assignedRole = 2; // Set role to admin (2)
            status = 0; // Admin accounts need approval, so set inactive
            message = "Account created. Please wait for admin approval.";
        }

        // Create the user
        await User.create({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            role: assignedRole,
            status: status
        });

        // Return success message
        return res.status(201).json({
            message: message,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false,
        });
    }
};

async function usersGet(req, res) {
    try {
        const admins = await User.aggregate([
            {
                $lookup: {
                    from: 'properties', // the collection name of properties
                    localField: '_id', // field from the Admin collection
                    foreignField: 'admin_id', // field from the Property collection
                    as: 'properties', // the resulting array field name in the output
                },
            },
            {
                $addFields: {
                    propertyCount: { $size: '$properties' }, // adds the count of properties to each admin
                },
            },
            {
                $project: {
                    properties: 0, // exclude the properties array if you only want the count
                },
            },
        ]);

        if (!admins || admins.length === 0) {
            return res.status(404).send({ message: 'Admins not found' });
        }

        res.status(200).send(admins);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
}

async function userGet(req, res) {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id).populate('Property','')// Automatically populates the jobs based on the virtual

        if (!user) {
            return res.status(404).send({ message: 'Account not found' });
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
}

async function userUpdate(req, res) {
    const id = req.params.userId;

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true } // This returns the updated document
        );

        if (!user) {
            return res.status(404).send({ message: 'Account not found' });
        }

        res.status(200).send({ message: 'Account updated successfully', user });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
}

async function userDelete(req, res) {
    const id = req.params.userId;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).send({ message: 'Account not found' });
        }

        res.status(200).send({ message: 'Account deleted successfully' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
}

export { Register, userGet, usersGet, userUpdate, userDelete, Login, Logout };
