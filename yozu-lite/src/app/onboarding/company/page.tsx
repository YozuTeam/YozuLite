"use client";

import Form from "@/design-system/template/OnboardingForm";
import { useState } from "react";

export default function OnboardingCompanyPage() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [contractTypes, setContractTypes] = useState<string[]>([]);

    

    const handleSubmit = () => {
        console.log("Company Data submitted");
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
            labelTitle: "Onboarding entreprise",
            labelInputField1: "Nom de l'entreprise",
            labelInputField2: "Slogan",
            labelTextAreaField: "Description de l'entreprise",
            labelPickerField: "Compétences recherchées",
            labelSelectorField: "Type de contrat recherché",
        }}
        />
    );
}