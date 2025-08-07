"use client"
import { NoteForm } from "@/components/NoteForm"
import { TagManagement } from "@/components/TagManagement"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <NoteForm />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <TagManagement />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
