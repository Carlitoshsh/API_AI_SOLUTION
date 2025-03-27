import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle \n correctly
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

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
