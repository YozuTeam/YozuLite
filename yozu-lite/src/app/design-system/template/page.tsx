"use client";

import Form, { FormData } from "@/design-system/template/OnboardingForm";
import { useState } from "react";

export default function TemplatePreviewPage() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [contractTypes, setContractTypes] = useState<string[]>([]);

    const handleSubmit = (data: FormData) => {
        console.warn("Template Preview Data submitted:", data);
    };

    return (
        <Form 
            data={{
                inputField1: name,
                inputField2: lastName,
                textAreaField: bio,
                pickerField: skills,
                selectorField: contractTypes,
            }}
            setFormData={{
                setInputField1: setName,
                setInputField2: setLastName,
                setTextAreaField: setBio,
                setPickerField: setSkills,
                setSelectorField: setContractTypes,
            }}
            onSubmit={handleSubmit} 
            pickerOptions={[
                "Collaboratif",
                "Individuel",
                "Autonome",
                "Hybride",
                "Analytique",
                "Stratégique",
                "Innovant",
                "Pratique",
                "Organisé",
            ]}
            selectorOptions={["CDI", "CDD", "Alternance","Temps partiel"]}
            labels={{
                labelTitle: "Onboarding",
                labelInputField1: "Prénom",
                labelInputField2: "Nom",
                labelTextAreaField: "Biographie",
                labelPickerField: "Tes compétences",
                labelSelectorField: "Type de contrat",
            }}
        />
    );
}