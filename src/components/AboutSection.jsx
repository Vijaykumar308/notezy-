
export function AboutSection({ user }) {
    return (
      <div className="p-4 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
            <p className="text-gray-600">{user.bio}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Member Since</h3>
            <p className="text-gray-600">{user.joinDate}</p>
          </div>
          
          {user.location && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{user.location}</p>
            </div>
          )}
          
          {user.website && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Website</h3>
              <a href={user.website} className="text-blue-600 hover:underline">
                {user.website}
              </a>
            </div>
          )}
          
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  