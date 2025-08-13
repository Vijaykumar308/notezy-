import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function VisibilitySelector({ value, onValueChange, disabled = false }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Visibility</h3>
      <RadioGroup 
        value={value} 
        onValueChange={onValueChange} 
        className="flex items-center space-x-4"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="public" disabled={disabled} />
          <Label 
            htmlFor="public" 
            className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            Public
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="private" id="private" disabled={disabled} />
          <Label 
            htmlFor="private" 
            className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            Private
          </Label>
        </div>
      </RadioGroup>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {value === 'public' 
          ? 'Visible to everyone' 
          : 'Only visible to you'}
      </p>
    </div>
  )
}