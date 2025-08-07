import { Button } from "@/components/ui/button"

export function ProfileTabs({ activeTab, onTabChange, isOwnProfile }) {
  const tabs = [
    { id: 'notes', label: 'Notes' },
    { id: 'about', label: 'About' }
  ]

  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8 px-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`px-0 py-4 border-b-2 rounded-none ${
              activeTab === tab.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
