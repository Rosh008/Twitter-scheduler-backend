import admin from 'firebase-admin';
import {getFirestore} from 'firebase-admin/firestore'
import serviceAccount from  './twitterscheduler-135d3-firebase-adminsdk-7j8bc-3feab06d34.json' assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const db = getFirestore();
