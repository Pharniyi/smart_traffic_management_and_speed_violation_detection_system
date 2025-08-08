import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface UserAvatarProps {
  user: {
    name?: string
    image?: string
  }
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      {user.image ? (
        <AvatarImage alt={user.name || "User"} src={user.image} />
      ) : (
        <AvatarFallback>
          {user.name ? (
            user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          ) : (
            <User className="h-4 w-4" />
          )}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
