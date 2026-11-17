'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Mail, Phone, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { ErrorState } from '@/components/shared/EmptyState';
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { AddPatientDialog } from '@/components/features/patients/AddPatientDialog';
import {
  ageGenderColumn,
  conditionColumn,
  createdColumn,
  nameColumn,
  phoneColumn,
} from '@/components/features/patients/patientColumns';
import { useClampPage } from '@/hooks/useClampPage';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { getErrorMessage } from '@/lib/api-errors';
import { initials } from '@/lib/utils';
import {
  useDeleteDoctorPatientMutation,
  useGetDoctorPatientsQuery,
  useGetDoctorQuery,
} from '@/store/api/doctorsApi';
import { useGetConditionsQuery } from '@/store/api/patientsApi';
import type { Doctor, Patient } from '@/types';

const FILTER_KEYS = ['search', 'condition'] as const;
const rowKey = (p: Patient) => p._id;

function DoctorHeader({ doctor, loading, error, onRetry }: { doctor?: Doctor; loading: boolean; error?: string; onRetry: () => void }) {
  if (error) {
    return (
      <div className="rounded-lg border bg-card shadow-soft">
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5 rounded-lg border bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      {loading || !doctor ? (
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
              {initials(doctor.name)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight">{doctor.name}</h2>
              <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Building2 className="size-3.5" />{doctor.hospital}</span>
                <span className="flex items-center gap-1.5"><Phone className="size-3.5" />{doctor.phone}</span>
                <span className="flex items-center gap-1.5"><Mail className="size-3.5" />{doctor.email}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
            <Users className="size-5 text-primary" />
            <div>
              <p className="text-2xl font-semibold leading-none">{doctor.patientCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Patients</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function DoctorDetailView({ id }: { id: string }) {
  const { filters, page, limit, activeCount, update, setPage, setLimit, reset } = useUrlFilters(FILTER_KEYS);
  const doctorQuery = useGetDoctorQuery(id);
  const patientsQuery = useGetDoctorPatientsQuery({ id, page, limit, ...filters });
  const { data: conditions, isLoading: conditionsLoading } = useGetConditionsQuery();
  const [deletePatient, { isLoading: deleting }] = useDeleteDoctorPatientMutation();
  const [toDelete, setToDelete] = useState<Patient | null>(null);

  const { data, isLoading, isFetching, error, refetch } = patientsQuery;
  useClampPage(data?.meta, page, setPage);

  const conditionOptions = useMemo(() => (conditions ?? []).map((c) => ({ value: c, label: c })), [conditions]);
  const setSearch = useCallback((search: string) => update({ search }), [update]);
  const setCondition = useCallback((condition: string) => update({ condition }), [update]);

  const columns = useMemo<Column<Patient>[]>(
    () => [
      nameColumn,
      ageGenderColumn,
      phoneColumn,
      conditionColumn,
      createdColumn,
      {
        header: 'Actions',
        className: 'text-right',
        cell: (p) => (
          <Button variant="ghost" size="icon" aria-label={`Delete ${p.name}`} onClick={() => setToDelete(p)}>
            <Trash2 className="text-destructive" />
          </Button>
        ),
      },
    ],
    []
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deletePatient({ doctorId: id, patientId: toDelete._id }).unwrap();
      toast.success('Patient deleted');
      setToDelete(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/doctors">
          <ArrowLeft />
          Back to doctors
        </Link>
      </Button>

      <DoctorHeader
        doctor={doctorQuery.data}
        loading={doctorQuery.isLoading}
        error={doctorQuery.error ? getErrorMessage(doctorQuery.error) : undefined}
        onRetry={doctorQuery.refetch}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Patients</h3>
        <AddPatientDialog doctorId={id} />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
        <FilterBar activeCount={activeCount} onClear={reset}>
          <SearchInput value={filters.search} onChange={setSearch} placeholder="Search name, phone or email" />
          <FilterSelect
            value={filters.condition}
            onChange={setCondition}
            options={conditionOptions}
            placeholder="All conditions"
            loading={conditionsLoading}
          />
        </FilterBar>
        <DataTable
          columns={columns}
          rows={data?.items}
          rowKey={rowKey}
          loading={isLoading}
          fetching={isFetching}
          skeletonRows={limit > 10 ? 10 : limit}
          error={error ? getErrorMessage(error) : undefined}
          onRetry={refetch}
          emptyIcon={Users}
          emptyTitle="No patients found"
          emptyDescription={activeCount ? 'Try adjusting or clearing your filters.' : 'This doctor has no patients yet.'}
        />
        {data && data.meta.total > 0 && <Pagination meta={data.meta} onPageChange={setPage} onLimitChange={setLimit} />}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete patient"
        description={`Delete ${toDelete?.name ?? 'this patient'}? This action cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
