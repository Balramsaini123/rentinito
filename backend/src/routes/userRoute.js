import express from "express";
import { Register, userGet, usersGet, userUpdate, userDelete, Login, Logout } from "../controllers/userController.js";
import { auth } from "../middlewares/authentication.js";
import { authorizeSuperAdmin } from "../middlewares/authorization.js";
const router = express.Router();

router.route("/register").post(Register);
router.route('/login').post(Login);
router.route('/logout').get(auth, Logout);
router.route('/:id').get(auth, userGet);
router.route('/').get(auth, usersGet);
router.route('/:userId').put(auth, userUpdate);
router.route('/:userId').delete(auth, userDelete);



export default router;