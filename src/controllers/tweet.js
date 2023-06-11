import asyncHandler from "../middlewares/asyncHandler.js";
import oauth from "../setupOAuth.js";
import got from "got";
import { db } from "../setupFirebase.js";




const sendTweetURL = `https://api.twitter.com/2/tweets`;



const sendTweet = asyncHandler(async (req, res) => {

    const {tok, toksec, data} = req.body;
    const token = {
        key: tok,
        secret: toksec
    };

    const authHeader = await oauth.toHeader(oauth.authorize({
        url: sendTweetURL,
        method: 'POST'
    }, token));

    const response = await got.post(sendTweetURL, {
        json: {text: data},
        responseType: 'json',
        headers: {
          Authorization: authHeader["Authorization"],
          'user-agent': "v2CreateTweetJS",
          'content-type': "application/json",
          'accept': "application/json"
        }   
    }).catch(err => {
        throw new Error(err.response.body);
    })


    if(response.body)
        return response;
})

const executeScheduledTweets =  async () => { 
    try {
        console.log('execution started');
        // Get current time
        const currentTime = new Date();
    
        // Retrieve scheduled tweets from Firestore where the scheduled time is before or equal to the current time
        const querySnapshot = await db.collection('tweets').where('time', '<=', currentTime).where('status', '==', 'pending').get();
        
        // Iterate over the retrieved tweets
        querySnapshot.forEach(async (doc) => {
          const tweet = doc.data();
        
          const userData = await db.collection('users').doc(tweet.uid).get()

          if(!userData.exists){
            console.error(`Can't fetch user data`);
          }

          const data = userData.data()
          const request = {
            body:{
                tok: data.oauthToken,
                toksec: data.tokenSec,
                data: tweet.tweet
            }
          }
          try {
            // Post the tweet
            const response = await sendTweet(request)
    
            // Check if the tweet was successfully posted
            if (response && response.body) {
              // Update the tweet's status field in Firestore to reflect that it has been posted
              await db.collection('tweets').doc(doc.id).update({
                status: 'posted'
              });
            }
          } catch (error) {
            throw new Error('error posting tweet', error);
        }
        });
    } catch (error) {
        console.error('Error retrieving scheduled tweets:', error);
    }
}

export {sendTweet, executeScheduledTweets}

