import { useEffect, useState } from 'react';
import { updateMember } from '../../../firebaseFunctions/FirebaseCalls';
import { Member, Roles } from '../../../types/Member';

const AdminTestingPage = () => {
  const [members, setMembers] = useState<{ member: Member; id: string }[]>([]);
  const [strapiData, setStrapiData] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);
  console.log(members);
  const [num, setNum] = useState(0);

  useEffect(() => {
    // getMembers(true).then(async (res) => {
    //   setMembers(res);
    // });
    // const api_token =
    //   '98eb070e14018259a9cf063fc87acbd214570536da029933d296749fa6c58b5a71e8dd753142ee432352da0baff535165fd405a955216eece6dc3cc7d20034506fc40d2e840f0dbd0974809bf98030f3fd4842649f8a23feeb960b1fa9fbbd5133bc228ab7f73dfe8355b337882877760857d6570e1faedda347b6e90056f44a';
    // const api_url =
    //   'https://chapter-website-backend.herokuapp.com/api/members?pagination[page]=1&pagination[pageSize]=100&populate=componentRolesArr';
    // const func = async () => {
    //   const response = await fetch(api_url, {
    //     method: 'GET',
    //     headers: {
    //       Authorization: `Bearer ${api_token}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   const thing = await response.json();
    //   setStrapiData(thing.data);
    // };
    // func();
    // getProjects(false).then((res) => console.log(res));
  }, []);

  const add = async () => {
    const firstName = 'Wren';
    const lastName = 'Poremba';
    const role: Roles = Roles['Senior Advisor'];
    const member = members.find(
      (member) => member.member.firstName.trim() === firstName && member.member.lastName.trim() === lastName,
    );
    member?.member.roles.push({ role: role, isDisplayRole: true });
    await updateMember(member!.id, member!.member)
      .then(() => console.log('done'))
      .catch((e) => console.log(e));
  };
  return (
    <>
      <button onClick={() => add()}> Hi</button>
    </>
  );
};
export default AdminTestingPage;
