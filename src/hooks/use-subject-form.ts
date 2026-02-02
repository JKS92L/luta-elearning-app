// src/hooks/use-subject-form.ts
import * as z from 'zod'
import { useForm } from '@tanstack/react-form'
import { LevelType } from '@/lib/db/schema'

export const subjectFormSchema = z.object({
  name: z.string()
    .min(1, 'Subject name is required')
    .max(100, 'Name must be less than 100 characters'),
  short_tag: z.string()
    .min(1, 'Short tag is required')
    .max(20, 'Short tag must be 20 characters or less')
    .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores allowed'),
  code: z.string()
    .min(1, 'Subject code is required')
    .max(10, 'Code must be 10 characters or less')
    .regex(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers allowed'),
  description: z.string().max(500, 'Description must be 500 characters or less'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum([...Object.keys(LevelType) as [keyof typeof LevelType], '']),
})

export type SubjectFormValues = z.infer<typeof subjectFormSchema>

export function useSubjectForm(
  onSubmit: (values: SubjectFormValues) => Promise<void>,
  initialValues?: Partial<SubjectFormValues>
) {
  const form = useForm({
    defaultValues: {
      name: initialValues?.name || '',
      short_tag: initialValues?.short_tag || '',
      code: initialValues?.code || '',
      description: initialValues?.description || '',
      category: initialValues?.category || '',
      level: initialValues?.level || '' as keyof typeof LevelType | '',
    },
    validators: {
      onChange: subjectFormSchema,
      onSubmit: subjectFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return form
}