import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db, storage } from '../config/firebase';

import { deleteObject, getDownloadURL, ref, uploadBytes } from '@firebase/storage';
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

export function deleteSponsor(fileRef: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    deleteDoc(doc(db, 'Sponsors', id))
      .then(async () => {
        if (fileRef) {
          const pathReference = ref(storage, fileRef);
          await deleteObject(pathReference).catch();
        }
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export async function updateSponsor(sponsor: Sponsor, id: string, imageContent: any): Promise<void> {
  try {
    if (imageContent && imageContent.byteLength != 0) {
      // Delete the old image
      const pathReference = ref(storage, sponsor.image.ref);
      await deleteObject(pathReference);

      // Upload the new one
      const fileExtension = sponsor.image.name.split('.').pop();

      // Upload file to firebase storage
      const randomName = crypto.randomUUID();
      const storageRef = ref(storage, randomName + '.' + fileExtension);
      const buffer = await imageContent.arrayBuffer();
      await uploadBytes(storageRef, new Uint8Array(buffer));
      const downloadURL = await getDownloadURL(storageRef);
      sponsor.image = {
        name: sponsor.image.name,
        ref: randomName + '.' + fileExtension,
        downloadURL: downloadURL,
      };
    }
    const collectionRef = doc(db, 'Sponsors', id);
    await updateDoc(collectionRef, { ...sponsor });
  } catch (_) {
    return Promise.reject();
  }
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

export function getMembersFromProject(projectId: string): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    if (!projectId) {
      reject(new Error('Project ID is required'));
      return;
    }

    const req = query(
      collection(db, 'Members'),
      where('roles', 'array-contains', {
        projectTeamID: projectId,
      })
    );

    const members: Member[] = [];
    getDocs(req)
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          members.push(doc.data() as Member);
        });
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

export function getSponsors(): Promise<{ sponsor: Sponsor; id: string }[]> {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, 'Sponsors'))
      .then((querySnapshot) => {
        const sponsors: { sponsor: Sponsor; id: string }[] = [];
        querySnapshot.docs.map((doc) => {
          sponsors.push({ sponsor: doc.data() as Sponsor, id: doc.id });
        });
        resolve(sponsors);
      })
      .catch((e) => reject(e));
  });
}

