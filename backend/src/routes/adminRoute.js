import express from "express";
import { Property_Register, propertyGet, propertiesGet, propertyUpdate, propertyDelete } from "../controllers/propertyController.js";
import upload  from "../middlewares/upload.js"
import { auth } from "../middlewares/authentication.js"
import {authorizeAdmin} from "../middlewares/authorization.js"

const router = express.Router();
//property routes
router.route("/property/register").post(upload, auth, authorizeAdmin, Property_Register);
router.route('/property/:propertyId').get(auth, propertyGet);
router.route('/properties').get(auth, propertiesGet);
router.route('/property/:propertyId').put(auth, authorizeAdmin, propertyUpdate);
router.route('/property/:propertyId').delete(auth, authorizeAdmin, propertyDelete);




export default router;