"use client";

import { callAPI } from "@/app/_providers/AuthProvider";
import { Method } from "@/auth/constants";
import Form from "@/design-system/template/OnboardingForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingCompanyRequest } from "@/auth/dto/requests/onboarding-company.request";

export default function OnboardingCompanyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [contractTypes, setContractTypes] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!name || !lastName || !bio || !skills || !contractTypes) {
      return;
    }
    try {
      const response = await callAPI<OnboardingCompanyRequest, void>({
        route: "/profiles/companies/me",
        method: Method.POST,
        data: {
          companyName: name,
          description: bio,
          industry: lastName,
          techStack: skills,
        },
        isPublicRoute: false,
      });
      if (response.ok) {
        router.replace("/yozu-lite/accueil");
      }
    } catch (error) {
      console.log(error);
    }
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
      selectorOptions={["CDI", "CDD", "Alternance", "Temps partiel"]}
      labels={{
        labelTitle: "Onboarding entreprise",
        labelInputField1: "Nom de l'entreprise",
        labelInputField2: "Secteur d’activité",
        labelTextAreaField: "Description de l'entreprise",
        labelPickerField: "Compétences recherchées",
        labelSelectorField: "Type de contrat recherché",
      }}
    />
  );
}
