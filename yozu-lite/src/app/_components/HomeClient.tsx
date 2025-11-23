"use client";

import Button from "@/design/atoms/Button";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [compteur, setCompteur] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompteur((c) => c + 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "50px",
      }}
    >
      <TextField
        label="Home Client Component"
        variant="outlined"
        style={{ color: "black" }}
      />

      <Button className="test" onClick={() => setCompteur((c) => c + 100)}>
        Like Button : {compteur}
      </Button>
    </div>
  );
}
