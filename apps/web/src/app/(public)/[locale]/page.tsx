import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  ArrowRight,
  Zap,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-muted'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md border-border'>
        <div className='container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-linear-to-br from-primary to-primary rounded-lg flex items-center justify-center'>
              <Lock className='w-5 h-5 text-primary-foreground' />
            </div>
            <span className='text-xl font-semibold bg-linear-to-r from-primary to-primary bg-clip-text text-transparent'>
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
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-foreground'>
              Your{' '}
              <span className='bg-linear-to-r from-primary via-primary to-primary bg-clip-text text-transparent'>
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

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-card text-card-foreground py-16 border-t border-border'>
        <div className='container mx-auto px-4 lg:px-6'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-8 h-8 bg-linear-to-br from-primary to-primary rounded-lg flex items-center justify-center'>
                  <Lock className='w-5 h-5 text-primary-foreground' />
                </div>
                <span className='text-xl font-semibold'>Accessly</span>
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
