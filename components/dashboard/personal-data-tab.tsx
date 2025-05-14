"use client"

import { PersonalDataManager } from "@/components/dynamic-form/personal-data-manager"

interface PersonalDataTabProps {
  userData: any;
  isLoading: boolean;
}

export function PersonalDataTab({ userData, isLoading }: PersonalDataTabProps) {
  return (
    <div className="space-y-6">
      <PersonalDataManager />
    </div>
  )
}
