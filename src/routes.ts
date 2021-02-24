import {Router} from "express"
import { UserController } from "./controllers/UserController"
import { ServeyController } from "./controllers/SurveyController"

const router = Router();

const userController = new UserController();
const serveyController = new ServeyController();

router.post("/users", userController.create);

router.post("/serveys", serveyController.create);
router.get("/serveys", serveyController.show);


export {router}