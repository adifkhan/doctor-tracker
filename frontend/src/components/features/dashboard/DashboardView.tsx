"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Stethoscope, TrendingUp, UserPlus, Users } from "lucide-react";
import { ErrorState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api-errors";
import { cn } from "@/lib/utils";
import { useGetStatsQuery } from "@/store/api/dashboardApi";
import type { StatsRange } from "@/types";
import { ChartCard } from "./ChartCard";

const chartFallback = () => <Skeleton className="size-full" />;
const TrendChart = dynamic(() => import("./TrendChart"), {
  ssr: false,
  loading: chartFallback,
});
const DoctorLoadChart = dynamic(() => import("./DoctorLoadChart"), {
  ssr: false,
  loading: chartFallback,
});
const ConditionChart = dynamic(() => import("./ConditionChart"), {
  ssr: false,
  loading: chartFallback,
});

const RANGES: StatsRange[] = [7, 30, 90];

export function DashboardView() {
  const [range, setRange] = useState<StatsRange>(30);
  const { data, isLoading, isFetching, error, refetch } =
    useGetStatsQuery(range);

  const derived = useMemo(() => {
    if (!data) return undefined;
    const { doctors, patients } = data.totals;
    return {
      average: doctors ? (patients / doctors).toFixed(1) : "0",
      newPatients: data.patientsOverTime.reduce((sum, d) => sum + d.count, 0),
      hasTrend:
        data.patientsOverTime.some((d) => d.count > 0) ||
        data.doctorsOverTime.some((d) => d.count > 0),
    };
  }, [data]);

  const rangeToggle = (
    <div
      className="inline-flex rounded-md border bg-card p-0.5 shadow-soft"
      role="group"
      aria-label="Date range"
    >
      {RANGES.map((r) => (
        <Button
          key={r}
          size="sm"
          variant="ghost"
          aria-pressed={range === r}
          onClick={() => setRange(r)}
          className={cn(
            "h-7",
            range === r && "bg-accent text-accent-foreground hover:bg-accent",
          )}
        >
          {r} days
        </Button>
      ))}
    </div>
  );

  if (error && !data) {
    return (
      <>
        <PageHeader title="Overview" />
        <div className="rounded-lg border bg-card shadow-soft">
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="A snapshot of doctors and patients."
        actions={rangeToggle}
      />

      <div
        className={cn(
          "space-y-6 transition-opacity",
          isFetching && !isLoading && "opacity-70",
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total doctors"
            value={data?.totals.doctors}
            icon={Stethoscope}
            loading={isLoading}
          />
          <StatCard
            label="Total patients"
            value={data?.totals.patients}
            icon={Users}
            loading={isLoading}
          />
          <StatCard
            label="Avg patients per doctor"
            value={derived?.average}
            icon={TrendingUp}
            loading={isLoading}
          />
          <StatCard
            label="New patients"
            value={derived?.newPatients}
            hint={`Last ${range} days`}
            icon={UserPlus}
            loading={isLoading}
          />
        </div>

        <ChartCard
          title="Growth over time"
          description={`New patients and doctors per day, last ${range} days`}
          loading={isLoading}
          empty={!!derived && !derived.hasTrend}
        >
          {data && (
            <TrendChart
              patients={data.patientsOverTime}
              doctors={data.doctorsOverTime}
            />
          )}
        </ChartCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Patients per doctor"
            description="Doctors with the most patients"
            loading={isLoading}
            empty={data?.patientsPerDoctor.length === 0}
          >
            {data && <DoctorLoadChart data={data.patientsPerDoctor} />}
          </ChartCard>
          <ChartCard
            title="Conditions"
            description="Most common patient conditions"
            loading={isLoading}
            empty={data?.conditionBreakdown.length === 0}
            bodyClassName="sm:h-64"
          >
            {data && <ConditionChart data={data.conditionBreakdown} />}
          </ChartCard>
        </div>
      </div>
    </>
  );
}
