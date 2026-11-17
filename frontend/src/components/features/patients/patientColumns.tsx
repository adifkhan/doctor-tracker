import type { Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { capitalize, formatDate } from '@/lib/utils';
import type { Patient } from '@/types';

export const nameColumn: Column<Patient> = {
  header: 'Patient',
  cell: (p) => (
    <div>
      <p className="font-medium">{p.name}</p>
      {p.email && <p className="text-xs text-muted-foreground">{p.email}</p>}
    </div>
  ),
};

export const ageGenderColumn: Column<Patient> = {
  header: 'Age / Gender',
  cell: (p) => (
    <span className="whitespace-nowrap">
      {p.age} <span className="text-muted-foreground">· {capitalize(p.gender)}</span>
    </span>
  ),
};

export const phoneColumn: Column<Patient> = {
  header: 'Phone',
  cell: (p) => <span className="whitespace-nowrap">{p.phone}</span>,
};

export const conditionColumn: Column<Patient> = {
  header: 'Condition',
  cell: (p) => <Badge variant="secondary">{p.condition}</Badge>,
};

export const createdColumn: Column<Patient> = {
  header: 'Created',
  cell: (p) => <span className="whitespace-nowrap">{formatDate(p.createdAt)}</span>,
};

export const toPatientPayload = (values: {
  name: string;
  age: string;
  gender: Patient['gender'];
  phone: string;
  email: string;
  condition: string;
}) => ({
  name: values.name,
  age: Number(values.age),
  gender: values.gender,
  phone: values.phone,
  condition: values.condition,
  ...(values.email ? { email: values.email } : {}),
});
