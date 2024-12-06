import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db, storage } from '../config/firebase';

import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { Member } from '../types/Member';
import Project from '../types/Project';
import Sponsor from '../types/Sponsors';

export function addProject(project: any, file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, file.name);
    file
      .arrayBuffer()
      .then((buffer: any) => {
        uploadBytes(storageRef, new Uint8Array(buffer));
      })
      .then(() => getDownloadURL(storageRef))
      .then((downloadURL: string) => {
        project.image = {
          name: file.name,
          ref: file.name,
          downloadURL: downloadURL,
        };
      })
      .then(() => {
        addDoc(collection(db, 'Projects'), project)
          .then((docRef: any) => {
            // return id of document added
            resolve(docRef.id);
          })
          .catch((error: any) => {
            reject(error);
          });
      })
      .then(() => resolve('Done'))
      .catch((e: any) => reject(e));
  });
}

export function addSponsor(tier: any, file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const sponsor: Sponsor = {
      tier: tier,
      image: { name: file.name, ref: file.name, downloadURL: '' },
    };
    const fileExtension = file.name.split('.').pop();
    const randomName = crypto.randomUUID();

    const storageRef = ref(storage, randomName + '.' + fileExtension);

    file
      .arrayBuffer()
      .then(async (buffer: any) => {
        await uploadBytes(storageRef, new Uint8Array(buffer));
        console.log('uploaded');
      })
      .then(async () => {
        return await getDownloadURL(storageRef);
      })
      .then((downloadURL: string) => {
        sponsor.image = {
          name: file.name,
          ref: randomName + '.' + fileExtension,
          downloadURL: downloadURL,
        };
      })
      .then(async () => {
        await addDoc(collection(db, 'Sponsors'), sponsor)
          .then((docRef: any) => {
            // return id of document added
            resolve(docRef.id);
          })
          .catch((error: any) => {
            reject(error);
          });
      })
      .then(() => resolve('Done'))
      .catch((e: any) => reject(e));
  });
}
export function addMember(member: Member, file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const sponsor: Member = {
      ...member,
      image: { name: file.name, ref: file.name, downloadURL: '' },
    };
    const fileExtension = file.name.split('.').pop();
    const randomName = crypto.randomUUID();

    const storageRef = ref(storage, randomName + '.' + fileExtension);

    file
      .arrayBuffer()
      .then(async (buffer: any) => {
        await uploadBytes(storageRef, new Uint8Array(buffer));
        console.log('uploaded');
      })
      .then(async () => {
        return await getDownloadURL(storageRef);
      })
      .then((downloadURL: string) => {
        sponsor.image = {
          name: file.name,
          ref: randomName + '.' + fileExtension,
          downloadURL: downloadURL,
        };
      })
      .then(async () => {
        await addDoc(collection(db, 'Members'), sponsor)
          .then((docRef: any) => {
            // return id of document added
            resolve(docRef.id);
          })
          .catch((error: any) => {
            reject(error);
          });
      })
      .then(() => resolve('Done'))
      .catch((e: any) => reject(e));
  });
}

export function getProjects(featured: boolean): Promise<{ project: Project; id: string }[]> {
  return new Promise((resolve, reject) => {
    let req: any = collection(db, 'Projects');
    if (featured) {
      req = query(collection(db, 'Projects'), where('isFeatured', '==', featured));
    }
    getDocs(req)
      .then((querySnapshot) => {
        const projects: { project: Project; id: string }[] = [];
        querySnapshot.docs.map((doc) => {
          projects.push({ project: doc.data() as Project, id: doc.id });
        });
        resolve(projects);
      })
      .catch((e) => reject(e));
  });
}

export function getMembers(current: boolean): Promise<{ member: Member; id: string }[]> {
  return new Promise((resolve, reject) => {
    let req: any = collection(db, 'Members');
    if (current) {
      req = query(collection(db, 'Members'), where('alumni', '==', false));
    }
    const members: { member: Member; id: string }[] = [];
    getDocs(req)
      .then((querySnapshot) => {
        querySnapshot.docs.map((doc) => members.push({ id: doc.id, member: doc.data() as Member }));
        resolve(members);
      })
      .catch((e) => reject(e));
  });
}

export function updateMember(id: string, newMember: Member): Promise<void> {
  return new Promise((resolve, reject) => {
    updateDoc(doc(db, 'Members', id), { ...newMember })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getSponsors(): Promise<any> {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, 'Sponsors'))
      .then((querySnapshot) => {
        resolve(querySnapshot.docs.map((doc) => doc.data()));
      })
      .catch((e) => reject(e));
  });
}

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
export const addMemberTwo = async (memberData: any) => addDocument(membersCollection, memberData);
export const addProjectTwo = async (projectData: any) => addDocument(projectsCollection, projectData);
export const addSponsorTwo = async (sponsorData: any) => addDocument(sponsorsCollection, sponsorData);

/* Function to get all member data for datagrid */
export function getMembersData(): Promise<{ member: any; id: string }[]> {
  const collectionRef = collection(db, 'Members');
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

/* Function to get all project data for datagrid */
export function getProjectsData(): Promise<{ project: any; id: string }[]> {
  const collectionRef = collection(db, 'Projects');
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot) => {
        const allProjects: { project: any; id: string }[] = [];
        snapshot.docs.forEach((doc) => {
          allProjects.push({ project: doc.data(), id: doc.id });
        });
        resolve(allProjects);
      })
      .catch((error) => reject(error));
  });
}
