import express from "express";
import rateLimit from "express-rate-limit";
import tweet from "./routes/tweet.js";
import { executeScheduledTweets } from "./controllers/tweet.js";

const app = express();

app.use(express.json());

const apiLimiter =  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", apiLimiter);

app.use("/api/v1/tweet", tweet);

// script executed every 7 minutes.
setInterval(executeScheduledTweets, 420000);
export default app ;
