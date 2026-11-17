'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { DateRangeFilter, FilterBar, FilterSelect } from '@/components/shared/FilterBar';
import { Pagination } from '@/components/shared/Pagination';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { getErrorMessage } from '@/lib/api-errors';
import { formatDate } from '@/lib/utils';
import { useGetDoctorFiltersQuery, useGetDoctorsQuery } from '@/store/api/doctorsApi';
import type { Doctor } from '@/types';
import { AddDoctorDialog } from './AddDoctorDialog';

const FILTER_KEYS = ['search', 'specialization', 'hospital', 'from', 'to'] as const;

const columns: Column<Doctor>[] = [
  {
    header: 'Doctor',
    cell: (d) => (
      <div>
        <p className="font-medium">{d.name}</p>
        <p className="text-xs text-muted-foreground">{d.email}</p>
      </div>
    ),
  },
  { header: 'Specialization', cell: (d) => d.specialization },
  { header: 'Hospital', cell: (d) => d.hospital },
  { header: 'Phone', cell: (d) => <span className="whitespace-nowrap">{d.phone}</span> },
  { header: 'Patients', cell: (d) => <Badge>{d.patientCount}</Badge> },
  { header: 'Created', cell: (d) => <span className="whitespace-nowrap">{formatDate(d.createdAt)}</span> },
  {
    header: 'Actions',
    className: 'text-right',
    cell: (d) => (
      <Button asChild variant="outline" size="sm">
        <Link href={`/doctors/${d._id}`}>View</Link>
      </Button>
    ),
  },
];

const rowKey = (d: Doctor) => d._id;
const toOptions = (values: string[] = []) => values.map((v) => ({ value: v, label: v }));

export function DoctorsView() {
  const { filters, page, limit, activeCount, update, setPage, setLimit, reset } = useUrlFilters(FILTER_KEYS);
  const { data, isLoading, isFetching, error, refetch } = useGetDoctorsQuery({ page, limit, ...filters });
  const { data: options, isLoading: optionsLoading } = useGetDoctorFiltersQuery();

  const specializations = useMemo(() => toOptions(options?.specializations), [options]);
  const hospitals = useMemo(() => toOptions(options?.hospitals), [options]);

  const setSearch = useCallback((search: string) => update({ search }), [update]);
  const setSpecialization = useCallback((specialization: string) => update({ specialization }), [update]);
  const setHospital = useCallback((hospital: string) => update({ hospital }), [update]);

  return (
    <>
      <PageHeader title="Doctors" description="Browse and manage doctors." actions={<AddDoctorDialog />} />
      <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
        <FilterBar activeCount={activeCount} onClear={reset}>
          <SearchInput value={filters.search} onChange={setSearch} placeholder="Search name, phone or email" />
          <FilterSelect
            value={filters.specialization}
            onChange={setSpecialization}
            options={specializations}
            placeholder="All specializations"
            loading={optionsLoading}
          />
          <FilterSelect
            value={filters.hospital}
            onChange={setHospital}
            options={hospitals}
            placeholder="All hospitals"
            loading={optionsLoading}
          />
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
          emptyTitle="No doctors found"
          emptyDescription={activeCount ? 'Try adjusting or clearing your filters.' : 'Add your first doctor to get started.'}
          emptyAction={activeCount ? <Button variant="outline" size="sm" onClick={reset}>Clear filters</Button> : undefined}
          emptyIcon={Stethoscope}
        />
        {data && data.meta.total > 0 && <Pagination meta={data.meta} onPageChange={setPage} onLimitChange={setLimit} />}
      </div>
    </>
  );
}
