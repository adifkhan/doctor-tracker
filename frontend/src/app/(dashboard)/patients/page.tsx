import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PatientsView } from '@/components/features/patients/PatientsView';

export const metadata: Metadata = { title: 'Patients' };

export default function PatientsPage() {
  return (
    <Suspense>
      <PatientsView />
    </Suspense>
  );
}
