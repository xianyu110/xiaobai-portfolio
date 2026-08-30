import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { apiGet } from '@/lib/api-client';
import { m } from '@/paraglide/messages.js';

import { SettingsForm } from './-settings-form';

function SettingsPage() {
  const { data: user } = useQuery({
    queryKey: ['user-info'],
    queryFn: async () => {
      const data = await apiGet<{
        name?: string;
        email?: string;
        image?: string;
      }>('/api/user/info');
      return {
        name: data.name || '',
        email: data.email || '',
        image: data.image || '',
      };
    },
  });

  if (!user) {
    return (
      <div className="text-muted-foreground p-6">
        {m['settings.profile.loading']()}
      </div>
    );
  }

  return (
    <SettingsForm name={user.name} email={user.email} image={user.image} />
  );
}

export const Route = createFileRoute('/settings/profile')({
  component: SettingsPage,
});
