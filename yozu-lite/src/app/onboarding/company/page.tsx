"use client";

import { callAPI, Method } from "@/auth";
import Form from "@/design-system/template/OnboardingForm";
import {
  ICompanyProfileResponse,
  ICreateCompanyProfileRequest,
} from "@yozu/contracts";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingCompanyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [competences, setCompetences] = useState<string[]>([]);
  const [contractType, setContractType] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!name || !lastName || !bio || !competences || !contractType) {
      return;
    }
    try {
      const response = await callAPI<
        ICreateCompanyProfileRequest,
        ICompanyProfileResponse
      >({
        route: "/profiles/companies/me",
        method: Method.POST,
        data: {
          companyName: name,
          description: bio,
          industry: lastName,
          competences,
          contractType,
        },
        isPublicRoute: false,
      });
      console.log(response);
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
        pickerField: competences,
        selectorField: contractType,
      }}
      setFormData={{
        setInputField1: setName,
        setInputField2: setLastName,
        setTextAreaField: setBio,
        setPickerField: setCompetences,
        setSelectorField: setContractType,
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
