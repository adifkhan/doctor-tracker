import { toast } from "sonner";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiErrorBody } from "@/types";

const body = (error: unknown): ApiErrorBody | undefined => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "object" && data !== null && "message" in data)
      return data as ApiErrorBody;
  }
  return undefined;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  const message = body(error)?.message;
  if (message) return message;
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === "FETCH_ERROR"
  ) {
    return "Cannot reach the server. Check your connection.";
  }
  return fallback;
};

export const handleFormError = <T extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>,
) => {
  const fieldErrors = body(error)?.errors ?? [];
  let mapped = 0;
  if (setError) {
    for (const { field, message } of fieldErrors) {
      setError(field as Path<T>, { type: "server", message });
      mapped += 1;
    }
  }
  toast.error(
    getErrorMessage(error),
    mapped
      ? { description: "Please review the highlighted fields." }
      : undefined,
  );
};
