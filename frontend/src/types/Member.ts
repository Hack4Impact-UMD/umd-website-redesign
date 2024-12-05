// Add projet and sem for roles
enum Roles {
  'Product Manager',
  'Tech Lead',
  'Designer',
  'Engineer',
  'Bootcamp',
  'Sourcing',
  'Executive Director',
  'Director of Product',
  'Director of Engineering',
  'Director of Design',
  'Director of Education',
  'Director of Finance',
  'Director of Events',
  'Director of Recruitment',
  'Director of Sourcing',
  'Senior Advisor',
}

interface Member {
  firstName: string;
  lastName: string;
  pronouns: string;
  image: { name: string; ref: string; downloadURL: string };
  alumni: boolean;
  roles: { role: Roles; projectTeamID?: string; projectTeamName?: string; isDisplayRole: boolean }[];
}

export { Roles };
export type { Member };
