import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function VisibilitySelector({ value, onValueChange }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Visibility</h3>
      <RadioGroup value={value} onValueChange={onValueChange} className="space-y-3">
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="public" id="public" className="mt-0.5" />
          <div className="space-y-1">
            <Label htmlFor="public" className="text-sm font-medium text-gray-900">
              Public
            </Label>
            <p className="text-xs text-gray-500">Visible to everyone</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="followers" id="followers" className="mt-0.5" />
          <div className="space-y-1">
            <Label htmlFor="followers" className="text-sm font-medium text-gray-900">
              Followers Only
            </Label>
            <p className="text-xs text-gray-500">Visible only to your followers</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="private" id="private" className="mt-0.5" />
          <div className="space-y-1">
            <Label htmlFor="private" className="text-sm font-medium text-gray-900">
              Private
            </Label>
            <p className="text-xs text-gray-500">Only visible to you</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}