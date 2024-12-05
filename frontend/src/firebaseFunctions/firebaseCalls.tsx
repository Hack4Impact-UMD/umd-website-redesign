import { collection, getDocs, addDoc, DocumentData } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firestore collection references
const membersCollection = collection(db, 'members');
const projectsCollection = collection(db, 'projects');
const sponsorsCollection = collection(db, 'sponsors');


/** 
 * Add a document to a given Firestore collection.
 * @param collectionRef Firestore collection reference
 * @param data The data to add
 */
const addDocument = async (collectionRef: any, data: any) => {
  try {
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document: ${error}`);
    throw error;
  }
};

/**
 * Uploads an image to Firebase Storage in a specified folder.
 * @param file The image file to upload.
 * @param folder The folder name to store the image (e.g., 'avatars', 'projects', 'sponsors').
 * @returns The download URL of the uploaded image.
 */
export const uploadImage = async (file: File, folder: string): Promise<string> => {
  const storageRef = ref(storage, `${folder}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Functions to get all members, projects, and sponsors
// export const getAllMembers = async () => getAllDocuments(membersCollection);
// export const getAllProjects = async () => getAllDocuments(projectsCollection);
// export const getAllSponsors = async () => getAllDocuments(sponsorsCollection);

// Functions to add members, projects, and sponsors
export const addMember = async (memberData: any) => addDocument(membersCollection, memberData);
export const addProject = async (projectData: any) => addDocument(projectsCollection, projectData);
export const addSponsor = async (sponsorData: any) => addDocument(sponsorsCollection, sponsorData);

export function getMembersData(): Promise<{ member: any; id: string }[]> {
  const collectionRef = collection(db, "Members");
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: { member: any; id: string }[] = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newMember = { member: document, id: doc.id };
          allDocuments.push(newMember);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}