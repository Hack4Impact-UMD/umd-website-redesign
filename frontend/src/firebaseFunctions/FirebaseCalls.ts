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
