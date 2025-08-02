import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowRight,
  Shield,
  Rocket,
  Users,
  Star,
  Check,
  Mountain,
  Target,
  Repeat,
  TrendingUp,
  Code,
  Database,
  Smartphone,
} from "lucide-react"
import { Header } from "@/components/header"

export default function HomePage() {
  const t = useTranslations("landing");

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20" />
          <div className="relative container mx-auto px-4 py-24 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge
                variant="secondary"
                className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 dark:from-orange-900/50 dark:to-red-900/50 dark:text-orange-200"
              >
                <Mountain className="w-3 h-3 mr-1" />
                {t("pushThroughAnyChallenge")}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                {t.rich("turnYourImpossibleIntoInevitable", {
                  impossible: (children) => (
                    <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                      {children}
                    </span>
                  ),
                })}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                {t("heroDescription")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  asChild
                >
                  <Link href="/signup">
                    {t("startYourJourney")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <Link href="#demo">{t("watchDemo")}</Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <Avatar className="w-8 h-8 border-2 border-background">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-background">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-8 h-8 border-2 border-background">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>AL</AvatarFallback>
                    </Avatar>
                  </div>
                  <span>{t("joinBuilders", { count: "10,000+" })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span>{t("ratingSummary", { rating: "4.9/5", reviewsCount: "2,000+" })}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                {t.rich("builtForTheRelentless", {
                  relentless: (children) => (
                    <span className="text-orange-600">{children}</span>
                  ),
                })}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("featuresDescription")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t("features.lightningFastSetup.title")}</h3>
                  <p className="text-muted-foreground">{t("features.lightningFastSetup.description")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                    <Repeat className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t("features.automateTheGrind.title")}</h3>
                  <p className="text-muted-foreground">{t("features.automateTheGrind.description")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-6">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t("features.progressTracking.title")}</h3>
                  <p className="text-muted-foreground">{t("features.progressTracking.description")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t("features.enterpriseSecurity.title")}</h3>
                  <p className="text-muted-foreground">{t("features.enterpriseSecurity.description")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-6">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t("features.teamCollaboration.title")}</h3>
                  <p className="text-muted-foreground">{t("features.teamCollaboration.description")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-6">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t("features.smartAnalytics.title")}</h3>
                  <p className="text-muted-foreground">{t("features.smartAnalytics.description")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                {t.rich("builtOnModernFoundations", {
                  modern: (children) => <span className="text-orange-600">{children}</span>,
                })}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("techStackDescription")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("techStack.nextjs.title")}</h3>
                <p className="text-muted-foreground">{t("techStack.nextjs.description")}</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("techStack.supabase.title")}</h3>
                <p className="text-muted-foreground">{t("techStack.supabase.description")}</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("techStack.tailwind.title")}</h3>
                <p className="text-muted-foreground">{t("techStack.tailwind.description")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                {t.rich("lovedByBuilders", {
                  builders: (children) => <span className="text-orange-600">{children}</span>,
                })}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("testimonialsDescription")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  stars: 5,
                  quote: t("testimonials.sarahJohnson.quote"),
                  name: "Sarah Johnson",
                  role: t("testimonials.sarahJohnson.role"),
                  avatarFallback: "SJ",
                },
                {
                  stars: 5,
                  quote: t("testimonials.marcusRodriguez.quote"),
                  name: "Marcus Rodriguez",
                  role: t("testimonials.marcusRodriguez.role"),
                  avatarFallback: "MR",
                },
                {
                  stars: 5,
                  quote: t("testimonials.alexLiu.quote"),
                  name: "Alex Liu",
                  role: t("testimonials.alexLiu.role"),
                  avatarFallback: "AL",
                },
              ].map(({ stars, quote, name, role, avatarFallback }, i) => (
                <Card className="border-0 shadow-lg" key={i}>
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">{quote}</p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-muted-foreground">{role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                {t.rich("simplePricing", {
                  pricing: (children) => <span className="text-orange-600">{children}</span>,
                })}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("pricingDescription")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-orange-200 transition-colors">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{t("pricing.starter.title")}</h3>
                  <p className="text-muted-foreground mb-6">{t("pricing.starter.subtitle")}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{t("pricing.starter.price")}</span>
                    <span className="text-muted-foreground">{t("pricing.starter.priceSuffix")}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.starter.features.projects")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.starter.features.templates")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.starter.features.communitySupport")}</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/signup">{t("pricing.starter.cta")}</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500 relative hover:border-orange-600 transition-colors">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white">{t("pricing.pro.badge")}</Badge>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{t("pricing.pro.title")}</h3>
                  <p className="text-muted-foreground mb-6">{t("pricing.pro.subtitle")}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{t("pricing.pro.price")}</span>
                    <span className="text-muted-foreground">{t("pricing.pro.priceSuffix")}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.pro.features.unlimitedProjects")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.pro.features.premiumTemplates")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.pro.features.teamCollaboration")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.pro.features.prioritySupport")}</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    asChild
                  >
                    <Link href="/signup">{t("pricing.pro.cta")}</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-orange-200 transition-colors">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{t("pricing.enterprise.title")}</h3>
                  <p className="text-muted-foreground mb-6">{t("pricing.enterprise.subtitle")}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{t("pricing.enterprise.price")}</span>
                    <span className="text-muted-foreground">{t("pricing.enterprise.priceSuffix")}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.enterprise.features.everythingPro")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.enterprise.features.customIntegrations")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.enterprise.features.dedicatedSupport")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{t("pricing.enterprise.features.slaGuarantee")}</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/contact">{t("pricing.enterprise.cta")}</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t("cta.readyToPushYourBoulder")}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t("cta.joinBuilders")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  asChild
                >
                  <Link href="/signup">
                    {t("cta.startYourJourney")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <Link href="/contact">{t("cta.talkToSales")}</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                {t("cta.trialInfo")}
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {t("footer.brand")}
                  </span>
                </div>
                <p className="text-muted-foreground">{t("footer.tagline")}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">{t("footer.product")}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/features" className="hover:text-foreground">
                      {t("footer.features")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-foreground">
                      {t("footer.pricing")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="hover:text-foreground">
                      {t("footer.documentation")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/changelog" className="hover:text-foreground">
                      {t("footer.changelog")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/about" className="hover:text-foreground">
                      {t("footer.about")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-foreground">
                      {t("footer.blog")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="hover:text-foreground">
                      {t("footer.careers")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-foreground">
                      {t("footer.contact")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/help" className="hover:text-foreground">
                      {t("footer.helpCenter")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/community" className="hover:text-foreground">
                      {t("footer.community")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/status" className="hover:text-foreground">
                      {t("footer.status")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-foreground">
                      {t("footer.privacy")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">{t("footer.copyright", { year: 2024 })}</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  {t("footer.terms")}
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  {t("footer.privacy")}
                </Link>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                  {t("footer.cookies")}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
