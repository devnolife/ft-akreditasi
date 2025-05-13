"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/date-picker"
import { useToast } from "@/hooks/use-toast"
import { saveUserData, getUserData } from "@/lib/data-service"

const researchFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  role: z.string().min(1, { message: "Role is required." }),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date().optional(),
  ongoing: z.boolean().default(false),
  fundingSource: z.string().optional(),
  fundingAmount: z.string().optional(),
  studentInvolvement: z.boolean().default(false),
  numberOfStudents: z.string().optional(),
  publicationStatus: z.string().optional(),
  journalName: z.string().optional(),
})

export default function ResearchDataForm() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [researchProjects, setResearchProjects] = useState([])
  const [editingIndex, setEditingIndex] = useState(-1)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(researchFormSchema),
    defaultValues: {
      title: "",
      description: "",
      role: "",
      startDate: undefined,
      endDate: undefined,
      ongoing: false,
      fundingSource: "",
      fundingAmount: "",
      studentInvolvement: false,
      numberOfStudents: "",
      publicationStatus: "",
      journalName: "",
    },
  })

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser")

    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    // Load existing data if available
    const loadData = async () => {
      try {
        const userData = await getUserData(parsedUser.id)

        if (userData && userData.researchData) {
          setResearchProjects(userData.researchData)
        }
      } catch (error) {
        console.error("Error loading research data:", error)
      }
    }

    loadData()
  }, [router])

  const onSubmit = async (data) => {
    if (!user) return

    setIsLoading(true)

    try {
      const updatedProjects = [...researchProjects]

      if (editingIndex >= 0) {
        // Update existing project
        updatedProjects[editingIndex] = data
      } else {
        // Add new project
        updatedProjects.push(data)
      }

      setResearchProjects(updatedProjects)
      await saveUserData(user.id, { researchData: updatedProjects })

      toast({
        title: editingIndex >= 0 ? "Research project updated" : "Research project added",
        description:
          editingIndex >= 0
            ? "Your research project has been updated successfully."
            : "Your research project has been added successfully.",
      })

      // Reset form and editing state
      form.reset({
        title: "",
        description: "",
        role: "",
        startDate: undefined,
        endDate: undefined,
        ongoing: false,
        fundingSource: "",
        fundingAmount: "",
        studentInvolvement: false,
        numberOfStudents: "",
        publicationStatus: "",
        journalName: "",
      })
      setEditingIndex(-1)
    } catch (error) {
      console.error("Error saving research data:", error)

      toast({
        variant: "destructive",
        title: "Error saving data",
        description: "There was a problem saving your research information. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (index) => {
    const project = researchProjects[index]
    form.reset({
      ...project,
      startDate: new Date(project.startDate),
      endDate: project.endDate ? new Date(project.endDate) : undefined,
    })
    setEditingIndex(index)
  }

  const handleDelete = async (index) => {
    if (!user) return

    try {
      const updatedProjects = [...researchProjects]
      updatedProjects.splice(index, 1)
      setResearchProjects(updatedProjects)

      await saveUserData(user.id, { researchData: updatedProjects })

      toast({
        title: "Research project deleted",
        description: "Your research project has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting research project:", error)

      toast({
        variant: "destructive",
        title: "Error deleting project",
        description: "There was a problem deleting your research project. Please try again.",
      })
    }
  }

  const handleCancel = () => {
    form.reset({
      title: "",
      description: "",
      role: "",
      startDate: undefined,
      endDate: undefined,
      ongoing: false,
      fundingSource: "",
      fundingAmount: "",
      studentInvolvement: false,
      numberOfStudents: "",
      publicationStatus: "",
      journalName: "",
    })
    setEditingIndex(-1)
  }

  const handleContinue = () => {
    router.push("/forms/community-service")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Research Data</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Research Projects</h2>
            <p className="text-muted-foreground">
              Add information about your research projects, including funding, student involvement, and publication
              status.
            </p>
          </div>

          {researchProjects.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Research Projects</h3>
              <div className="space-y-4">
                {researchProjects.map((project, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>
                        {project.ongoing ? "Ongoing since " : ""}
                        {new Date(project.startDate).toLocaleDateString()}
                        {!project.ongoing && project.endDate && ` to ${new Date(project.endDate).toLocaleDateString()}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm mb-2">{project.description}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div>
                          <span className="font-medium">Role:</span> {project.role}
                        </div>
                        {project.fundingSource && (
                          <div>
                            <span className="font-medium">Funding:</span> {project.fundingSource}
                          </div>
                        )}
                        {project.fundingAmount && (
                          <div>
                            <span className="font-medium">Amount:</span> {project.fundingAmount}
                          </div>
                        )}
                        {project.studentInvolvement && (
                          <div>
                            <span className="font-medium">Students:</span> {project.numberOfStudents || "Yes"}
                          </div>
                        )}
                        {project.publicationStatus && (
                          <div>
                            <span className="font-medium">Publication:</span> {project.publicationStatus}
                          </div>
                        )}
                        {project.journalName && (
                          <div>
                            <span className="font-medium">Journal:</span> {project.journalName}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                          Delete
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{editingIndex >= 0 ? "Edit Research Project" : "Add Research Project"}</CardTitle>
              <CardDescription>
                {editingIndex >= 0
                  ? "Update the details of your research project"
                  : "Enter details about your research project"}
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Machine Learning for Medical Imaging" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the research project"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="principal_investigator">Principal Investigator</SelectItem>
                            <SelectItem value="co_investigator">Co-Investigator</SelectItem>
                            <SelectItem value="researcher">Researcher</SelectItem>
                            <SelectItem value="advisor">Advisor</SelectItem>
                            <SelectItem value="consultant">Consultant</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <DatePicker date={field.value} setDate={field.onChange} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="ongoing"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Ongoing Project</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {!form.watch("ongoing") && (
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <DatePicker date={field.value} setDate={field.onChange} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fundingSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Source</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., National Science Foundation" {...field} />
                          </FormControl>
                          <FormDescription>Leave blank if not applicable</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fundingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $50,000" {...field} />
                          </FormControl>
                          <FormDescription>Leave blank if not applicable</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="studentInvolvement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Student Involvement</FormLabel>
                            <FormDescription>Check if students were involved in this research</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("studentInvolvement") && (
                      <FormField
                        control={form.control}
                        name="numberOfStudents"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Students</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="publicationStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publication Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select publication status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="in_preparation">In Preparation</SelectItem>
                            <SelectItem value="not_published">Not Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Current status of research publication</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(form.watch("publicationStatus") === "published" ||
                    form.watch("publicationStatus") === "accepted") && (
                    <FormField
                      control={form.control}
                      name="journalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Journal/Conference Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., IEEE Transactions on..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={handleCancel}>
                      {editingIndex >= 0 ? "Cancel" : "Clear"}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : editingIndex >= 0 ? "Update Project" : "Add Project"}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={() => router.push("/forms/personal")}>
                      Previous
                    </Button>
                    <Button type="button" onClick={handleContinue}>
                      Next: Community Service
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </div>
  )
}
