import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

exports.createUser = functions.auth.user().onCreate((user) => {
    const { uid, photoURL, displayName } = user;

    const userCollection = admin.firestore().collection('users');
    userCollection.doc(uid).set({
        darkmode: false,
        photoURL: photoURL,
        displayName: displayName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        friends: [],
        uid: uid,
    }).catch(() => 'obligatory catch');
});
