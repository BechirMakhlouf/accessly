import { Users } from 'lucide-react'

export default function OrganizationsLoading() {
  return (
    <div className='flex justify-center'>
      <div className="min-h-screen bg-background">
        <main className="container py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Loading organizations...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
