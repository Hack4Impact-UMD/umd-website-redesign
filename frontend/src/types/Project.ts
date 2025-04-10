import { Roles } from './Member';
interface Project {
  title: string;
  isFeatured: boolean;
  isCurrent: boolean;
  repoURL?: string;
  siteURL?: string;
  image: { name: string; ref: string; downloadURL: string };
  projectSemesters: ProjectSemester[];
}

interface ProjectSemester {
  season: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  year: number;
  members: { id: string; role: Roles }[];
  summary: string;
  blurb: string;
}

export default Project;
