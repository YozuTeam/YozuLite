"use client";

import { Button } from "@/design/atoms/Button";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/design/atoms/ThemeToggle";
import { Box, Stack } from "@mui/material";


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
    <Stack
      alignItems="center"
      spacing={2.5} // équivalent du gap 20px environ
      sx={{ py: 6 }} // padding vertical
    >
      {/* Zone “header” avec le ThemeToggle aligné à droite */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ThemeToggle />
      </Box>

      {/* Contenu principal */}
      <TextField
        label="Home Client Component"
        variant="outlined"
      />

      <Button onClick={() => setCompteur((c) => c + 100)}>
        Like Button : {compteur}
      </Button>
    </Stack>
  );

}
