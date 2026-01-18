import { useState } from 'react';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

type UseFormSubmitOptions<T, R = unknown> = {
  action: (data: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  onError?: (error: Error) => void;
  transform?: (data: T) => T;
};

type UseFormSubmitReturn<T> = {
  submitState: SubmitState;
  message: string | null;
  isSubmitting: boolean;
  handleSubmit: (data: T) => Promise<void>;
  clearMessage: () => void;
};

export function useFormSubmit<T, R = unknown>(options: UseFormSubmitOptions<T, R>): UseFormSubmitReturn<T> {
  const { action, onSuccess, onError, transform } = options;
  
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    setSubmitState('loading');
    setMessage(null);

    try {
      const transformedData = transform ? transform(data) : data;
      const result = await action(transformedData);

      setSubmitState('success');
      setMessage('Sparat!');
      onSuccess?.(result);
    } catch (error) {
      setSubmitState('error');
      const errorMessage = error instanceof Error ? error.message : 'Ett fel uppstod';
      setMessage(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  const clearMessage = () => {
    setMessage(null);
    setSubmitState('idle');
  };

  return {
    submitState,
    message,
    isSubmitting: submitState === 'loading',
    handleSubmit,
    clearMessage,
  };
}
