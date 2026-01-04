
'use client'
import { cn } from '@/lib/utils'
import { authClient } from '../lib/db/auth-client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import * as z from 'zod'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useState } from 'react'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<
    'google' | 'github' | null
  >(null)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        await authClient.signUp.email(
          {
            email: value.email,
            password: value.password,
            name: value.name,
            callbackURL: '/dashboard',
          },
          {
            onSuccess: () => {
              toast.success(
                'Account created successfully! Check your email to verify your account.',
              )
              // You might want to redirect the user or show a verification message
            },
            onError: (ctx) => {
              toast.error(
                ctx.error.message ||
                  'Failed to create account. Please try again.',
              )
            },
          },
        )
      } catch (error) {
        toast.error('An unexpected error occurred')
        console.error('Sign-up error:', error)
      } finally {
        setIsLoading(false)
      }
    },
  })

  // GitHub OAuth sign-up (actually sign-in with implicit signup)
  const socialSignUp = async (provider: 'github' | 'google') => {
    setSocialLoading(provider)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/dashboard',
      })
    } catch (error) {
      toast.error(`Failed to sign up with ${provider}`)
      console.error(`${provider} sign-up error:`, error)
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Sign up with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sign up with social buttons section */}
          <div className="flex flex-col gap-3 mb-6">
            <Button
              variant="outline"
              onClick={() => socialSignUp('github')}
              disabled={socialLoading !== null || isLoading}
            >
              {socialLoading === 'github'
                ? 'Loading...'
                : 'Sign up with GitHub'}
            </Button>

            <Button
              variant="outline"
              onClick={() => socialSignUp('google')}
              disabled={socialLoading !== null || isLoading}
            >
              {socialLoading === 'google'
                ? 'Loading...'
                : 'Sign up with Google'}
            </Button>
          </div>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            Or sign up with email
          </FieldSeparator>

          <form
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="mt-6"
          >
            <FieldGroup>
              {/* Full name Field */}
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="John Doe"
                        autoComplete="name"
                        type="text"
                        disabled={isLoading || socialLoading !== null}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              {/* Email Field */}
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email Address
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="example@example.com"
                        autoComplete="email"
                        type="email"
                        disabled={isLoading || socialLoading !== null}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              {/* Password Field */}
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="••••••••"
                        type="password"
                        autoComplete="new-password"
                        disabled={isLoading || socialLoading !== null}
                      />
                      <FieldDescription>
                        Must be at least 6 characters with one uppercase letter
                        and one number
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              {/* Sign Up Button and Login Link */}
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || socialLoading !== null}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{' '}
                  <a href="/login" className="hover:underline">
                    Log in
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By creating an account, you agree to our{' '}
        <a href="/terms" className="hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  )
}
