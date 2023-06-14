import { Router } from "express";
import {executeScheduledTweets, sendTweet} from "../controllers/tweet.js"

const router = Router();


router.route("/send").post(sendTweet)
router.route("/schedule").get(executeScheduledTweets)


export default router;