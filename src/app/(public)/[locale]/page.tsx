"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Shield,
  Search,
  Settings,
  BarChart3,
  Cloud,
  Database,
  Key,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  Lock,
  Eye,
  Workflow,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { routes } from "@/lib/routes"

type VisibilityState = {
  hero?: boolean
  "features-header"?: boolean
  "feature-0"?: boolean
  "feature-1"?: boolean
  "feature-2"?: boolean
  "feature-3"?: boolean
  "benefits-content"?: boolean
  "benefits-visual"?: boolean
  cta?: boolean
}

export default function AccesslyLanding() {
  const [isVisible, setIsVisible] = useState({} as VisibilityState)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev: object) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  const features = [
    {
      icon: Search,
      title: "Discovery",
      description: "Automatically discover and catalog all digital resources across your organization",
      color: "bg-blue-500 dark:bg-blue-600",
    },
    {
      icon: Shield,
      title: "Governance",
      description: "Enforce policies and compliance standards across all access points",
      color: "bg-green-500 dark:bg-green-600",
    },
    {
      icon: Settings,
      title: "Provisioning",
      description: "Streamline access requests and approvals with automated workflows",
      color: "bg-purple-500 dark:bg-purple-600",
    },
    {
      icon: BarChart3,
      title: "Audit",
      description: "Complete visibility and reporting on all access activities and changes",
      color: "bg-orange-500 dark:bg-orange-600",
    },
  ]

  const resources = [
    { icon: Cloud, label: "Cloud Accounts" },
    { icon: Workflow, label: "SaaS Apps" },
    { icon: Key, label: "API Keys" },
    { icon: Database, label: "Databases" },
    { icon: Users, label: "Employee Perks" },
    { icon: Eye, label: "Training Resources" },
  ]

  const benefits = [
    "Reduce security risks by 90%",
    "Cut access provisioning time by 75%",
    "Achieve 100% compliance visibility",
    "Eliminate shadow IT completely",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Accessly
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={routes.marketing.features}
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-slate-700 dark:text-slate-300"
            >
              Features
            </Link>
            <Link
              href={routes.landingPage}
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-slate-700 dark:text-slate-300"
            >
              Benefits
            </Link>
            <Link
              href={routes.marketing.pricing}
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-slate-700 dark:text-slate-300"
            >
              Pricing
            </Link>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700 bg-transparent"
              asChild
            >
              <Link href={routes.auth.signIn}>Sign In</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              asChild
            >
              <Link href={routes.auth.signUp}>Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] -z-10" />
        <div className="container mx-auto px-4 lg:px-6">
          <div
            id="hero"
            data-animate
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              The Future of Access Management
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
              Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Single Pane of Glass
              </span>{" "}
              for Access Operations
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Centralize discovery, governance, provisioning and audit of every digital resource your organization uses.
              From cloud accounts to employee perks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 group"
                asChild
              >
                <Link href={routes.auth.signUp}>
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent border-slate-200 dark:border-slate-700"
                asChild
              >
                <Link href={routes.landingPage}>Watch Demo</Link>
              </Button>
            </div>

            {/* Resource Types */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {resources.map((resource, index) => (
                <div
                  key={resource.label}
                  className={`flex flex-col items-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <resource.icon className="w-8 h-8 text-slate-600 dark:text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                    {resource.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 lg:px-6">
          <div
            id="features-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${isVisible["features-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Complete Access Management
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Four core capabilities that transform how your organization manages digital access
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                id={`feature-${index}`}
                data-animate
                className={`group hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg dark:shadow-slate-900/20 bg-white dark:bg-slate-800 ${isVisible[`feature-${index}` as "feature-1"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              id="benefits-content"
              data-animate
              className={`transition-all duration-1000 ${isVisible["benefits-content"] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Transform Your Security Posture
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                Organizations using Accessly see immediate improvements in security, compliance, and operational
                efficiency.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className={`flex items-center space-x-3 transition-all duration-500 ${isVisible["benefits-content"] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      }`}
                    style={{ transitionDelay: `${index * 100 + 300}ms` }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <span className="text-lg font-medium text-slate-700 dark:text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
                asChild
              >
                <Link href={routes.landingPage}>See How It Works</Link>
              </Button>
            </div>

            <div
              id="benefits-visual"
              data-animate
              className={`transition-all duration-1000 ${isVisible["benefits-visual"] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse" />
                <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl dark:shadow-slate-900/50">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Security Score</span>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        >
                          Excellent
                        </Badge>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full w-[92%] animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">2,847</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Resources Managed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">99.9%</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Compliance Rate</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div
            id="cta"
            data-animate
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Secure Your Digital Future?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of organizations already using Accessly to transform their access management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Input
                type="email"
                placeholder="Enter your work email"
                className="max-w-sm bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 font-semibold px-8" asChild>
                <Link href={routes.auth.signUp}>Start Free Trial</Link>
              </Button>
            </div>

            <p className="text-sm opacity-75">No credit card required • 14-day free trial • Setup in minutes</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16 border-t border-slate-800 dark:border-slate-900">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Accessly</span>
              </div>
              <p className="text-slate-400 dark:text-slate-500 mb-4">
                The single pane of glass for access management and operations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 dark:text-slate-500">
                <li>
                  <Link
                    href={routes.marketing.features}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.marketing.pricing}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 dark:text-slate-500">
                <li>
                  <Link
                    href={routes.marketing.about}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.marketing.blog}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.marketing.contact}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400 dark:text-slate-500">
                <li>
                  <Link
                    href={routes.marketing.docs}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Status
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className="hover:text-white dark:hover:text-slate-300 transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 dark:border-slate-900 mt-12 pt-8 text-center text-slate-400 dark:text-slate-500">
            <p>&copy; {new Date().getFullYear()} Accessly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
