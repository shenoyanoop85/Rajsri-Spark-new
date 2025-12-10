
import { useState } from 'react';

// A generic hook for form handling with validation
export function useForm<T>(
  initialValues: T, 
  validate: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear specific error on change if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const reset = (newValues?: T) => {
    setValues(newValues || initialValues);
    setErrors({});
  };

  const handleSubmit = (onSubmit: (values: T) => void) => {
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    onSubmit(values);
    return true;
  };

  return {
    values,
    errors,
    setValues,
    handleChange,
    handleSubmit,
    reset
  };
}
