import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wildgamingcafe.com';

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gamelibrary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic Event Routes
  try {
    const { data: events } = await supabase
      .from('events')
      .select('id, updated_at, status')
      .eq('status', 'Published');

    if (events) {
      const eventRoutes = events.map((event) => ({
        url: `${baseUrl}/events/${event.id}/register`,
        lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      return [...routes, ...eventRoutes];
    }
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
  }

  return routes;
}
