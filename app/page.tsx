import { redirect } from 'next/navigation';

export default async function HomePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = await searchParams;
  const query = new URLSearchParams();
  for (const key of ['category', 'tool']) {
    if (typeof values[key] === 'string') query.set(key, values[key]);
  }
  redirect(`/toolbox.html${query.size ? `?${query}` : ''}`);
}
