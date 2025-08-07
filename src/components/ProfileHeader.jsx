import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"


export function ProfileHeader({ user, isOwnProfile, isFollowing, onFollowToggle }) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      <Avatar className="w-32 h-32 mb-4">
        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
      </Avatar>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
      <p className="text-gray-600 mb-2 max-w-md">{user.bio}</p>
      <p className="text-sm text-gray-500 mb-4">Joined in {user.joinDate}</p>
      
      {!isOwnProfile && (
        <Button 
          variant={isFollowing ? "outline" : "default"}
          onClick={onFollowToggle}
          className="px-6"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      )}
    </div>
  )
}
