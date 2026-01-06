# Firebase Migration Plan

## Executive Summary

This document outlines a comprehensive plan to migrate the UMD Website backend from the current Strapi CMS + PostgreSQL architecture to Firebase. The migration will replace Strapi with Firebase services while maintaining the existing React frontend with minimal disruption.

---

## Table of Contents

1. [Current Architecture Overview](#1-current-architecture-overview)
2. [Target Firebase Architecture](#2-target-firebase-architecture)
3. [Firebase Services Mapping](#3-firebase-services-mapping)
4. [Data Model Migration](#4-data-model-migration)
5. [Authentication Migration](#5-authentication-migration)
6. [Frontend Migration](#6-frontend-migration)
7. [Media Storage Migration](#7-media-storage-migration)
8. [Security Rules](#8-security-rules)
9. [Migration Phases](#9-migration-phases)
10. [Rollback Strategy](#10-rollback-strategy)
11. [Testing Strategy](#11-testing-strategy)
12. [Post-Migration Checklist](#12-post-migration-checklist)

---

## 1. Current Architecture Overview

### Technology Stack
| Layer | Current Technology |
|-------|-------------------|
| Frontend | React 17.0.2 + TypeScript 5.8.3 |
| Backend | Strapi 4.25.23 (Headless CMS) |
| Database | PostgreSQL (production) / SQLite (development) |
| Authentication | Strapi Users-Permissions (JWT-based) |
| Media Storage | Cloudinary |
| Email Service | EmailJS |
| Frontend Hosting | Cloudflare + Surge |
| Backend Hosting | Heroku |

### Current Data Models
1. **Member** - Organization members with roles and project associations
2. **Project** - Portfolio projects with details and member assignments
3. **Roles Component** - Repeatable component for member positions
4. **User** - Strapi built-in authentication users

### Key Backend Files
- `/backend/config/database.js` - Database configuration
- `/backend/src/api/member/content-types/member/schema.json` - Member schema
- `/backend/src/api/project/content-types/project/schema.json` - Project schema
- `/backend/src/components/roles/roles-test.json` - Roles component schema

---

## 2. Target Firebase Architecture

### Firebase Services to Implement
| Service | Purpose | Replaces |
|---------|---------|----------|
| **Cloud Firestore** | NoSQL document database | PostgreSQL/SQLite |
| **Firebase Authentication** | User authentication | Strapi Users-Permissions |
| **Cloud Storage for Firebase** | File/media storage | Cloudinary |
| **Firebase Hosting** | Static site hosting | Cloudflare/Surge |
| **Cloud Functions** (optional) | Server-side logic | Strapi controllers |
| **Firebase Admin SDK** | Admin operations | Strapi admin panel |

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     FIREBASE CONSOLE                        │
│  (Admin Panel - replaces Strapi Admin)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE SERVICES                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Firestore  │  │   Storage   │  │   Authentication    │ │
│  │  (Database) │  │   (Media)   │  │   (Users)           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           Cloud Functions (Optional)                    ││
│  │     - Data validation  - Webhooks  - Admin tasks       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                REACT FRONTEND APPLICATION                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  Firebase SDK (v9+)                     ││
│  │  - firebase/firestore  - firebase/storage              ││
│  │  - firebase/auth       - firebase/app                  ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │            React Components (existing)                  ││
│  │  - AboutUs  - Projects  - OurWork  - ContactPage       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   FIREBASE HOSTING                          │
│           (Static site hosting - replaces Surge)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Firebase Services Mapping

### 3.1 Strapi → Firebase Feature Mapping

| Strapi Feature | Firebase Equivalent | Notes |
|----------------|---------------------|-------|
| Content Types | Firestore Collections | Schema enforced via TypeScript interfaces |
| REST API | Firebase SDK | Direct client-side queries |
| GraphQL (optional) | Firestore queries | Native query capabilities |
| Users-Permissions | Firebase Auth | Email/password, OAuth providers |
| Media Library | Cloud Storage | Direct upload with security rules |
| Admin Panel | Firebase Console + Custom Admin | Or use third-party like FireCMS |
| Webhooks | Cloud Functions | Triggered by Firestore events |
| Roles & Permissions | Security Rules + Custom Claims | Firestore rules + Auth custom claims |
| i18n Plugin | Custom implementation | Store translations in Firestore |

### 3.2 API Endpoint Mapping

| Current Strapi Endpoint | Firebase Implementation |
|------------------------|------------------------|
| `GET /api/members` | `getDocs(collection(db, 'members'))` |
| `GET /api/members/:id` | `getDoc(doc(db, 'members', id))` |
| `GET /api/members?filters[...]` | `query(collection(db, 'members'), where(...))` |
| `POST /api/members` | `addDoc(collection(db, 'members'), data)` |
| `PUT /api/members/:id` | `updateDoc(doc(db, 'members', id), data)` |
| `DELETE /api/members/:id` | `deleteDoc(doc(db, 'members', id))` |
| `GET /api/projects` | `getDocs(collection(db, 'projects'))` |
| `GET /api/projects?populate=*` | Manual join or denormalized data |

---

## 4. Data Model Migration

### 4.1 Firestore Collection Structure

#### Collection: `members`
```typescript
interface Member {
  id: string;                          // Auto-generated document ID
  firstName: string;                   // Required
  lastName: string;                    // Required
  pronouns: string;                    // Required
  memberDisplayStatus: 'Current Member' | 'Current Board Member' | 'Former Member/Board Member';
  avatarUrl?: string;                  // Cloud Storage URL (optional)
  avatarPath?: string;                 // Cloud Storage path for deletion
  roles: Role[];                       // Embedded array (denormalized)
  projectIds: string[];                // References to project documents
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Role {
  title: RoleTitle;
  isDisplayRole: boolean;
  startDate?: Timestamp;
  endDate?: Timestamp;
  team?: string;
}

type RoleTitle =
  | 'Executive Director'
  | 'Director of Product'
  | 'Director of Engineering'
  | 'Director of Design'
  | 'Director of Education'
  | 'Director of Finance and Sponsorship'
  | 'Director of Events'
  | 'Director of Recruitment'
  | 'Director of Public Relations/Outreach'
  | 'Senior Advisor'
  | 'Designer'
  | 'Product Manager'
  | 'Tech Lead'
  | 'Engineer'
  | 'Bootcamp';
```

#### Collection: `projects`
```typescript
interface Project {
  id: string;                          // Auto-generated document ID
  title: string;                       // Required
  startDate?: Timestamp;
  summary: string;                     // Required
  blurb: string;                       // Rich text (HTML) - Required
  imageUrls: string[];                 // Cloud Storage URLs
  imagePaths: string[];                // Cloud Storage paths for deletion
  imageAltText?: string;
  memberIds: string[];                 // References to member documents
  isFeatured: boolean;                 // Required
  isCurrentProject: boolean;           // Required
  path: string;                        // URL slug - Required, Unique
  repoUrl?: string;
  hostedProjectUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Collection: `users` (Admin Users)
```typescript
interface AdminUser {
  uid: string;                         // Firebase Auth UID
  email: string;
  displayName?: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

### 4.2 Data Relationship Strategy

**Current (Strapi):** Many-to-Many relationship between Members and Projects using join tables.

**Firebase Strategy:** Use **bidirectional references** with denormalization for common queries.

```
members/{memberId}
  - projectIds: ['proj1', 'proj2']     // Array of project IDs

projects/{projectId}
  - memberIds: ['mem1', 'mem2']        // Array of member IDs
```

**Benefits:**
- Fast reads without joins
- Works well with Firestore's query limitations
- Suitable for the scale of this application (< 1000 documents)

**Trade-offs:**
- Requires updating both documents when relationships change
- Use Cloud Functions or transactions to maintain consistency

### 4.3 Index Configuration

Create indexes in `firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "members",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "memberDisplayStatus", "order": "ASCENDING" },
        { "fieldPath": "lastName", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isFeatured", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isCurrentProject", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 4.4 Data Migration Script

Create a migration script to transfer data from PostgreSQL to Firestore:

**File: `/scripts/migrate-to-firebase.ts`**

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { Pool } from 'pg';

// Initialize Firebase Admin
initializeApp({
  credential: cert('./serviceAccountKey.json')
});

const db = getFirestore();

// Connect to PostgreSQL
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateMembers() {
  const client = await pgPool.connect();

  try {
    // Query existing members from Strapi's PostgreSQL
    const { rows: members } = await client.query(`
      SELECT
        m.id,
        m.first_name,
        m.last_name,
        m.pronouns,
        m.member_display_status,
        m.created_at,
        m.updated_at
      FROM members m
    `);

    // Query roles for each member
    const { rows: roles } = await client.query(`
      SELECT * FROM components_roles_roles_tests
    `);

    // Query member-project relationships
    const { rows: memberProjects } = await client.query(`
      SELECT * FROM members_projects_links
    `);

    // Batch write to Firestore
    const batch = db.batch();

    for (const member of members) {
      const memberRef = db.collection('members').doc(member.id.toString());

      const memberRoles = roles
        .filter(r => r.entity_id === member.id)
        .map(r => ({
          title: r.title,
          isDisplayRole: r.is_display_role || false,
          startDate: r.start_date ? Timestamp.fromDate(new Date(r.start_date)) : null,
          endDate: r.end_date ? Timestamp.fromDate(new Date(r.end_date)) : null,
          team: r.team || null
        }));

      const projectIds = memberProjects
        .filter(mp => mp.member_id === member.id)
        .map(mp => mp.project_id.toString());

      batch.set(memberRef, {
        firstName: member.first_name,
        lastName: member.last_name,
        pronouns: member.pronouns,
        memberDisplayStatus: member.member_display_status,
        roles: memberRoles,
        projectIds: projectIds,
        avatarUrl: null, // Will need to migrate media separately
        createdAt: Timestamp.fromDate(new Date(member.created_at)),
        updatedAt: Timestamp.fromDate(new Date(member.updated_at))
      });
    }

    await batch.commit();
    console.log(`Migrated ${members.length} members`);
  } finally {
    client.release();
  }
}

async function migrateProjects() {
  const client = await pgPool.connect();

  try {
    const { rows: projects } = await client.query(`
      SELECT * FROM projects
    `);

    const { rows: projectMembers } = await client.query(`
      SELECT * FROM projects_members_links
    `);

    const batch = db.batch();

    for (const project of projects) {
      const projectRef = db.collection('projects').doc(project.id.toString());

      const memberIds = projectMembers
        .filter(pm => pm.project_id === project.id)
        .map(pm => pm.member_id.toString());

      batch.set(projectRef, {
        title: project.title,
        startDate: project.start_date ? Timestamp.fromDate(new Date(project.start_date)) : null,
        summary: project.summary,
        blurb: project.blurb,
        imageUrls: [], // Will need to migrate media separately
        imagePaths: [],
        imageAltText: project.image_alt_text || null,
        memberIds: memberIds,
        isFeatured: project.is_featured || false,
        isCurrentProject: project.is_current_project || false,
        path: project.path,
        repoUrl: project.repo_url || null,
        hostedProjectUrl: project.hosted_project_url || null,
        createdAt: Timestamp.fromDate(new Date(project.created_at)),
        updatedAt: Timestamp.fromDate(new Date(project.updated_at))
      });
    }

    await batch.commit();
    console.log(`Migrated ${projects.length} projects`);
  } finally {
    client.release();
  }
}

async function main() {
  console.log('Starting migration...');
  await migrateMembers();
  await migrateProjects();
  console.log('Migration complete!');
  process.exit(0);
}

main().catch(console.error);
```

---

## 5. Authentication Migration

### 5.1 Current Authentication Flow
- Strapi Users-Permissions plugin
- JWT-based authentication
- Only used for admin/CMS access (public site doesn't require auth)

### 5.2 Firebase Authentication Setup

**Recommended Auth Methods:**
1. **Email/Password** - For admin users
2. **Google OAuth** (optional) - For easier admin access

**Implementation:**

```typescript
// src/firebase/auth.ts
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { app } from './config';

const auth = getAuth(app);

export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
```

### 5.3 Custom Claims for Admin Roles

Use Firebase Admin SDK (in Cloud Functions) to set custom claims:

```typescript
// functions/src/setAdminRole.ts
import * as admin from 'firebase-admin';

export const setAdminRole = async (uid: string, role: 'admin' | 'editor' | 'viewer') => {
  await admin.auth().setCustomUserClaims(uid, { role });
};
```

### 5.4 User Migration

Since the public site doesn't require user authentication, only admin users need to be migrated:

1. Create admin users manually in Firebase Console
2. Or use Firebase Admin SDK to create users programmatically:

```typescript
import { getAuth } from 'firebase-admin/auth';

async function createAdminUser(email: string, password: string, role: string) {
  const auth = getAuth();
  const user = await auth.createUser({
    email,
    password,
    emailVerified: true
  });
  await auth.setCustomUserClaims(user.uid, { role });
  return user;
}
```

---

## 6. Frontend Migration

### 6.1 Dependencies to Add

Update `frontend/package.json`:
```json
{
  "dependencies": {
    "firebase": "^10.x.x"
  }
}
```

**Note:** Using Firebase SDK v10+ (modular SDK) for better tree-shaking and smaller bundle size.

### 6.2 Dependencies to Remove

```json
{
  "dependencies": {
    "axios": "^0.27.2"  // Will be replaced by Firebase SDK
  }
}
```

### 6.3 Firebase Configuration

**File: `frontend/src/firebase/config.ts`**
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
```

**File: `frontend/.env`** (update)
```
# Remove Strapi URLs
# REACT_APP_ROOT_URL="https://chapter-website-backend.herokuapp.com"

# Add Firebase config
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 6.4 Replace HelperFunctions.tsx

**Current:** Uses axios with custom `useAxios` hook

**New: `frontend/src/firebase/hooks.ts`**
```typescript
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  QueryConstraint,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';

interface UseFirestoreResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Hook for fetching a collection with optional filters
export function useCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): UseFirestoreResult<T[]> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        const results: T[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(results);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

// Hook for fetching a single document
export function useDocument<T = DocumentData>(
  collectionName: string,
  documentId: string | null
): UseFirestoreResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, documentId]);

  return { data, loading, error };
}
```

### 6.5 Service Layer

**File: `frontend/src/firebase/services/memberService.ts`**
```typescript
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config';
import { Member } from '../types';

const COLLECTION = 'members';

export const memberService = {
  // Get all members
  async getAll(): Promise<Member[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Member));
  },

  // Get members by status
  async getByStatus(status: string): Promise<Member[]> {
    const q = query(
      collection(db, COLLECTION),
      where('memberDisplayStatus', '==', status)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Member));
  },

  // Get current board members
  async getBoardMembers(): Promise<Member[]> {
    return this.getByStatus('Current Board Member');
  },

  // Get current team members
  async getCurrentMembers(): Promise<Member[]> {
    return this.getByStatus('Current Member');
  },

  // Get single member by ID
  async getById(id: string): Promise<Member | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Member;
    }
    return null;
  },

  // Create member (admin only)
  async create(data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Update member (admin only)
  async update(id: string, data: Partial<Member>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  // Delete member (admin only)
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
};
```

**File: `frontend/src/firebase/services/projectService.ts`**
```typescript
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config';
import { Project } from '../types';

const COLLECTION = 'projects';

export const projectService = {
  // Get all projects
  async getAll(): Promise<Project[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
  },

  // Get featured projects
  async getFeatured(): Promise<Project[]> {
    const q = query(
      collection(db, COLLECTION),
      where('isFeatured', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
  },

  // Get current projects
  async getCurrent(): Promise<Project[]> {
    const q = query(
      collection(db, COLLECTION),
      where('isCurrentProject', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
  },

  // Get project by path (URL slug)
  async getByPath(path: string): Promise<Project | null> {
    const q = query(
      collection(db, COLLECTION),
      where('path', '==', path)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Project;
    }
    return null;
  },

  // Get single project by ID
  async getById(id: string): Promise<Project | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  },

  // Create project (admin only)
  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Update project (admin only)
  async update(id: string, data: Partial<Project>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  },

  // Delete project (admin only)
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
};
```

### 6.6 Component Migration Examples

#### AboutUs.tsx Migration

**Before (Strapi/Axios):**
```typescript
const { data: boardMembers, loading: loadingBoard } = useAxios({
  method: 'GET',
  url: `${process.env.REACT_APP_ROOT_URL}/api/members?populate=avatar,componentRolesArr&filters[memberDisplayStatus][$eq]=Current Board Member`
});
```

**After (Firebase):**
```typescript
import { useState, useEffect } from 'react';
import { memberService } from '../firebase/services/memberService';
import { Member } from '../firebase/types';

const AboutUs: React.FC = () => {
  const [boardMembers, setBoardMembers] = useState<Member[]>([]);
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const [board, team] = await Promise.all([
          memberService.getBoardMembers(),
          memberService.getCurrentMembers()
        ]);
        setBoardMembers(board);
        setTeamMembers(team);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Rest of component...
};
```

#### Projects.tsx Migration

**Before:**
```typescript
const { data: featuredProjects, loading } = useAxios({
  method: 'GET',
  url: `${process.env.REACT_APP_ROOT_URL}/api/projects?populate=*&filters[isFeatured][$eq]=true`
});
```

**After:**
```typescript
import { useState, useEffect } from 'react';
import { projectService } from '../firebase/services/projectService';
import { Project } from '../firebase/types';

const Projects: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await projectService.getFeatured();
        setFeaturedProjects(projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Rest of component...
};
```

### 6.7 TypeScript Types

**File: `frontend/src/firebase/types.ts`**
```typescript
import { Timestamp } from 'firebase/firestore';

export type RoleTitle =
  | 'Executive Director'
  | 'Director of Product'
  | 'Director of Engineering'
  | 'Director of Design'
  | 'Director of Education'
  | 'Director of Finance and Sponsorship'
  | 'Director of Events'
  | 'Director of Recruitment'
  | 'Director of Public Relations/Outreach'
  | 'Senior Advisor'
  | 'Designer'
  | 'Product Manager'
  | 'Tech Lead'
  | 'Engineer'
  | 'Bootcamp';

export type MemberDisplayStatus =
  | 'Current Member'
  | 'Current Board Member'
  | 'Former Member/Board Member';

export interface Role {
  title: RoleTitle;
  isDisplayRole: boolean;
  startDate?: Timestamp;
  endDate?: Timestamp;
  team?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  pronouns: string;
  memberDisplayStatus: MemberDisplayStatus;
  avatarUrl?: string;
  avatarPath?: string;
  roles: Role[];
  projectIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Project {
  id: string;
  title: string;
  startDate?: Timestamp;
  summary: string;
  blurb: string;
  imageUrls: string[];
  imagePaths: string[];
  imageAltText?: string;
  memberIds: string[];
  isFeatured: boolean;
  isCurrentProject: boolean;
  path: string;
  repoUrl?: string;
  hostedProjectUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

---

## 7. Media Storage Migration

### 7.1 Cloud Storage Structure

```
gs://your-project.appspot.com/
├── members/
│   ├── {memberId}/
│   │   └── avatar.{ext}
├── projects/
│   ├── {projectId}/
│   │   ├── image-1.{ext}
│   │   ├── image-2.{ext}
│   │   └── ...
└── temp/
    └── {uploadId}/
        └── {filename}
```

### 7.2 Storage Service

**File: `frontend/src/firebase/services/storageService.ts`**
```typescript
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '../config';

export const storageService = {
  // Upload member avatar
  async uploadMemberAvatar(memberId: string, file: File): Promise<{ url: string; path: string }> {
    const ext = file.name.split('.').pop();
    const path = `members/${memberId}/avatar.${ext}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return { url, path };
  },

  // Upload project image
  async uploadProjectImage(projectId: string, file: File, index: number): Promise<{ url: string; path: string }> {
    const ext = file.name.split('.').pop();
    const path = `projects/${projectId}/image-${index}.${ext}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return { url, path };
  },

  // Delete file by path
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  // Delete all files in a folder
  async deleteFolder(folderPath: string): Promise<void> {
    const folderRef = ref(storage, folderPath);
    const listResult = await listAll(folderRef);

    await Promise.all(
      listResult.items.map(item => deleteObject(item))
    );
  }
};
```

### 7.3 Cloudinary to Firebase Migration Script

```typescript
// scripts/migrate-media.ts
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import axios from 'axios';

const storage = getStorage().bucket();
const db = getFirestore();

async function migrateMedia() {
  // Get all members with avatars
  const membersSnapshot = await db.collection('members').get();

  for (const memberDoc of membersSnapshot.docs) {
    const member = memberDoc.data();

    // Check if there's a Cloudinary URL
    if (member.avatarUrl?.includes('cloudinary')) {
      try {
        // Download from Cloudinary
        const response = await axios.get(member.avatarUrl, {
          responseType: 'arraybuffer'
        });

        // Upload to Firebase Storage
        const path = `members/${memberDoc.id}/avatar.jpg`;
        const file = storage.file(path);
        await file.save(Buffer.from(response.data), {
          contentType: 'image/jpeg'
        });

        // Get new download URL
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500'
        });

        // Update Firestore document
        await memberDoc.ref.update({
          avatarUrl: url,
          avatarPath: path
        });

        console.log(`Migrated avatar for member ${memberDoc.id}`);
      } catch (error) {
        console.error(`Failed to migrate avatar for ${memberDoc.id}:`, error);
      }
    }
  }

  // Similar process for project images...
}
```

---

## 8. Security Rules

### 8.1 Firestore Security Rules

**File: `firestore.rules`**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() &&
             request.auth.token.role == 'admin';
    }

    function isEditor() {
      return isAuthenticated() &&
             (request.auth.token.role == 'admin' ||
              request.auth.token.role == 'editor');
    }

    // Members collection
    match /members/{memberId} {
      // Anyone can read members (public website)
      allow read: if true;

      // Only editors and admins can create/update
      allow create, update: if isEditor();

      // Only admins can delete
      allow delete: if isAdmin();
    }

    // Projects collection
    match /projects/{projectId} {
      // Anyone can read projects (public website)
      allow read: if true;

      // Only editors and admins can create/update
      allow create, update: if isEditor();

      // Only admins can delete
      allow delete: if isAdmin();
    }

    // Admin users collection
    match /users/{userId} {
      // Users can only read their own document
      allow read: if isAuthenticated() && request.auth.uid == userId;

      // Only admins can write to users collection
      allow write: if isAdmin();
    }

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 8.2 Cloud Storage Security Rules

**File: `storage.rules`**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isEditor() {
      return isAuthenticated() &&
             (request.auth.token.role == 'admin' ||
              request.auth.token.role == 'editor');
    }

    function isAdmin() {
      return isAuthenticated() &&
             request.auth.token.role == 'admin';
    }

    function isValidImageType() {
      return request.resource.contentType.matches('image/.*');
    }

    function isUnderSizeLimit() {
      return request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }

    // Member avatars
    match /members/{memberId}/{fileName} {
      // Anyone can read (public images)
      allow read: if true;

      // Editors can upload/update images
      allow write: if isEditor() &&
                      isValidImageType() &&
                      isUnderSizeLimit();

      // Only admins can delete
      allow delete: if isAdmin();
    }

    // Project images
    match /projects/{projectId}/{fileName} {
      // Anyone can read (public images)
      allow read: if true;

      // Editors can upload/update images
      allow write: if isEditor() &&
                      isValidImageType() &&
                      isUnderSizeLimit();

      // Only admins can delete
      allow delete: if isAdmin();
    }

    // Temporary uploads (for staging before association)
    match /temp/{uploadId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isEditor() &&
                      isValidImageType() &&
                      isUnderSizeLimit();
      allow delete: if isEditor();
    }

    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 9. Migration Phases

### Phase 1: Project Setup & Infrastructure
**Duration: Foundation Phase**

1. **Create Firebase Project**
   - Go to Firebase Console (https://console.firebase.google.com)
   - Create new project: `umd-website-redesign`
   - Enable Analytics (optional)

2. **Enable Firebase Services**
   - [ ] Cloud Firestore (start in test mode, then apply rules)
   - [ ] Firebase Authentication (enable Email/Password)
   - [ ] Cloud Storage for Firebase
   - [ ] Firebase Hosting

3. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

4. **Initialize Firebase in Project**
   ```bash
   cd /home/user/umd-website-redesign
   firebase init
   # Select: Firestore, Hosting, Storage, Functions (optional)
   # Use existing project or create new one
   ```

5. **Create Configuration Files**
   - [ ] `firebase.json`
   - [ ] `.firebaserc`
   - [ ] `firestore.rules`
   - [ ] `firestore.indexes.json`
   - [ ] `storage.rules`

### Phase 2: Frontend Firebase Integration
**Duration: Integration Phase**

1. **Add Firebase SDK to Frontend**
   ```bash
   cd frontend
   npm install firebase
   ```

2. **Create Firebase Configuration**
   - [ ] `src/firebase/config.ts`
   - [ ] `src/firebase/types.ts`
   - [ ] Update `.env` with Firebase credentials

3. **Create Service Layer**
   - [ ] `src/firebase/services/memberService.ts`
   - [ ] `src/firebase/services/projectService.ts`
   - [ ] `src/firebase/services/storageService.ts`
   - [ ] `src/firebase/hooks.ts`

4. **Create Parallel API Implementation**
   - Keep existing Strapi code working
   - Add feature flag to switch between backends
   ```typescript
   const USE_FIREBASE = process.env.REACT_APP_USE_FIREBASE === 'true';
   ```

### Phase 3: Data Migration
**Duration: Migration Phase**

1. **Export Data from PostgreSQL**
   ```bash
   # On Heroku
   heroku pg:backups:capture --app chapter-website-backend
   heroku pg:backups:download --app chapter-website-backend
   ```

2. **Create Migration Scripts**
   - [ ] `scripts/migrate-to-firebase.ts`
   - [ ] `scripts/migrate-media.ts`
   - [ ] `scripts/verify-migration.ts`

3. **Run Data Migration**
   ```bash
   # Set environment variables
   export DATABASE_URL="postgres://..."
   export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

   # Run migration
   npx ts-node scripts/migrate-to-firebase.ts
   ```

4. **Migrate Media Files**
   ```bash
   npx ts-node scripts/migrate-media.ts
   ```

5. **Verify Migration**
   - [ ] Compare record counts
   - [ ] Spot check data integrity
   - [ ] Verify media URLs work

### Phase 4: Component Migration
**Duration: Development Phase**

Migrate components in order of complexity:

1. **Simple Read-Only Components**
   - [ ] `Projects.tsx` - Featured projects display
   - [ ] `OurWork.tsx` - Current projects list

2. **Components with Filtering**
   - [ ] `AboutUs.tsx` - Board members and team
   - [ ] `ProjectPage.tsx` - Single project view

3. **Complex Components**
   - [ ] `NonprofitApply.tsx` - Projects carousel
   - [ ] Admin components (if any)

4. **Remove Old Code**
   - [ ] Remove `HelperFunctions.tsx` (useAxios hook)
   - [ ] Remove axios dependency
   - [ ] Remove Strapi URL environment variables

### Phase 5: Security & Authentication
**Duration: Security Phase**

1. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage
   ```

2. **Set Up Admin Authentication**
   - [ ] Create admin users in Firebase Console
   - [ ] Set custom claims via Cloud Functions or Admin SDK

3. **Test Security Rules**
   - [ ] Verify public read access works
   - [ ] Verify write operations require authentication
   - [ ] Test role-based permissions

### Phase 6: Testing & QA
**Duration: Quality Assurance Phase**

1. **Unit Testing**
   - [ ] Test Firebase services
   - [ ] Test React hooks
   - [ ] Test component data fetching

2. **Integration Testing**
   - [ ] Test full data flow
   - [ ] Test image uploads
   - [ ] Test authentication flows

3. **E2E Testing**
   - [ ] Test all pages load correctly
   - [ ] Test filtering and pagination
   - [ ] Test responsive design

4. **Performance Testing**
   - [ ] Measure load times
   - [ ] Check bundle size impact
   - [ ] Verify caching works

### Phase 7: Deployment & Cutover
**Duration: Launch Phase**

1. **Deploy Frontend to Firebase Hosting**
   ```bash
   cd frontend
   npm run build
   firebase deploy --only hosting
   ```

2. **Update DNS (if using custom domain)**
   - Configure Firebase Hosting custom domain
   - Update Cloudflare/DNS settings

3. **Final Data Sync**
   - Run final data migration if needed
   - Verify all data is current

4. **Cutover Steps**
   - [ ] Switch feature flag to Firebase
   - [ ] Monitor for errors
   - [ ] Verify all functionality works

5. **Decommission Strapi**
   - [ ] Keep Heroku running for 2 weeks as backup
   - [ ] Take final PostgreSQL backup
   - [ ] Delete Heroku app after confidence period

---

## 10. Rollback Strategy

### Immediate Rollback (< 1 hour)
If issues are discovered immediately after cutover:

1. **Switch Feature Flag Back**
   ```bash
   # Update .env
   REACT_APP_USE_FIREBASE=false

   # Redeploy
   npm run build && firebase deploy --only hosting
   ```

2. **Verify Strapi Still Works**
   - Heroku app should still be running
   - Data should be intact

### Extended Rollback (1 hour - 2 weeks)
If issues are discovered within the backup period:

1. **Revert DNS Changes**
   - Point domain back to Surge/Cloudflare

2. **Redeploy Frontend**
   - Use previous build without Firebase
   - Or rebuild with Firebase disabled

3. **Sync Any New Data**
   - Export any new data from Firebase
   - Import into PostgreSQL if needed

### Post-Backup Period
After decommissioning Strapi:

1. **Data Recovery**
   - Restore from final PostgreSQL backup
   - Redeploy Strapi to new Heroku instance

2. **Media Recovery**
   - Firebase Storage will still have media
   - Or restore from Cloudinary if still available

---

## 11. Testing Strategy

### 11.1 Unit Tests

**Firebase Service Tests:**
```typescript
// __tests__/firebase/memberService.test.ts
import { memberService } from '../src/firebase/services/memberService';
import { db } from '../src/firebase/config';

// Mock Firestore
jest.mock('../src/firebase/config', () => ({
  db: {}
}));

describe('memberService', () => {
  it('should fetch all members', async () => {
    // Test implementation
  });

  it('should fetch board members', async () => {
    // Test implementation
  });

  it('should fetch member by ID', async () => {
    // Test implementation
  });
});
```

### 11.2 Integration Tests

**Component Integration Tests:**
```typescript
// __tests__/integration/AboutUs.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import AboutUs from '../src/pages/AboutUs';

describe('AboutUs Integration', () => {
  it('should load and display board members', async () => {
    render(<AboutUs />);

    await waitFor(() => {
      expect(screen.getByText('Executive Board')).toBeInTheDocument();
    });
  });
});
```

### 11.3 E2E Test Checklist

| Page | Test Case | Status |
|------|-----------|--------|
| Home | Page loads, projects carousel works | [ ] |
| About Us | Board members display, team section shows | [ ] |
| Our Work | Current projects list loads | [ ] |
| Project Detail | Single project displays with members | [ ] |
| Apply | Forms work, carousel displays | [ ] |
| Contact | EmailJS integration works | [ ] |

### 11.4 Security Rule Tests

```typescript
// __tests__/firestore.rules.test.ts
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Firestore Rules', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'test-project',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8')
      }
    });
  });

  it('allows public read of members', async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertSucceeds(
      unauthed.firestore().collection('members').get()
    );
  });

  it('denies public write to members', async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(
      unauthed.firestore().collection('members').add({ name: 'Test' })
    );
  });
});
```

---

## 12. Post-Migration Checklist

### Immediate (Day 1)
- [ ] All pages load without errors
- [ ] All data displays correctly
- [ ] Images load properly
- [ ] No console errors
- [ ] Performance is acceptable

### Short-term (Week 1)
- [ ] Monitor Firebase usage/costs
- [ ] Check for any edge cases
- [ ] Gather user feedback
- [ ] Fix any reported issues

### Medium-term (Month 1)
- [ ] Review Firebase billing
- [ ] Optimize queries if needed
- [ ] Update documentation
- [ ] Train team on Firebase Console

### Long-term
- [ ] Decommission Heroku/Strapi
- [ ] Remove Cloudinary account
- [ ] Archive old codebase
- [ ] Document lessons learned

---

## Appendix A: File Structure After Migration

```
umd-website-redesign/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── firebase/              # NEW
│   │       ├── config.ts
│   │       ├── types.ts
│   │       ├── hooks.ts
│   │       ├── auth.ts
│   │       └── services/
│   │           ├── memberService.ts
│   │           ├── projectService.ts
│   │           └── storageService.ts
│   ├── .env
│   └── package.json
├── scripts/                        # NEW
│   ├── migrate-to-firebase.ts
│   ├── migrate-media.ts
│   └── verify-migration.ts
├── functions/                      # NEW (optional)
│   ├── src/
│   │   └── index.ts
│   └── package.json
├── firebase.json                   # NEW
├── .firebaserc                     # NEW
├── firestore.rules                 # NEW
├── firestore.indexes.json          # NEW
├── storage.rules                   # NEW
└── docs/
    └── FIREBASE_MIGRATION_PLAN.md  # This file
```

## Appendix B: Environment Variables

### Development
```bash
# frontend/.env.development
REACT_APP_USE_FIREBASE=true
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=umd-website-dev.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=umd-website-dev
REACT_APP_FIREBASE_STORAGE_BUCKET=umd-website-dev.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Production
```bash
# frontend/.env.production
REACT_APP_USE_FIREBASE=true
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=umd-website-prod.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=umd-website-prod
REACT_APP_FIREBASE_STORAGE_BUCKET=umd-website-prod.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=987654321
REACT_APP_FIREBASE_APP_ID=1:987654321:web:xyz789
```

## Appendix C: Cost Estimation

### Firebase Free Tier (Spark Plan)
- Firestore: 1 GiB storage, 50K reads/day, 20K writes/day
- Storage: 5 GB storage, 1 GB/day download
- Hosting: 10 GB/month storage, 360 MB/day bandwidth
- Auth: Unlimited

### Expected Usage (estimate)
- Members: ~100 documents, ~5KB each = ~500KB
- Projects: ~50 documents, ~10KB each = ~500KB
- Images: ~200 images, ~200KB each = ~40MB
- Daily reads: ~1000-5000 (well within limits)

**Recommendation:** Start with Spark (free) plan; upgrade to Blaze only if needed.

---

## Document Information

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Created | 2026-01-06 |
| Author | Generated via Claude |
| Status | Draft - Pending Review |

---

*This plan is a living document and should be updated as the migration progresses.*
