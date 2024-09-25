import { useMemo } from "react";

export default function FormikHelperErrorList<T extends object>(
  errors: T,
  touched: Partial<Record<keyof T, boolean>>,
  values: T
) {
  return useMemo(() => {
    const formErrors: string[] = [];
    for (const key in values) {
      const typedKey = key as keyof typeof values;
      if (errors[typedKey] && touched[typedKey]) {
        formErrors.push(errors[typedKey] as string);
      }
    }
    return formErrors;
  }, [errors, touched]);
}
