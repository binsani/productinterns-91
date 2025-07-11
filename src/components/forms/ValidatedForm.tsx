
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

interface ValidatedFormProps<T extends z.ZodSchema> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<T>>;
  children: (form: ReturnType<typeof useForm<z.infer<T>>>) => ReactNode;
  className?: string;
}

export function ValidatedForm<T extends z.ZodSchema>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className
}: ValidatedFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in the onSubmit function
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        {children(form)}
      </form>
    </Form>
  );
}
