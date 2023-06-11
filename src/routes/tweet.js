import { Router } from "express";
import {sendTweet} from "../controllers/tweet.js"

const router = Router();


router.route("/send").post(sendTweet)


export default router;