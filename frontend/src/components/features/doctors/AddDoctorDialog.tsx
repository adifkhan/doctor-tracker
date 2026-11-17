'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { handleFormError } from '@/lib/api-errors';
import { doctorSchema, type DoctorValues } from '@/lib/validators/schemas';
import { useAddDoctorMutation } from '@/store/api/doctorsApi';

const FIELDS: { name: keyof DoctorValues; label: string; type?: string }[] = [
  { name: 'name', label: 'Full name' },
  { name: 'specialization', label: 'Specialization' },
  { name: 'hospital', label: 'Hospital' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'email', label: 'Email', type: 'email' },
];

function DoctorForm({ onDone }: { onDone: () => void }) {
  const [addDoctor, { isLoading }] = useAddDoctorMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DoctorValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: { name: '', specialization: '', hospital: '', phone: '', email: '' },
  });

  const onSubmit = async (values: DoctorValues) => {
    try {
      await addDoctor(values).unwrap();
      toast.success('Doctor added');
      onDone();
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ name, label, type }) => (
          <div key={name} className={name === 'email' ? 'sm:col-span-2' : undefined}>
            <FormField label={label} htmlFor={`doctor-${name}`} error={errors[name]?.message}>
              <Input id={`doctor-${name}`} type={type} aria-invalid={!!errors[name]} {...register(name)} />
            </FormField>
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          Add doctor
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AddDoctorDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add doctor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add doctor</DialogTitle>
          <DialogDescription>Enter the doctor&apos;s details.</DialogDescription>
        </DialogHeader>
        <DoctorForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
