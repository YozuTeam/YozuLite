"use client";

import { Box, Stack } from "@mui/material";
import Picker from "@/design-system/organism/Picker";
import SelectOverlay from "@/design-system/organism/SelectOverlay";
import { useState } from "react";

export default function OrganismPreviewPage() {
    const [open, setOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    
    const options = [
        "polyvalent",
        "esprit d'entreprise",
        "rapide",
        "responsable",
        "confiant",
        "chaleureux",
        "propre",
        "motivé",
        "courtois",
        "discipliné",
        "énergique",
        "adapté",
        "éthique",
    ];

    return (
       <Stack direction="column" alignItems="center" justifyContent="center">
       <Box sx={{ p: 4, width: "100%", maxWidth: 520, mx: "auto" }}>
        <Picker 
            label="Selectionner une compétence" 
            open={open} 
            setOpen={setOpen}
            options={options}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
        >
          <SelectOverlay 
            onClose={() => { setOpen(false) }}
            options={options}
            selectedValue={""}
            onSelect={(option) => {
                if (!selectedValues.includes(option)) {
                    setSelectedValues([...selectedValues, option]);
                }
            }}
          />
        </Picker>
       </Box>
       </Stack>
    );
}