'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { PatientFormValues } from '@/lib/validators/schemas';
import { useAddDoctorPatientMutation } from '@/store/api/doctorsApi';
import { PatientForm } from './PatientForm';
import { toPatientPayload } from './patientColumns';

export function AddPatientDialog({ doctorId }: { doctorId: string }) {
  const [open, setOpen] = useState(false);
  const [addPatient] = useAddDoctorPatientMutation();

  const handleSubmit = async (values: PatientFormValues) => {
    await addPatient({ doctorId, body: toPatientPayload(values) }).unwrap();
    toast.success('Patient added');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>The patient will be assigned to this doctor.</DialogDescription>
        </DialogHeader>
        <PatientForm submitLabel="Add patient" onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
