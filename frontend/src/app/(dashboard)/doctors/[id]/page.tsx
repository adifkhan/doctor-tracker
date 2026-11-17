import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DoctorDetailView } from '@/components/features/doctors/DoctorDetailView';

export const metadata: Metadata = { title: 'Doctor details' };

export default async function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <DoctorDetailView id={id} />
    </Suspense>
  );
}
