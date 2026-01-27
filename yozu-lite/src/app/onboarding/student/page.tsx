"use client";

import { callAPI, Method } from "@/auth";
import Form from "@/design-system/template/OnboardingForm";
import {
  ICreateStudentProfileRequest,
  IStudentProfileResponse,
} from "@yozu/contracts";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingStudentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [contractType, setContractType] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!name || !lastName || !bio || !skills || !contractType) {
      return;
    }
    try {
      const response = await callAPI<
        ICreateStudentProfileRequest,
        IStudentProfileResponse
      >({
        route: "/profiles/students/me",
        method: Method.POST,
        data: {
          firstName: name,
          lastName,
          bio,
          contractType,
          skills,
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
        pickerField: skills,
        selectorField: contractType,
      }}
      setFormData={{
        setInputField1: setName,
        setInputField2: setLastName,
        setTextAreaField: setBio,
        setPickerField: setSkills,
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
