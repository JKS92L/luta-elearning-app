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
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        await authClient.signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: "/dashboard",
        }, {
          onSuccess: () => {
            toast.success('Logged in successfully!')
            // You might want to redirect the user or update the UI here
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Failed to log in. Please try again.')
          },
        })
      } finally {
        setIsLoading(false)
      }
    },
  })

  // GitHub OAuth sign-in
  const signInWithGitHub = async () => {
    setSocialLoading('github')
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
    } catch (error) {
      toast.error('Failed to sign in with GitHub')
      console.error('GitHub sign-in error:', error)
    } finally {
      setSocialLoading(null)
    }
  }

  // Google OAuth sign-in
  const signInWithGoogle = async () => {
    setSocialLoading('google')
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
    } catch (error) {
      toast.error('Failed to sign in with Google')
      console.error('Google sign-in error:', error)
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login with social buttons section */}
          <div className="flex flex-col gap-3 mb-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={signInWithGitHub}
              disabled={socialLoading !== null || isLoading}
            >
              {socialLoading === 'github' ? (
                <>Loading...</>
              ) : (
                <>Continue with GitHub</>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              type="button" 
              onClick={signInWithGoogle}
              disabled={socialLoading !== null || isLoading}
            >
              {socialLoading === 'google' ? (
                <>Loading...</>
              ) : (
                <>Continue with Google</>
              )}
            </Button>
          </div>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            Or continue with email
          </FieldSeparator>

          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="mt-6"
          >
            <FieldGroup>
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
                      <div className="flex items-center">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <a
                          href="/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="••••••••"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading || socialLoading !== null}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              {/* Login Button and Sign Up Link */}
              <Field>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || socialLoading !== null}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{' '}
                  <a href="/signup" className="hover:underline">
                    Sign Up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{' '}
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