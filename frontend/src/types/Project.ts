interface ProjectSemester {
  season: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  year: number;
  members: { id: number; role: string }[];
  summary: string;
  blurb: string;
}

interface Project {
  title: string;
  isFeatured: boolean;
  isCurrent: boolean;
  repoURL?: string;
  siteURL?: string;
  image: { name: string; ref: string; downloadURL: string };
  projectSemesters: ProjectSemester[];
}

export default Project;
