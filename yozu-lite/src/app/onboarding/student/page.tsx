"use client";

import { callAPI } from "@/app/_providers/AuthProvider";
import { Method } from "@/auth/constants";
import Form from "@/design-system/template/OnboardingForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingStudentRequest } from "@/auth/dto/requests/onboarding-student.request";

export default function OnboardingStudentPage() {
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
      const response = await callAPI<OnboardingStudentRequest, void>({
        route: "/profiles/students/me",
        method: Method.POST,
        data: {
          firstName: name,
          lastName,
          bio,
          school: contractTypes[0],
          skills,
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
      selectorOptions={["Oui", "Non"]}
      labels={{
        labelTitle: "Onboarding étudiant",
        labelInputField1: "Prénom",
        labelInputField2: "Nom",
        labelTextAreaField: "Ta bio",
        labelPickerField: "Tes compétences",
        labelSelectorField: "Es-tu dans une grande école ?",
      }}
    />
  );
}
