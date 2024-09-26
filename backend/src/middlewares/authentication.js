import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const SECRET_KEY = 'Balramsaini@123#$'; // Replace with your actual secret key

const auth = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if(token){
            token=token.replace('Bearer ', '');
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};
export { auth };
