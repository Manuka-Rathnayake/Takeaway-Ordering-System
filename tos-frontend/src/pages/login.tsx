import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from '@/utils/axios'
import { useAuth } from '@/utils/authcontext'
import { AxiosError } from 'axios'

// Define login credentials (replace with actual authentication)
// const LOGIN_CREDENTIALS = {
//   admin: { email: 'admin@example.com', password: 'admin123' },
//   kitchen: { email: 'kitchen@example.com', password: 'kitchen123' },
//   cashier: { email: 'cashier@example.com', password: 'cashier123' },
//   menu: { email: 'menu@example.com', password: 'menu123' }
// }

const formSchema = z.object({
  type: z.enum(["kitchen", "admin", "cashier"], {
    required_error: "Please select a login type.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(3, {
    message: "Password must be at least 8 characters long.",
  }),
})



// Main Login Component
export function MainLogin() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { type, email, password } = values

    const loginhandle = async () => {
      try {
        const res = await api.post('auth/login', {
          'section': type,
          'email': email,
          'password': password
        });

        console.log(res)


        if (res.status === 200) {
          login(type);

          switch (type) {
            case 'admin':
              navigate('/admin');
              break;
            case 'kitchen':
              navigate('/kitchen');
              break;
            case 'cashier':
              navigate('/cashier');
              break;
            default:
              setServerError("Unknown section!");
          }
        }
      } catch (error) {
        // Enhanced error handling
        if (error instanceof AxiosError) {
          // Axios-specific error handling
          const { response } = error;
          if (response) {
            const { status } = response;
            if (status === 400) {
              setServerError("Invalid Password!");
            } else if (status === 404) {
              setServerError("Email is Not Registered!");
            } else if (status === 301) {
              setServerError("You are not allowed to access this section!");
            } else {
              setServerError(`Server Error: ${status}`);
            }
          } else {
            // Axios error with no response (e.g., network error)
            setServerError("Network error occurred. Please check your connection.");
          }
        } else if (error instanceof Error) {
          // Generic JS Error (non-Axios)
          setServerError(error.message || "An unexpected error occurred.");
        } else {
          // Fallback for truly unknown errors
          setServerError("An unknown error occurred. Please try again.");
        }

        console.error("Error details:", error);
      }

    }

    loginhandle();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md bg-white/30 backdrop-filter backdrop-blur-md border border-gray-200 shadow-xl">
        <CardHeader className="space-y-1 items-center justify-center">
          <img src='/Logo.png' alt="logo" className=" object-contain w-40 h-40" />
          <CardTitle className="text-2xl font-bold text-center pb-3 text-gray-800">TOS System - Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-white/50 border-gray-200">
                          <SelectValue placeholder="Select login type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} className="w-full bg-white/50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="•••••" {...field} className="w-full bg-white/50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && (
                <div className="text-red-500 text-sm mt-2">{serverError}</div>
              )}
              <Button type="submit" className="w-full bg-red-500 hover:bg-gray-700 text-white transition-colors duration-200">
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
