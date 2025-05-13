"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { saveUserData, getUserData } from "@/lib/data-service"
import { getUserFromStorage } from "@/lib/auth-service"
import { ArrowLeft, User } from "lucide-react"

const personalFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  employeeId: z.string().min(1, { message: "Employee ID is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  department: z.string().min(1, { message: "Department is required." }),
  position: z.string().min(1, { message: "Academic position is required." }),
  specialization: z.string().min(1, { message: "Field of specialization is required." }),
  highestDegree: z.string().min(1, { message: "Highest degree is required." }),
  bio: z.string().optional(),
})

export default function PersonalDataForm() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(personalFormSchema),
    defaultValues: {
      fullName: "",
      employeeId: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      specialization: "",
      highestDegree: "",
      bio: "",
    },
  })

  useEffect(() => {
    // Check if user is logged in
    const storedUser = getUserFromStorage()

    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = storedUser
    setUser(parsedUser)

    // Load existing data if available
    const loadData = async () => {
      try {
        const userData = await getUserData(parsedUser.id)

        if (userData && userData.personalData) {
          form.reset(userData.personalData)
        }
      } catch (error) {
        console.error("Error loading personal data:", error)
      }
    }

    loadData()
  }, [router, form])

  const onSubmit = async (data) => {
    if (!user) return

    setIsLoading(true)

    try {
      await saveUserData(user.id, { personalData: data })

      toast({
        title: "Personal data saved",
        description: "Your personal information has been successfully saved.",
      })

      router.push("/forms/research")
    } catch (error) {
      console.error("Error saving personal data:", error)

      toast({
        variant: "destructive",
        title: "Error saving data",
        description: "There was a problem saving your personal information. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/forms">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to forms</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-6 w-6" />
            Personal Information
          </h1>
          <p className="text-muted-foreground">Provide your basic personal and contact information</p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Please provide your basic personal and contact information</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="EMP12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.smith@university.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="computer_science">Computer Science</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="humanities">Humanities</SelectItem>
                        <SelectItem value="social_sciences">Social Sciences</SelectItem>
                        <SelectItem value="medicine">Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="professor">Professor</SelectItem>
                        <SelectItem value="associate_professor">Associate Professor</SelectItem>
                        <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
                        <SelectItem value="senior_lecturer">Senior Lecturer</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                        <SelectItem value="assistant_lecturer">Assistant Lecturer</SelectItem>
                        <SelectItem value="research_fellow">Research Fellow</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Machine Learning" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="highestDegree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Degree</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="phd">Ph.D.</SelectItem>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief professional biography and research interests"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your academic background and research interests.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/forms">Back</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save & Continue"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
