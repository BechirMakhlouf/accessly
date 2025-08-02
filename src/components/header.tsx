"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { SupabaseCSRClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, UserIcon, Settings, Menu, X } from "lucide-react"
import { signOut } from "@/lib/auth/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { routes } from "@/lib/routes"
import { useTranslations } from 'next-intl'
import LocaleSwitcher from "./locale-switcher"

export function Header() {
  const t = useTranslations('Header')
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = SupabaseCSRClient;

  useEffect(() => {
    // Get initial user
    // const getUser = async () => {
    //   const {
    //     data: { user },
    //   } = await supabase.auth.getUser()
    //   setUser(user)
    //   setIsLoading(false)
    // }
    //
    // getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getInitials = (user: User) => {
    const firstName = user.user_metadata?.first_name || ""
    const lastName = user.user_metadata?.last_name || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"
  }

  const getUserDisplayName = (user: User) => {
    const firstName = user.user_metadata?.first_name
    const lastName = user.user_metadata?.last_name
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    return user.email || t('userDefaultName')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={routes.landingPage} className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href={routes.marketing.features} className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.features')}
          </Link>
          <Link href={routes.marketing.pricing} className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.pricing')}
          </Link>
          <Link href={routes.marketing.docs} className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.docs')}
          </Link>
          <Link href={routes.marketing.blog} className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.blog')}
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href={routes.protected.app.root}>{t('auth.app')}</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={t('auth.profileAlt')} />
                      <AvatarFallback className="text-xs">{getInitials(user)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName(user)}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={routes.protected.app.root} className="cursor-pointer md:hidden">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('dropdown.dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={routes.protected.app.root} className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>{t('dropdown.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={routes.protected.app.root} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('dropdown.settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('dropdown.signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href={routes.auth.signIn}>
                  {t('auth.signIn')}
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                <Link href={routes.auth.signUp}>
                  {t('auth.getStarted')}
                </Link>
              </Button>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Locale Switcher  */}
          <LocaleSwitcher />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t('mobileMenu.close') : t('mobileMenu.open')}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link
                href={routes.marketing.features}
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.features')}
              </Link>
              <Link
                href={routes.marketing.pricing}
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.pricing')}
              </Link>
              <Link
                href={routes.marketing.docs}
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.docs')}
              </Link>
              <Link
                href={routes.marketing.blog}
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.blog')}
              </Link>
            </nav>

            {/* Mobile Auth */}
            {user ? (
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={t('auth.profileAlt')} />
                      <AvatarFallback className="text-xs">{getInitials(user)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{getUserDisplayName(user)}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
                <Link
                  href={routes.protected.app.root}
                  className="flex items-center space-x-2 text-sm py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('dropdown.dashboard')}</span>
                </Link>
                <Link
                  href={routes.protected.app.root}
                  className="flex items-center space-x-2 text-sm py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{t('dropdown.profile')}</span>
                </Link>
                <Link
                  href={routes.protected.app.root}
                  className="flex items-center space-x-2 text-sm py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('dropdown.settings')}</span>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 text-sm py-2 text-destructive hover:text-destructive/80 transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('dropdown.signOut')}</span>
                </button>
              </div>
            ) : (
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('mobileMenu.theme')}</span>
                  <ThemeToggle />
                </div>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href={routes.auth.signIn} onClick={() => setIsMobileMenuOpen(false)}>
                    {t('auth.signIn')}
                  </Link>
                </Button>
                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <Link href={routes.auth.signUp} onClick={() => setIsMobileMenuOpen(false)}>
                    {t('auth.getStarted')}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
