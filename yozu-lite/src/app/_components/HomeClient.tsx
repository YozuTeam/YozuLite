"use client";

import { Button } from "@/design-system/atoms/Button";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/design-system/atoms/ThemeToggle";
import { Box, Stack } from "@mui/material";

export default function HomeClient() {
  const [compteur, setCompteur] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompteur((c) => c + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack
      alignItems="center"
      spacing={2.5}
      sx={{ py: 6 }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ThemeToggle />
      </Box>

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
