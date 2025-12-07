import HomeClient from "./_components/HomeClient";

// async function getUsers() {
//   const res = await fetch('https://jsonplaceholder.typicode.com/users');
//   if (!res.ok) throw new Error('Failed to fetch data');
//   return res.json();
// }

export default async function Page() {
  // const users = await getUsers();

  return <HomeClient/>;
}
