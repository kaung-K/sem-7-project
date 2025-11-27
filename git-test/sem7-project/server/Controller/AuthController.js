import { Router } from "express";
const router = Router();
import registerUser from "../Auth/Register.js";
import loginUser from "../Auth/Login.js";
import { parse, validate } from "../middleware/UploadMiddleware.js";
import { requestPasswordReset, resetPassword } from "./passwordReset.js"; // adjust path if needed

router.post("/register", validate, registerUser);
router.post("/login", validate, loginUser);
router.post("/forgot", requestPasswordReset);
router.post("/reset", resetPassword);

export default router;