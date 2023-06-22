import { Router } from "express";
const userRouter = Router();

/** import all controllers */
import * as controller from '../controllers/userController.js';



/** POST Methods */

userRouter.route('/register').post(controller.register); // register user
userRouter.route('/login').post(controller.login); // login in app



export default userRouter;