export async function importStrapiData(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Delete all projects
    console.log('Deleting Projects');
    await getDocs(collection(db, 'Projects'))
      .then(async (querySnapshot) => {
        const projects: { project: Project; id: string }[] = [];
        querySnapshot.docs.map((doc) => {
          projects.push({ project: doc.data() as Project, id: doc.id });
        });
        const deleteProjectPromises: Promise<any>[] = [];
        projects.forEach((project) => {
          deleteProjectPromises.push(deleteObject(ref(storage, project.project.image.ref)));
          deleteProjectPromises.push(deleteDoc(doc(db, 'Projects', project.id)));
        });
        await Promise.all(deleteProjectPromises);
      })
      .catch((e) => reject(e));
    console.log('Adding Projects');

    await fetch('https://chapter-website-backend.herokuapp.com/api/projects?populate=*&pagination[limit]=100')
      .then((res) => res.json())
      .then(async (data) => {
        const projects = [];
        for (const project of data.data) {
          const fileName = project.attributes.image.data[0].attributes.name;
          const response = await fetch(project.attributes.image.data[0].attributes.url);
          const resJson = await (await response.blob()).arrayBuffer();
          const fileExtension = fileName.split('.')[1];
          const randomName = crypto.randomUUID();

          const storageRef = ref(storage, randomName + '.' + fileExtension);
          const bytes = await uploadBytes(storageRef, new Uint8Array(resJson));
          const downloadURL = await getDownloadURL(storageRef);
          const projectData = {
            title: project.attributes.title,
            isCurrentProject: project.attributes.isCurrent || false,
            isFeatured: project.attributes.isFeatured || false,
            siteURL: project.attributes.hostedProjectURL || '',
            repoURL: project.attributes.repoURL || '',
            projectSemesters: [],
            image: {
              name: fileName,
              ref: randomName + '.' + fileExtension,
              downloadURL: downloadURL,
            },
          };
          await addDoc(collection(db, 'Projects'), projectData);
        }
      })
      .catch((e) => {
        console.log(e);
      });

    // Studnets
    console.log('Deleting  Members');
    await getDocs(collection(db, 'Members'))
      .then(async (querySnapshot) => {
        const students: { student: Member; id: string }[] = [];
        querySnapshot.docs.map((doc) => {
          students.push({ student: doc.data() as Member, id: doc.id });
        });
        const deleteStudentPromises: Promise<any>[] = [];
        students.forEach((student) => {
          deleteStudentPromises.push(deleteObject(ref(storage, student.student.image.ref)));
          deleteStudentPromises.push(deleteDoc(doc(db, 'Members', student.id)));
        });
        await Promise.all(deleteStudentPromises);
      })
      .catch((e) => reject(e));

    console.log('Adding first page of members');
    await fetch(
      'https://chapter-website-backend.herokuapp.com/api/members?pagination[page]=1&pagination[pageSize]=100&populate=avatar,componentRolesArr'
    )
      .then((res) => res.json())
      .then(async (data) => {
        const members = [];
        for (const member of data.data) {
          const memberData = {
            firstName: member.attributes.firstName,
            lastName: member.attributes.lastName,
            pronouns: member.attributes.pronouns,
            image: {
              name: '',
              ref: '',
              downloadURL: '',
            },
            alumni: member.attributes.memberDisplayStatus.includes('Former'),
            roles: [],
          };
          if (member.attributes.avatar.data) {
            const fileName = member.attributes.avatar.data.attributes.name;
            const response = await fetch(member.attributes.avatar.data.attributes.url);
            const resJson = await (await response.blob()).arrayBuffer();
            const fileExtension = fileName.split('.')[1];
            const randomName = crypto.randomUUID();

            const storageRef = ref(storage, randomName + '.' + fileExtension);
            const bytes = await uploadBytes(storageRef, new Uint8Array(resJson));
            const downloadURL = await getDownloadURL(storageRef);
            memberData.image = {
              name: fileName,
              ref: randomName + '.' + fileExtension,
              downloadURL: downloadURL,
            };
          }

          await addDoc(collection(db, 'Members'), memberData);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    // Fetch page 2 (page size of 100)
    console.log('Adding second page of members');
    await fetch(
      'https://chapter-website-backend.herokuapp.com/api/members?pagination[page]=2&pagination[pageSize]=100&populate=avatar,componentRolesArr'
    )
      .then((res) => res.json())
      .then(async (data) => {
        const members = [];
        for (const member of data.data) {
          const memberData = {
            firstName: member.attributes.firstName,
            lastName: member.attributes.lastName,
            pronouns: member.attributes.pronouns,
            image: {
              name: '',
              ref: '',
              downloadURL: '',
            },
            alumni: member.attributes.memberDisplayStatus.includes('Former'),
            roles: [],
          };
          if (member.attributes.avatar.data) {
            const fileName = member.attributes.avatar.data.attributes.name;
            const response = await fetch(member.attributes.avatar.data.attributes.url);
            const resJson = await (await response.blob()).arrayBuffer();
            const fileExtension = fileName.split('.')[1];
            const randomName = crypto.randomUUID();

            const storageRef = ref(storage, randomName + '.' + fileExtension);
            const bytes = await uploadBytes(storageRef, new Uint8Array(resJson));
            const downloadURL = await getDownloadURL(storageRef);
            memberData.image = {
              name: fileName,
              ref: randomName + '.' + fileExtension,
              downloadURL: downloadURL,
            };
          }

          await addDoc(collection(db, 'Members'), memberData);
        }
      })
      .catch((e) => {
        console.log(e);
      });

    // Fetch page 3 (page size of 100)
    console.log('Adding third page of members');
    await fetch(
      'https://chapter-website-backend.herokuapp.com/api/members?pagination[page]=3&pagination[pageSize]=100&populate=avatar,componentRolesArr'
    )
      .then((res) => res.json())
      .then(async (data) => {
        const members = [];
        for (const member of data.data) {
          const memberData = {
            firstName: member.attributes.firstName,
            lastName: member.attributes.lastName,
            pronouns: member.attributes.pronouns,
            image: {
              name: '',
              ref: '',
              downloadURL: '',
            },
            alumni: member.attributes.memberDisplayStatus.includes('Former'),
            roles: [],
          };
          if (member.attributes.avatar.data) {
            const fileName = member.attributes.avatar.data.attributes.name;
            const response = await fetch(member.attributes.avatar.data.attributes.url);
            const resJson = await (await response.blob()).arrayBuffer();
            const fileExtension = fileName.split('.')[1];
            const randomName = crypto.randomUUID();

            const storageRef = ref(storage, randomName + '.' + fileExtension);
            const bytes = await uploadBytes(storageRef, new Uint8Array(resJson));
            const downloadURL = await getDownloadURL(storageRef);
            memberData.image = {
              name: fileName,
              ref: randomName + '.' + fileExtension,
              downloadURL: downloadURL,
            };
          }

          await addDoc(collection(db, 'Members'), memberData);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    resolve();
    // Add back all projects

    // Delete all students
    // Delete all student images
  });
}
