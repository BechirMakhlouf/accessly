import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, Users, Settings } from 'lucide-react';

export default function BoardAccessablesPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Accessables</h1>
          <p className='text-muted-foreground mt-2'>
            Manage what can be accessed through this board
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add Accessable
        </Button>
      </div>

      <div className='grid gap-6'>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* Placeholder accessable cards */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Project Files
                </CardTitle>
                <Badge variant='secondary'>Active</Badge>
              </div>
              <CardDescription>
                Access to project documentation and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm'>
                  <Users className='h-4 w-4' />
                  <span>5 members</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <Settings className='h-4 w-4' />
                  <span>3 permissions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Code Repository
                </CardTitle>
                <Badge variant='outline'>Inactive</Badge>
              </div>
              <CardDescription>
                Git repository access and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm'>
                  <Users className='h-4 w-4' />
                  <span>2 members</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <Settings className='h-4 w-4' />
                  <span>1 permission</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-dashed'>
            <CardHeader>
              <CardTitle className='text-muted-foreground flex items-center gap-2'>
                <Plus className='h-5 w-5' />
                Add New Accessable
              </CardTitle>
              <CardDescription>
                Create a new accessable resource
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                <Plus className='mr-2 h-4 w-4' />
                Add Accessable
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='rounded-lg border p-6'>
          <h2 className='text-xl font-semibold mb-4'>Overview</h2>
          <p className='text-muted-foreground'>
            Accessables define what resources and permissions are available
            through this board. You can manage access controls, member
            permissions, and resource availability here.
          </p>
        </div>
      </div>
    </div>
  );
}
