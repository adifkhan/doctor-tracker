"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDERS } from "@/lib/constants";
import { handleFormError } from "@/lib/api-errors";
import {
  patientFormSchema,
  type PatientFormValues,
} from "@/lib/validators/schemas";
import { capitalize } from "@/lib/utils";

export interface DoctorOption {
  _id: string;
  name: string;
}

interface PatientFormProps {
  defaultValues?: Partial<PatientFormValues>;
  doctors?: DoctorOption[];
  submitLabel: string;
  onSubmit: (values: PatientFormValues) => Promise<unknown>;
  onCancel: () => void;
}

const EMPTY: PatientFormValues = {
  name: "",
  age: "",
  gender: undefined as never,
  phone: "",
  email: "",
  condition: "",
};

export function PatientForm({
  defaultValues,
  doctors,
  submitLabel,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      handleFormError(error, setError);
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField
            label="Full name"
            htmlFor="patient-name"
            error={errors.name?.message}
          >
            <Input
              id="patient-name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </FormField>
        </div>
        <FormField
          label="Age"
          htmlFor="patient-age"
          error={errors.age?.message}
        >
          <Input
            id="patient-age"
            inputMode="numeric"
            aria-invalid={!!errors.age}
            {...register("age")}
          />
        </FormField>
        <FormField
          label="Gender"
          htmlFor="patient-gender"
          error={errors.gender?.message}
        >
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="patient-gender"
                  aria-invalid={!!errors.gender}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {capitalize(g)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField
          label="Phone"
          htmlFor="patient-phone"
          error={errors.phone?.message}
        >
          <Input
            id="patient-phone"
            type="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </FormField>
        <FormField
          label="Email (optional)"
          htmlFor="patient-email"
          error={errors.email?.message}
        >
          <Input
            id="patient-email"
            type="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>
        <div className={doctors ? undefined : "sm:col-span-2"}>
          <FormField
            label="Condition"
            htmlFor="patient-condition"
            error={errors.condition?.message}
          >
            <Input
              id="patient-condition"
              aria-invalid={!!errors.condition}
              {...register("condition")}
            />
          </FormField>
        </div>
        {doctors && (
          <FormField
            label="Doctor"
            htmlFor="patient-doctor"
            error={errors.doctor?.message}
          >
            <Controller
              control={control}
              name="doctor"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="patient-doctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d._id} value={d._id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        )}
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
