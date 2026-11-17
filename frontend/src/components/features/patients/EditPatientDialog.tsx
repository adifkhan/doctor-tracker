"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MAX_SELECT_DOCTORS } from "@/lib/constants";
import type { PatientFormValues } from "@/lib/validators/schemas";
import { useGetDoctorsQuery } from "@/store/api/doctorsApi";
import { useUpdatePatientMutation } from "@/store/api/patientsApi";
import type { Patient } from "@/types";
import { PatientForm } from "./PatientForm";
import { toPatientPayload } from "./patientColumns";

interface EditPatientDialogProps {
  patient: Patient | null;
  onClose: () => void;
}

export function EditPatientDialog({
  patient,
  onClose,
}: EditPatientDialogProps) {
  const [updatePatient] = useUpdatePatientMutation();
  const { data } = useGetDoctorsQuery(
    { limit: MAX_SELECT_DOCTORS },
    { skip: !patient },
  );

  const doctors = useMemo(() => {
    const list = data?.items ?? [];
    if (!patient || list.some((d) => d._id === patient.doctor._id)) return list;
    return [patient.doctor, ...list];
  }, [data, patient]);

  const defaultValues = useMemo<Partial<PatientFormValues> | undefined>(
    () =>
      patient
        ? {
            name: patient.name,
            age: String(patient.age),
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email ?? "",
            condition: patient.condition,
            doctor: patient.doctor._id,
          }
        : undefined,
    [patient],
  );

  const handleSubmit = async ({ doctor, ...values }: PatientFormValues) => {
    if (!patient) return;
    await updatePatient({
      id: patient._id,
      body: { ...toPatientPayload(values), doctor },
    }).unwrap();
    toast.success("Patient updated");
    onClose();
  };

  return (
    <Dialog open={!!patient} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
          <DialogDescription>
            Update the patient&apos;s details or reassign their doctor.
          </DialogDescription>
        </DialogHeader>
        {patient && (
          <PatientForm
            key={patient._id}
            defaultValues={defaultValues}
            doctors={doctors}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
