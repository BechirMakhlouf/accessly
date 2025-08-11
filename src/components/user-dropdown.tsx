"use client"
import { User, Settings, Command, Monitor, Sun, Moon, LogOut } from "lucide-react"
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface UserDropdownProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onAccountSettings?: () => void
  onCommandMenu?: () => void
  onSignOut?: () => void
}

export default function UserDropdown({
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  onAccountSettings,
  onCommandMenu,
  onSignOut,
}: UserDropdownProps) {
  const { setTheme, theme } = useTheme()

  const handleCommandMenu = () => {
    onCommandMenu?.()
    // Trigger command menu programmatically
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      metaKey: true,
    })
    document.dispatchEvent(event)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              <User className="h-4 w-4 text-foreground" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onAccountSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCommandMenu}>
          <Command className="mr-2 h-4 w-4" />
          <span>Command menu</span>
          <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Theme options moved here */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
