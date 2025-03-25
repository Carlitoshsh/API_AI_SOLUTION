import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "../../secrets/serviceAccountKey.json" with { type: "json" }

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

async function addData(collectionName, documentId, data) {
  try {
    await db.collection(collectionName).doc(documentId).set(data);
    console.log("Document written with ID: ", documentId);
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

async function getData(collectionName, documentId) {
  try {
    const doc = await db.collection(collectionName).doc(documentId).get();
    if (doc.exists) {
      console.log("Document data:", doc.data());
      return doc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
}

async function updateData(collectionName, documentId, data) {
  try {
    await db.collection(collectionName).doc(documentId).update(data);
    console.log("Document successfully updated!");
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
}

async function deleteData(collectionName, documentId) {
  try {
    await db.collection(collectionName).doc(documentId).delete();
    console.log("Document successfully deleted!");
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
}

async function getAllData(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, data: doc.data() });
    });
    console.log("All data from collection:", results);
    return results;
  } catch (error) {
    console.error("Error getting all data:", error);
    return null;
  }
}

export default { addData, getData, updateData, deleteData, getAllData };
