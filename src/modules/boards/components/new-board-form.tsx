"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useBoardMutations } from '../hooks/use-board-mutations';

export function NewBoardForm({ organizationId }: { organizationId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const { createBoard, isCreating } = useBoardMutations();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_url: ''
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = formData.title.trim();
    if (!title) {
  toast.error(t('board.form.errors.titleRequired'));
      return;
    }
    try {
      const result = await createBoard({
        organization_id: organizationId,
        title,
        description: formData.description.trim() || null,
        icon_url: formData.icon_url.trim() || null,
        visibility: 'public'
      });
      if (result?.data) {
  toast.success(t('board.form.success'));
        // If slug exists navigate by slug else fallback maybe board id route (placeholder)
        // router.push(routes.protected.dashboard.board.slug.root(result.data.slug || '')); // adjust when routes ready
      } else {
  toast.error(t('board.form.errors.createFailed'));
      }
    } catch (err) {
      console.error('Error creating board', err);
  toast.error(t('board.form.errors.genericError'));
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('board.form.title')}</CardTitle>
          <CardDescription>{t('board.form.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="board-title">{t('board.form.titleField.label')} *</Label>
              <Input
                id="board-title"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder={t('board.form.titleField.placeholder')}
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {t('board.form.titleField.helpText')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="board-description">{t('board.form.description.label')}</Label>
              <Textarea
                id="board-description"
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder={t('board.form.description.placeholder')}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {t('board.form.description.helpText')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="board-icon-url">{t('board.form.iconUrl.label')}</Label>
              <Input
                id="board-icon-url"
                type="url"
                value={formData.icon_url}
                onChange={e => handleInputChange('icon_url', e.target.value)}
                placeholder={t('board.form.iconUrl.placeholder')}
              />
              <p className="text-xs text-muted-foreground">
                {t('board.form.iconUrl.helpText')}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" disabled={isCreating} onClick={() => router.back()}>
                {t('board.form.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isCreating || !formData.title.trim()} className="flex-1">
                {isCreating ? t('board.form.buttons.creating') : t('board.form.buttons.create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
