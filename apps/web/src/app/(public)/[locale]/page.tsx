import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Database } from 'lucide-react';
import {
  Shield,
  Search,
  Settings,
  BarChart3,
  Cloud,
  Key,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  Lock,
  Eye,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';

export default function LandingPage() {
  const features = [
    {
      icon: Search,
      title: 'Discovery',
      description:
        'Automatically discover and catalog all digital resources across your organization',
      color: 'bg-primary',
    },
    {
      icon: Shield,
      title: 'Governance',
      description:
        'Enforce policies and compliance standards across all access points',
      color: 'bg-green-500 dark:bg-green-600',
    },
    {
      icon: Settings,
      title: 'Provisioning',
      description:
        'Streamline access requests and approvals with automated workflows',
      color: 'bg-purple-500 dark:bg-purple-600',
    },
    {
      icon: BarChart3,
      title: 'Audit',
      description:
        'Complete visibility and reporting on all access activities and changes',
      color: 'bg-orange-500 dark:bg-orange-600',
    },
  ];

  const resources = [
    { icon: Cloud, label: 'Cloud Accounts' },
    { icon: Workflow, label: 'SaaS Apps' },
    { icon: Key, label: 'API Keys' },
    { icon: Database, label: 'Databases' },
    { icon: Users, label: 'Employee Perks' },
    { icon: Eye, label: 'Training Resources' },
  ];

  const benefits = [
    'Reduce security risks by 90%',
    'Cut access provisioning time by 75%',
    'Achieve 100% compliance visibility',
    'Eliminate shadow IT completely',
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md border-border'>
        <div className='container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary rounded-lg flex items-center justify-center'>
              <Lock className='w-5 h-5 text-primary-foreground' />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent'>
              Accessly
            </span>
          </div>
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href={routes.marketing.features}
              className='text-sm font-medium hover:text-primary transition-colors text-muted-foreground'
            >
              Features
            </Link>
            <Link
              href={routes.landingPage}
              className='text-sm font-medium hover:text-primary transition-colors text-muted-foreground'
            >
              Benefits
            </Link>
            <Link
              href={routes.marketing.pricing}
              className='text-sm font-medium hover:text-primary transition-colors text-muted-foreground'
            >
              Pricing
            </Link>
            <ThemeToggle />
            <Button
              variant='outline'
              size='sm'
              className='border-border bg-transparent'
              asChild
            >
              <Link href={routes.auth.signIn}>Sign In</Link>
            </Button>
            <Button
              size='sm'
              className='bg-primary hover:bg-primary/90'
              asChild
            >
              <Link href={routes.auth.signUp}>Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 lg:py-32'>
        <div className='absolute inset-0 bg-grid-muted [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] -z-10' />
        <div className='container mx-auto px-4 lg:px-6'>
          <div id='hero' className='text-center max-w-4xl mx-auto'>
            <Badge
              variant='secondary'
              className='mb-6 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground'
            >
              <Zap className='w-4 h-4 mr-2' />
              The Future of Access Management
            </Badge>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground'>
              Your{' '}
              <span className='bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent'>
                Single Pane of Glass
              </span>{' '}
              for Access Operations
            </h1>
            <p className='text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed'>
              Centralize discovery, governance, provisioning and audit of every
              digital resource your organization uses. From cloud accounts to
              employee perks.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12'>
              <Button
                size='lg'
                className='bg-primary hover:bg-primary/90 text-lg px-8 py-6 group'
                asChild
              >
                <Link href={routes.auth.signUp}>
                  Start Free Trial
                  <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </Link>
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='text-lg px-8 py-6 bg-transparent border-border'
                asChild
              >
                <Link href={routes.landingPage}>Watch Demo</Link>
              </Button>
            </div>

            {/* Resource Types */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto'>
              {resources.map((resource, index) => (
                <div
                  key={resource.label}
                  className='flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <resource.icon className='w-8 h-8 text-muted-foreground mb-2' />
                  <span className='text-sm font-medium text-muted-foreground text-center'>
                    {resource.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 lg:py-32 bg-card'>
        <div className='container mx-auto px-4 lg:px-6'>
          <div id='features-header' className='text-center mb-16'>
            <h2 className='text-3xl md:text-5xl font-bold mb-6 text-foreground'>
              Complete Access Management
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Four core capabilities that transform how your organization
              manages digital access
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                id={`feature-${index}`}
                className='group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-card'
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardHeader className='text-center pb-4'>
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className='w-8 h-8 text-primary-foreground' />
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground'>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-center text-muted-foreground leading-relaxed'>
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
        id='benefits'
        className='py-20 lg:py-32 bg-gradient-to-br from-background to-muted'
      >
        <div className='container mx-auto px-4 lg:px-6'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            <div id='benefits-content' className='transition-all duration-1000'>
              <h2 className='text-3xl md:text-5xl font-bold mb-6 text-foreground'>
                Transform Your Security Posture
              </h2>
              <p className='text-xl text-muted-foreground mb-8'>
                Organizations using Accessly see immediate improvements in
                security, compliance, and operational efficiency.
              </p>

              <div className='space-y-4 mb-8'>
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className='flex items-center space-x-3 transition-all duration-500'
                    style={{ transitionDelay: `${index * 100 + 300}ms` }}
                  >
                    <CheckCircle className='w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0' />
                    <span className='text-lg font-medium text-muted-foreground'>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                size='lg'
                className='bg-primary hover:bg-primary/90 text-lg px-8 py-6'
                asChild
              >
                <Link href={routes.landingPage}>See How It Works</Link>
              </Button>
            </div>

            <div id='benefits-visual' className='transition-all duration-1000'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-primary to-primary rounded-3xl blur-3xl opacity-20 animate-pulse' />
                <Card className='relative bg-card/80 backdrop-blur-sm border-0 shadow-2xl'>
                  <CardContent className='p-8'>
                    <div className='space-y-6'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-muted-foreground'>
                          Security Score
                        </span>
                        <Badge
                          variant='secondary'
                          className='bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        >
                          Excellent
                        </Badge>
                      </div>
                      <div className='w-full bg-muted rounded-full h-3'>
                        <div className='bg-gradient-to-r from-green-500 to-primary h-3 rounded-full w-[92%] animate-pulse' />
                      </div>
                      <div className='grid grid-cols-2 gap-4 pt-4'>
                        <div className='text-center'>
                          <div className='text-2xl font-bold text-foreground'>
                            2,847
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            Resources Managed
                          </div>
                        </div>
                        <div className='text-center'>
                          <div className='text-2xl font-bold text-foreground'>
                            99.9%
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            Compliance Rate
                          </div>
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
      <section className='py-20 lg:py-32 bg-gradient-to-r from-primary via-primary to-primary text-primary-foreground'>
        <div className='container mx-auto px-4 lg:px-6'>
          <div
            id='cta'
            className='text-center max-w-4xl mx-auto transition-all duration-1000'
          >
            <h2 className='text-3xl md:text-5xl font-bold mb-6'>
              Ready to Secure Your Digital Future?
            </h2>
            <p className='text-xl mb-8 opacity-90'>
              Join hundreds of organizations already using Accessly to transform
              their access management.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8'>
              <Input
                type='email'
                placeholder='Enter your work email'
                className='max-w-sm bg-background/10 border-background/20 text-primary-foreground placeholder:text-primary-foreground/70 focus:bg-background/20'
              />
              <Button
                size='lg'
                className='bg-background text-primary hover:bg-muted font-semibold px-8'
                asChild
              >
                <Link href={routes.auth.signUp}>Start Free Trial</Link>
              </Button>
            </div>

            <p className='text-sm opacity-75'>
              No credit card required • 14-day free trial • Setup in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-card text-card-foreground py-16 border-t border-border'>
        <div className='container mx-auto px-4 lg:px-6'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary rounded-lg flex items-center justify-center'>
                  <Lock className='w-5 h-5 text-primary-foreground' />
                </div>
                <span className='text-xl font-bold'>Accessly</span>
              </div>
              <p className='text-muted-foreground mb-4'>
                The single pane of glass for access management and operations.
              </p>
            </div>

            <div>
              <h3 className='font-semibold mb-4'>Product</h3>
              <ul className='space-y-2 text-muted-foreground'>
                <li>
                  <Link
                    href={routes.marketing.features}
                    className='hover:text-foreground transition-colors'
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.marketing.pricing}
                    className='hover:text-foreground transition-colors'
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className='hover:text-foreground transition-colors'
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className='hover:text-foreground transition-colors'
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-4'>Company</h3>
              <ul className='space-y-2 text-muted-foreground'>
                <li>
                  <Link
                    href={routes.marketing.about}
                    className='hover:text-foreground transition-colors'
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className='hover:text-foreground transition-colors'
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.marketing.blog}
                    className='hover:text-foreground transition-colors'
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.marketing.contact}
                    className='hover:text-foreground transition-colors'
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-4'>Resources</h3>
              <ul className='space-y-2 text-muted-foreground'>
                <li>
                  <Link
                    href={routes.marketing.docs}
                    className='hover:text-foreground transition-colors'
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className='hover:text-foreground transition-colors'
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className='hover:text-foreground transition-colors'
                  >
                    Status
                  </Link>
                </li>
                <li>
                  <Link
                    href={routes.landingPage}
                    className='hover:text-foreground transition-colors'
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-border mt-12 pt-8 text-center text-muted-foreground'>
            <p>
              &copy; {new Date().getFullYear()} Accessly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
