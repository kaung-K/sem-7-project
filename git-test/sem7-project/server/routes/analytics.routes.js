import { Router } from "express";
import auth from "../middleware/AuthMiddleware.js";
import { revenueLast6Months, weeklyEngagement } from "../Private/Analytics.js";

const r = Router();
r.get("/revenue", auth, revenueLast6Months);
r.get("/engagement/week", auth, weeklyEngagement);
export default r;
