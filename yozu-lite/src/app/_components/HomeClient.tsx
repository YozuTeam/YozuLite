"use client";

import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

export default function HomeClient() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <Card
        className="
		  w-1/2
          sm:w-3/4
          md:w-1/2
          lg:w-2/5
          xl:w-1/3
          rounded-3xl
          shadow-xl
          ring-1 ring-black/5
          backdrop-blur-sm
        "
      >
        <CardContent className="p-10">
          <div className="text-center mb-8">
            <Typography variant="h4" className="font-semibold tracking-tight">
              YOZU Lite gros rat
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-500 mt-2 leading-relaxed"
            >
              Projet Next.js propre & vide. <br /> Tu peux commencer à ajouter tes features.
            </Typography>
          </div>

          <Divider className="mb-8" />

          <Stack spacing={3}>
            <TextField label="Votre nom" size="small" fullWidth />

            <Button
              variant="contained"
              fullWidth
              disableElevation
              className="!rounded-xl !py-2.5 !normal-case"
            >
              Tester MUI
            </Button>

            <Button
              variant="outlined"
              fullWidth
              className="!rounded-xl !py-2.5 !normal-case"
            >
              Bouton Tailwind + MUI
            </Button>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600 shadow-sm">
              Ce bloc est stylé avec{" "}
              <span className="font-medium">Tailwind</span>.
            </div>
          </Stack>
        </CardContent>
      </Card>
    </main>
  );
}
