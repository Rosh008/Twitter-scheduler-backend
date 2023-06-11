import dotenv from "dotenv";
import OAuth from 'oauth-1.0a';
import { createHmac } from 'crypto';

dotenv.config();


const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;


const oauth = OAuth({
    consumer: {
      key: consumer_key,
      secret: consumer_secret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => createHmac('sha1', key).update(baseString).digest('base64')
});

export default oauth ;
