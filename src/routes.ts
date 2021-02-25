import {Router} from "express"
import { UserController } from "./controllers/UserController"
import { ServeyController } from "./controllers/SurveyController"
import { SendMailController } from "./controllers/SendMailController"

const router = Router();

const userController = new UserController();
const serveyController = new ServeyController();
const sendMailController = new SendMailController();

router.post("/users", userController.create);

router.post("/serveys", serveyController.create);
router.get("/serveys", serveyController.show);

router.post("/sendMail", sendMailController.execute);

export {router}