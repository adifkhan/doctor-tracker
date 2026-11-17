import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DoctorsView } from '@/components/features/doctors/DoctorsView';

export const metadata: Metadata = { title: 'Doctors' };

export default function DoctorsPage() {
  return (
    <Suspense>
      <DoctorsView />
    </Suspense>
  );
}
