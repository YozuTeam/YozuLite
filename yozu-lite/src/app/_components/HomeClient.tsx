"use client";

import { Button } from "@/design/atoms/Button";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/design/atoms/ThemeToggle";


// interface Users {
//   id: number;
//   name: string;
//   username: string;
//   email: string;}

export default function HomeClient(/* { users }: { users: Users[] } */) {
  const [compteur, setCompteur] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompteur((c) => c + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  // console.log(users);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '50px'
    }}>
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end"
      }}>
        <ThemeToggle />
      </div>

      <TextField
        label="Home Client Component"
        variant="outlined"
        style={{ color: 'black' }}
      />

      <Button className="test" onClick={() => setCompteur(c => c + 100)}>
        Like Button : {compteur}
      </Button>
      {/* {users.map(user => (
        <div key={user.id}>
          {user.name} ({user.username}) - {user.email}
        </div>
      ))} */}
      {/* <div>Utilisateurs chargés : {users.length}</div> */}
    </div>
  );
}
