import { Router } from "express";
import { getAllCreators, getRandomCreators, getCreator } from "../Public/CreatorInfo.js";

const router = Router();

router.get('/creator/random', getRandomCreators);
router.get('/creator/all', getAllCreators);
router.get('/creator/:creatorId', getCreator);

export default router;