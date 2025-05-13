"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/date-picker"
import { useToast } from "@/hooks/use-toast"
import { saveUserData } from "@/lib/data-service"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

// Define the schema for academic qualifications
const qualificationSchema = z.object({
  degree: z.string().min(1, { message: "Degree is required" }),
  institution: z.string().min(1, { message: "Institution is required" }),
  fieldOfStudy: z.string().min(1, { message: "Field of study is required" }),
  yearCompleted: z.string().regex(/^\d{4}$/, { message: "Please enter a valid year (YYYY)" }),
})

// Define the schema for research publications
const publicationSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  journalConference: z.string().min(1, { message: "Journal or conference name is required" }),
  year: z.string().regex(/^\d{4}$/, { message: "Please enter a valid year (YYYY)" }),
  coAuthors: z.string().optional(),
  doiUrl: z.string().optional(),
})

// Define the schema for teaching experience
const teachingExperienceSchema = z.object({
  courseName: z.string().min(1, { message: "Course name is required" }),
  courseCode: z.string().min(1, { message: "Course code is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  yearsTaught: z.string().min(1, { message: "Years taught is required" }),
  averageStudents: z.string().regex(/^\d+$/, { message: "Please enter a valid number" }).optional(),
  description: z.string().optional(),
})

// Define the main form schema
const lecturerFormSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  department: z.string().min(1, { message: "Department is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  dateOfJoining: z.date({ required_error: "Date of joining is required" }),

  // Academic Qualifications (array)
  qualifications: z.array(qualificationSchema).min(1, { message: "At least one qualification is required" }),

  // Research Publications (array)
  publications: z.array(publicationSchema),

  // Teaching Experience (array)
  teachingExperience: z.array(teachingExperienceSchema),

  // Additional Information
  researchInterests: z.string().optional(),
  awards: z.string().optional(),
  professionalMemberships: z.string().optional(),
  additionalNotes: z.string().optional(),
})

// Type for our form values
type LecturerFormValues = z.infer<typeof lecturerFormSchema>

export default function LecturerDataForm() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values
  const form = useForm<LecturerFormValues>({
    resolver: zodResolver(lecturerFormSchema),
    defaultValues: {
      fullName: "",
      employeeId: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      dateOfJoining: undefined,
      qualifications: [{ degree: "", institution: "", fieldOfStudy: "", yearCompleted: "" }],
      publications: [],
      teachingExperience: [],
      researchInterests: "",
      awards: "",
      professionalMemberships: "",
      additionalNotes: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: LecturerFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to submit data.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save the lecturer data
      await saveUserData(user.id, { lecturerData: data })

      toast({
        title: "Data Saved Successfully",
        description: "Lecturer information has been saved.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving lecturer data:", error)
      toast({
        variant: "destructive",
        title: "Error Saving Data",
        description: "There was a problem saving the lecturer information. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a new qualification field
  const addQualification = () => {
    const currentQualifications = form.getValues("qualifications")
    form.setValue("qualifications", [
      ...currentQualifications,
      { degree: "", institution: "", fieldOfStudy: "", yearCompleted: "" },
    ])
  }

  // Remove a qualification field
  const removeQualification = (index: number) => {
    const currentQualifications = form.getValues("qualifications")
    if (currentQualifications.length > 1) {
      form.setValue(
        "qualifications",
        currentQualifications.filter((_, i) => i !== index),
      )
    }
  }

  // Add a new publication field
  const addPublication = () => {
    const currentPublications = form.getValues("publications")
    form.setValue("publications", [
      ...currentPublications,
      { title: "", journalConference: "", year: "", coAuthors: "", doiUrl: "" },
    ])
  }

  // Remove a publication field
  const removePublication = (index: number) => {
    const currentPublications = form.getValues("publications")
    form.setValue(
      "publications",
      currentPublications.filter((_, i) => i !== index),
    )
  }

  // Add a new teaching experience field
  const addTeachingExperience = () => {
    const currentExperiences = form.getValues("teachingExperience")
    form.setValue("teachingExperience", [
      ...currentExperiences,
      { courseName: "", courseCode: "", level: "", yearsTaught: "", averageStudents: "", description: "" },
    ])
  }

  // Remove a teaching experience field
  const removeTeachingExperience = (index: number) => {
    const currentExperiences = form.getValues("teachingExperience")
    form.setValue(
      "teachingExperience",
      currentExperiences.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to dashboard</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lecturer Data Entry</h1>
          <p className="text-muted-foreground">Enter comprehensive information about the lecturer</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="qualifications">Academic Qualifications</TabsTrigger>
              <TabsTrigger value="publications">Research Publications</TabsTrigger>
              <TabsTrigger value="teaching">Teaching Experience</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Enter the lecturer's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. John Smith" {...field} />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <FormField
                    control={form.control}
                    name="dateOfJoining"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Joining</FormLabel>
                        <DatePicker date={field.value} setDate={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="researchInterests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Research Interests</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Machine Learning, Artificial Intelligence, Data Science, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List the lecturer's main research interests and areas of expertise
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Academic Qualifications Tab */}
            <TabsContent value="qualifications">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Qualifications</CardTitle>
                  <CardDescription>Enter the lecturer's academic degrees and qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {form.watch("qualifications").map((_, index) => (
                    <div key={index} className="p-4 border rounded-md relative">
                      <div className="absolute right-2 top-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQualification(index)}
                          disabled={form.watch("qualifications").length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove qualification</span>
                        </Button>
                      </div>

                      <h3 className="font-medium mb-4">Qualification {index + 1}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`qualifications.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
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
                                  <SelectItem value="diploma">Diploma</SelectItem>
                                  <SelectItem value="certificate">Certificate</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`qualifications.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="Harvard University" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`qualifications.${index}.fieldOfStudy`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field of Study</FormLabel>
                              <FormControl>
                                <Input placeholder="Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`qualifications.${index}.yearCompleted`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year Completed</FormLabel>
                              <FormControl>
                                <Input placeholder="2015" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full" onClick={addQualification}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Qualification
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Research Publications Tab */}
            <TabsContent value="publications">
              <Card>
                <CardHeader>
                  <CardTitle>Research Publications</CardTitle>
                  <CardDescription>Enter the lecturer's research publications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {form.watch("publications").length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">No publications added yet. Add a publication below.</p>
                    </div>
                  )}

                  {form.watch("publications").map((_, index) => (
                    <div key={index} className="p-4 border rounded-md relative">
                      <div className="absolute right-2 top-2">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removePublication(index)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove publication</span>
                        </Button>
                      </div>

                      <h3 className="font-medium mb-4">Publication {index + 1}</h3>

                      <FormField
                        control={form.control}
                        name={`publications.${index}.title`}
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Publication Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Title of the research paper or book" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`publications.${index}.journalConference`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Journal/Conference</FormLabel>
                              <FormControl>
                                <Input placeholder="IEEE Transactions on..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`publications.${index}.year`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Publication Year</FormLabel>
                              <FormControl>
                                <Input placeholder="2022" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`publications.${index}.coAuthors`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Co-Authors</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe, John Smith" {...field} />
                              </FormControl>
                              <FormDescription>Comma-separated list of co-authors</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`publications.${index}.doiUrl`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>DOI/URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://doi.org/..." {...field} />
                              </FormControl>
                              <FormDescription>Digital Object Identifier or URL</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full" onClick={addPublication}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Publication
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teaching Experience Tab */}
            <TabsContent value="teaching">
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Experience</CardTitle>
                  <CardDescription>Enter the lecturer's teaching experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {form.watch("teachingExperience").length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">No teaching experience added yet. Add a course below.</p>
                    </div>
                  )}

                  {form.watch("teachingExperience").map((_, index) => (
                    <div key={index} className="p-4 border rounded-md relative">
                      <div className="absolute right-2 top-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTeachingExperience(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove course</span>
                        </Button>
                      </div>

                      <h3 className="font-medium mb-4">Course {index + 1}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`teachingExperience.${index}.courseName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Introduction to Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`teachingExperience.${index}.courseCode`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Code</FormLabel>
                              <FormControl>
                                <Input placeholder="CS101" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`teachingExperience.${index}.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Level</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                  <SelectItem value="graduate">Graduate</SelectItem>
                                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                                  <SelectItem value="doctoral">Doctoral</SelectItem>
                                  <SelectItem value="professional">Professional</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`teachingExperience.${index}.yearsTaught`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years Taught</FormLabel>
                              <FormControl>
                                <Input placeholder="2018-2022" {...field} />
                              </FormControl>
                              <FormDescription>Range or specific years</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`teachingExperience.${index}.averageStudents`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Average Number of Students</FormLabel>
                              <FormControl>
                                <Input placeholder="50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`teachingExperience.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Course Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of the course content and teaching methods"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full" onClick={addTeachingExperience}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Teaching Experience
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Enter any additional relevant information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="awards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Awards and Honors</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any teaching or research awards received"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="professionalMemberships"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Memberships</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any professional organizations or societies"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any other relevant information" className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Save Lecturer Data"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
