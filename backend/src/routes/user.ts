import { Router } from "express";
import { login, me, register } from "../controllers/user";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.use(authenticate);
router.get("/me", me);

export default router;
