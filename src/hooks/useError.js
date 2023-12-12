import { useState } from "react";

export const useError = (initialValues) => {
  const [error, setError] = useState(initialValues);

  return [
    error,
    ({ value }) => {
      setError(value);
    },
  ];
};
