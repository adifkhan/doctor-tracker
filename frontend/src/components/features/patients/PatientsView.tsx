'use client';

import { useCallback, useMemo, useState } from 'react';
import { Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { DateRangeFilter, FilterBar, FilterSelect } from '@/components/shared/FilterBar';
import { PageHeader } from '@/components/shared/PageHeader';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { useClampPage } from '@/hooks/useClampPage';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { getErrorMessage } from '@/lib/api-errors';
import { GENDERS, MAX_SELECT_DOCTORS } from '@/lib/constants';
import { capitalize } from '@/lib/utils';
import { useGetDoctorsQuery } from '@/store/api/doctorsApi';
import { useDeletePatientMutation, useGetConditionsQuery, useGetPatientsQuery } from '@/store/api/patientsApi';
import type { Patient } from '@/types';
import { EditPatientDialog } from './EditPatientDialog';
import { ageGenderColumn, conditionColumn, createdColumn, nameColumn, phoneColumn } from './patientColumns';

const FILTER_KEYS = ['search', 'condition', 'doctor', 'gender', 'from', 'to'] as const;
const genderOptions = GENDERS.map((g) => ({ value: g, label: capitalize(g) }));
const rowKey = (p: Patient) => p._id;

export function PatientsView() {
  const { filters, page, limit, activeCount, update, setPage, setLimit, reset } = useUrlFilters(FILTER_KEYS);
  const { data, isLoading, isFetching, error, refetch } = useGetPatientsQuery({
    page,
    limit,
    ...filters,
    gender: filters.gender as Patient['gender'] | '',
  });
  const { data: conditions, isLoading: conditionsLoading } = useGetConditionsQuery();
  const { data: doctors, isLoading: doctorsLoading } = useGetDoctorsQuery({ limit: MAX_SELECT_DOCTORS });
  const [deletePatient, { isLoading: deleting }] = useDeletePatientMutation();
  const [toEdit, setToEdit] = useState<Patient | null>(null);
  const [toDelete, setToDelete] = useState<Patient | null>(null);

  useClampPage(data?.meta, page, setPage);

  const conditionOptions = useMemo(() => (conditions ?? []).map((c) => ({ value: c, label: c })), [conditions]);
  const doctorOptions = useMemo(
    () => (doctors?.items ?? []).map((d) => ({ value: d._id, label: d.name })),
    [doctors]
  );

  const setSearch = useCallback((search: string) => update({ search }), [update]);
  const setCondition = useCallback((condition: string) => update({ condition }), [update]);
  const setDoctor = useCallback((doctor: string) => update({ doctor }), [update]);
  const setGender = useCallback((gender: string) => update({ gender }), [update]);
  const closeEdit = useCallback(() => setToEdit(null), []);

  const columns = useMemo<Column<Patient>[]>(
    () => [
      nameColumn,
      ageGenderColumn,
      phoneColumn,
      conditionColumn,
      {
        header: 'Doctor',
        cell: (p) => (
          <div>
            <p>{p.doctor.name}</p>
            <p className="text-xs text-muted-foreground">{p.doctor.specialization}</p>
          </div>
        ),
      },
      createdColumn,
      {
        header: 'Actions',
        className: 'text-right',
        cell: (p) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" aria-label={`Edit ${p.name}`} onClick={() => setToEdit(p)}>
              <Pencil />
            </Button>
            <Button variant="ghost" size="icon" aria-label={`Delete ${p.name}`} onClick={() => setToDelete(p)}>
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deletePatient(toDelete._id).unwrap();
      toast.success('Patient deleted');
      setToDelete(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <>
      <PageHeader title="Patients" description="Search, edit and manage all patients." />
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
          <FilterSelect
            value={filters.doctor}
            onChange={setDoctor}
            options={doctorOptions}
            placeholder="All doctors"
            loading={doctorsLoading}
          />
          <FilterSelect value={filters.gender} onChange={setGender} options={genderOptions} placeholder="All genders" />
          <DateRangeFilter from={filters.from} to={filters.to} onChange={update} />
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
          emptyDescription={activeCount ? 'Try adjusting or clearing your filters.' : 'Patients are added from a doctor’s page.'}
          emptyAction={activeCount ? <Button variant="outline" size="sm" onClick={reset}>Clear filters</Button> : undefined}
        />
        {data && data.meta.total > 0 && <Pagination meta={data.meta} onPageChange={setPage} onLimitChange={setLimit} />}
      </div>

      <EditPatientDialog patient={toEdit} onClose={closeEdit} />
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
