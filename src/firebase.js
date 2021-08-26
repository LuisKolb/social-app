import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
//import $ from "jquery";
import router from "./router/index.js";

/* firebase */
const firebaseConfig = {
    apiKey: "AIzaSyAF8qBBgDDrfvKUo6pQeEjyMfbZDJ1k3so",
    authDomain: "social-app-ddf21.firebaseapp.com",
    databaseURL: "https://social-app-ddf21.firebaseio.com",
    projectId: "social-app-ddf21",
    storageBucket: "social-app-ddf21.appspot.com",
    messagingSenderId: "48279407682",
    appId: "1:48279407682:web:f85a3eb683291e66e171db",
    measurementId: "G-MEYTR75SJ1",
};
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
if (location.hostname === "localhost") {
    db.useEmulator("localhost", 8081);
}
export const auth = firebase.auth();
if (location.hostname === "localhost") {
    auth.useEmulator("http://localhost:9099");
}

// authorization
export function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
}

export function signOut() {
    router.push({ path: "/" });
    auth.signOut();
}

//// deprecated
//export function setSignInListeners() {
//    auth.onAuthStateChanged((user) => {
//        if (user) {
//            // signed in
//            $(".whenSignedIn").show();
//            $(".whenSignedOut").hide();
//            if ($(".userName").length > 0) $(".userName").html(`${user.displayName}`);
//            if ($(".userPhoto").length > 0)
//                $(".userPhoto")
//                    .attr("src", user.photoURL)
//                    .show();
//            console.log(user.photoURL);
//        } else {
//            // not signed in
//            user = undefined;
//            $(".whenSignedIn").hide();
//            $(".whenSignedOut").show();
//            if ($(".userName").length > 0) $(".userName").html("");
//            if ($(".userPhoto").length > 0) $(".userPhoto").hide();
//        }
//    });
//}
//
//export function isLoggedIn() {
//    firebase.auth().onAuthStateChanged((user) => {
//        if (user) {
//            this.flag = true;
//        } else {
//            this.flag = false;
//        }
//    });
//}
//
//// users
//export const getUser = async function(uid) {
//    const foundUser = await db
//        .collection("users")
//        .doc(uid)
//        .get();
//    return foundUser.data();
//};

// user preferences
export async function getDarkMode(uid) {
    const ret = await db
        .collection("users")
        .doc(uid)
        .get();
    return ret.data().darkmode;
}

export function updateDarkmode(uid, value) {
    db.collection("users")
        .doc(uid)
        .update({ darkmode: value });
}

//// messages
//export async function sendMessage(text, groupID) {
//    db.collection("messagecoll")
//        .doc(groupID)
//        .collection("messages")
//        .add({
//            text: text,
//            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//            creatorUID: auth.currentUser.uid,
//            photoURL: auth.currentUser.photoURL,
//            displayName: auth.currentUser.displayName,
//        });
//    db.collection("groups")
//        .doc(groupID)
//        .update({
//            recentMessage: {
//                text: text,
//                sentAt: firebase.firestore.FieldValue.serverTimestamp(),
//                sentBy: auth.currentUser.uid,
//            },
//            readBy: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
//        });
//}
//
//export async function readGroup(groupID) {
//    db.collection("groups")
//        .doc(groupID)
//        .update({
//            readBy: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
//        });
//}
//
//export const newPrivateChat = async function(currUser, targetUID) {
//    const user_entry = await db
//        .collection("users")
//        .doc(currUser.uid)
//        .get();
//    const target_entry = await db
//        .collection("users")
//        .doc(targetUID)
//        .get();
//    if (!target_entry.exists) {
//        // check if user exists
//        return "User does not exist in DB! ❌";
//    } else if (currUser.uid == targetUID) {
//        // check if user ids are the same
//        return "Cannot add yourself! 😉";
//    } else if (user_entry.data().friends && user_entry.data().friends.includes(targetUID)) {
//        // check if user is already a friend
//        return "Already friends with this user! 😄";
//    } else {
//        // add the user to friends
//        db.collection("users")
//            .doc(currUser.uid)
//            .update({ friends: firebase.firestore.FieldValue.arrayUnion(targetUID) });
//
//        db.collection("users")
//            .doc(targetUID)
//            .update({ friends: firebase.firestore.FieldValue.arrayUnion(currUser.uid) });
//        // add a new group
//        var groupsRef = db.collection("groups").doc();
//        var autoid = groupsRef.id;
//        groupsRef.set({
//            id: autoid,
//            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//            createdBy: currUser.uid,
//            members: [currUser.uid, targetUID],
//            name: target_entry.data().displayName,
//            photoURL: target_entry.data().photoURL,
//            type: "private",
//            recentMessage: {
//                text: "",
//                readBy: [],
//                sentAt: "",
//                sentBy: "",
//            },
//        });
//        return "Added new user! ✨";
//    }
//};
//
//export const newGroupChat = async function(currUser, memberArr, name) {
//    var groupsRef = db.collection("groups").doc();
//    var autoid = groupsRef.id;
//    groupsRef.set({
//        id: autoid,
//        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//        createdBy: currUser.uid,
//        members: memberArr,
//        name: name,
//        type: "group",
//        recentMessage: {
//            text: "",
//            readBy: [],
//            sentAt: "",
//            sentBy: "",
//        },
//    });
//    return "Created new Group! ✨";
//};
//
//export const joinGlobalChat = async function(currUser) {
//    // add global to friends
//    db.collection("users")
//        .doc(currUser.uid)
//        .update({ friends: firebase.firestore.FieldValue.arrayUnion("global") });
//    db.collection("groups")
//        .doc("global")
//        .update({
//            members: firebase.firestore.FieldValue.arrayUnion(currUser.uid),
//        });
//};
//
//// kanban
//export async function addItem(text) {
//    db.collection("kanban-items").add({
//        text: text,
//        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//        uid: auth.currentUser.uid,
//        state: "To Do",
//        tags: [],
//    });
//}
//
//export async function modifyItemState(id, newState) {
//    db.collection("kanban-items")
//        .doc(id)
//        .update({ state: newState });
//}
//
//export async function addTagToItem(id, newTag) {
//    db.collection("kanban-items")
//        .doc(id)
//        .update({ tags: firebase.firestore.FieldValue.arrayUnion(newTag) });
//}
//
//export async function removeTagFromItem(id, delTag) {
//    db.collection("kanban-items")
//        .doc(id)
//        .update({ tags: firebase.firestore.FieldValue.arrayRemove(delTag) });
//}
//
//export async function removeItem(id) {
//    db.collection("kanban-items")
//        .doc(id)
//        .delete();
//}
//
//export async function removeAllDone() {
//    db.collection("kanban-items")
//        .where("state", "==", "Done")
//        .get()
//        .then(function(querySnapshot) {
//            querySnapshot.forEach(function(doc) {
//                doc.ref.delete();
//            });
//        });
//}
