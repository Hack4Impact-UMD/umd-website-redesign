import { useEffect, useState } from 'react';
import { Member } from '../../../types/Member';

const AdminTestingPage = () => {
  const [members, setMembers] = useState<{ member: Member; id: string }[]>([]);
  const [strapiData, setStrapiData] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);
  console.log(strapiData);
  const [num, setNum] = useState(0);

  useEffect(() => {}, []);

  return (
    <>
      <button> Hi</button>
    </>
  );
};
export default AdminTestingPage;
