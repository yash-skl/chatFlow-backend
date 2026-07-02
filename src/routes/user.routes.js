import { Router } from "express";
import { loginUser, getUsers } from "../controllers/user.controllers.js";

const router = Router();

router.post("/login", loginUser);
router.get("/users", getUsers);

export default router;