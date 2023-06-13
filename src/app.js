import express from "express";
import rateLimit from "express-rate-limit";
import tweet from "./routes/tweet.js";
import cron from "node-cron";
import { executeScheduledTweets } from "./controllers/tweet.js";

const app = express();

app.use(express.json());

const apiLimiter =  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 100, // limit each IP to 100 requests per windowMs
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/', (req, res) => res.send('Server up and running'));

app.use("/api/", apiLimiter);

app.use("/api/v1/tweet", tweet);

// // script executed every 7 minutes.
cron.schedule('*/7 * * * *', () => {
    console.log("job scheduled cron")
    executeScheduledTweets()
})
// setInterval(executeScheduledTweets, 420000);
export default app ;
