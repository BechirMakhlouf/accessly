import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Trash2, AlertTriangle } from 'lucide-react';

export default function BoardSettingsPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-semibold'>Board Settings</h1>
        <p className='text-muted-foreground mt-2'>
          Configure your board settings, permissions, and preferences
        </p>
      </div>

      <div className='grid gap-6'>
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic board configuration and information
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label htmlFor='board-name'>Board Name</Label>
              <Input
                id='board-name'
                placeholder='Enter board name'
                defaultValue='Sample Board'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='board-description'>Board Description</Label>
              <Textarea
                id='board-description'
                placeholder='Enter board description'
                defaultValue='This is a sample board description.'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Switch id='public-board' />
              <Label htmlFor='public-board'>Public Board</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch id='allow-invites' defaultChecked />
              <Label htmlFor='allow-invites'>Allow Invites</Label>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Control what members can do in this board
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label>Members can invite others</Label>
                  <p className='text-sm text-muted-foreground'>
                    Allow members to invite new people to this board
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <Label>Members can edit board</Label>
                  <p className='text-sm text-muted-foreground'>
                    Allow members to modify board settings and content
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <Label>Members can delete board</Label>
                  <p className='text-sm text-muted-foreground'>
                    Allow members to delete this board
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className='border-destructive'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-destructive'>
              <AlertTriangle className='h-5 w-5' />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='rounded-lg border border-destructive/20 bg-destructive/5 p-4'>
                <h4 className='font-medium text-destructive mb-2'>
                  Delete Board
                </h4>
                <p className='text-sm text-muted-foreground mb-4'>
                  Once you delete a board, there is no going back. Please be
                  certain.
                </p>
                <Button variant='destructive' size='sm'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete Board
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className='flex justify-end'>
          <Button>
            <Save className='mr-2 h-4 w-4' />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
