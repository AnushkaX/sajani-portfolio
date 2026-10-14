# Sajani Muthusinghe

Fashion portfolio built with Next.js. Projects and contact messages can be stored in Supabase so the site can run on Vercel.

## Run locally

```bash
npm ci
```

Copy `.env.example` to `.env.local` and set `ADMIN_SECRET`.

```bash
npm run dev
```

- Site: http://localhost:9002
- Admin: http://localhost:9002/admin

Without Supabase environment variables, projects are read from `data/projects.json` and contact messages are saved to `data/messages.json`.

## Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql`.
3. In Project Settings → API, copy the project URL and the `service_role` key into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Load the current projects:

```bash
npm run seed
```

The service role key bypasses row level security. Keep it on the server only. Do not prefix it with `NEXT_PUBLIC_`.

Admin image, video, and CV uploads go to the public `project-images` storage bucket. Video files are uploaded directly to Supabase with a short-lived signed URL, so they do not pass through Vercel's request-size limit. The supported video formats are MP4, WEBM, OGG, and MOV, with a 100MB limit. Existing lookbook photos in `public/images` stay in the repo and deploy with the site.

The hero banner accepts multiple images and videos under **Admin → Site details**. Project galleries accept the same media from each project editor. Re-run `supabase/schema.sql` after pulling this feature so the storage bucket allows video MIME types and the larger file limit.

## Vercel

1. Import this repository at [vercel.com/new](https://vercel.com/new).
2. Add the same environment variables used in `.env.local`:
   - `ADMIN_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy.

Vercel’s filesystem is read-only, so creating or editing projects in production requires Supabase. After the first deploy, open `/admin` and sign in with `ADMIN_SECRET`.
