"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DataSummary({ data }) {
  if (!data) return <p>No data available</p>

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="research">Research</TabsTrigger>
        <TabsTrigger value="community">Community</TabsTrigger>
        <TabsTrigger value="publications">Publications</TabsTrigger>
        <TabsTrigger value="intellectual">IP Rights</TabsTrigger>
        <TabsTrigger value="recognition">Recognition</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-4">
        {data.personalData ? (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic personal and contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <dt className="font-medium text-sm">Full Name</dt>
                  <dd>{data.personalData.fullName}</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm">Employee ID</dt>
                  <dd>{data.personalData.employeeId}</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm">Email</dt>
                  <dd>{data.personalData.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm">Phone</dt>
                  <dd>{data.personalData.phone}</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm">Department</dt>
                  <dd>{data.personalData.department}</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm">Position</dt>
                  <dd>{data.personalData.position}</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm">Specialization</dt>
                  <dd>{data.personalData.specialization}</dd>
                </div>
                <div>
                  <dt className="font-medium text-sm">Highest Degree</dt>
                  <dd>{data.personalData.highestDegree}</dd>
                </div>
              </dl>
              {data.personalData.bio && (
                <div className="mt-4">
                  <dt className="font-medium text-sm">Biography</dt>
                  <dd className="mt-1">{data.personalData.bio}</dd>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                No personal data available.{" "}
                <a href="/forms/personal" className="text-primary underline">
                  Add now
                </a>
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="research" className="mt-4">
        {data.researchData && data.researchData.length > 0 ? (
          <div className="space-y-4">
            {data.researchData.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>
                    {project.ongoing ? "Ongoing since " : ""}
                    {new Date(project.startDate).toLocaleDateString()}
                    {!project.ongoing && project.endDate && ` to ${new Date(project.endDate).toLocaleDateString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{project.description}</p>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="font-medium text-sm">Role</dt>
                      <dd>{project.role}</dd>
                    </div>
                    {project.fundingSource && (
                      <div>
                        <dt className="font-medium text-sm">Funding Source</dt>
                        <dd>{project.fundingSource}</dd>
                      </div>
                    )}
                    {project.fundingAmount && (
                      <div>
                        <dt className="font-medium text-sm">Funding Amount</dt>
                        <dd>{project.fundingAmount}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium text-sm">Student Involvement</dt>
                      <dd>{project.studentInvolvement ? project.numberOfStudents || "Yes" : "No"}</dd>
                    </div>
                    {project.publicationStatus && (
                      <div>
                        <dt className="font-medium text-sm">Publication Status</dt>
                        <dd>{project.publicationStatus}</dd>
                      </div>
                    )}
                    {project.journalName && (
                      <div>
                        <dt className="font-medium text-sm">Journal/Conference</dt>
                        <dd>{project.journalName}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                No research data available.{" "}
                <a href="/forms/research" className="text-primary underline">
                  Add now
                </a>
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="community" className="mt-4">
        {data.communityServiceData && data.communityServiceData.length > 0 ? (
          <div className="space-y-4">
            {data.communityServiceData.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                No community service data available.{" "}
                <a href="/forms/community-service" className="text-primary underline">
                  Add now
                </a>
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="publications" className="mt-4">
        {data.publicationData && data.publicationData.length > 0 ? (
          <div className="space-y-4">
            {data.publicationData.map((publication, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{publication.title}</CardTitle>
                  <CardDescription>
                    {publication.journal}, {publication.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{publication.authors}</p>
                  {publication.doi && <p className="text-sm">DOI: {publication.doi}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                No publication data available.{" "}
                <a href="/forms/publications" className="text-primary underline">
                  Add now
                </a>
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="intellectual" className="mt-4">
        {data.intellectualPropertyData && data.intellectualPropertyData.length > 0 ? (
          <div className="space-y-4">
            {data.intellectualPropertyData.map((ip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{ip.title}</CardTitle>
                  <CardDescription>
                    {ip.type} - {ip.registrationNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{ip.description}</p>
                  <p className="text-sm mt-2">Filed: {new Date(ip.filingDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                No intellectual property data available.{" "}
                <a href="/forms/intellectual-property" className="text-primary underline">
                  Add now
                </a>
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="recognition" className="mt-4">
        {data.recognitionData && data.recognitionData.length > 0 ? (
          <div className="space-y-4">
            {data.recognitionData.map((recognition, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{recognition.title}</CardTitle>
                  <CardDescription>
                    {recognition.organization}, {recognition.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{recognition.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                No recognition data available.{" "}
                <a href="/forms/recognition" className="text-primary underline">
                  Add now
                </a>
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
