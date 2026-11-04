# Deployment (Vercel)

## What is Vercel

[Vercel](https://vercel.com) is a hosting service for websites. You give it your code, and it:

1. **Builds** the app (runs `npm run build`, which turns Vue + TypeScript into plain HTML, CSS and JS).
2. **Hosts** the result on fast servers around the world.
3. **Gives you a URL**, like `n5-xxx.vercel.app`.

The free **Hobby** plan is enough for a personal project like this one.

## How GitHub and Vercel connect

We don't upload files to Vercel by hand. Vercel watches the GitHub repo (`locchh/n5`) and redeploys when the code changes.

```
I push to GitHub  →  GitHub tells Vercel  →  Vercel builds  →  new version is live
```

There are two kinds of deployment:

| I push to… | Vercel makes a… | URL |
|---|---|---|
| `main` | **Production** deployment | The real site, e.g. `n5.vercel.app` |
| Any other branch, or a pull request | **Preview** deployment | Its own test URL. The real site doesn't change. |

Preview URLs let me check a change on my phone before merging it into `main`.

## Basic workflow

Once set up, deploying is just pushing:

1. Change something (for example, add `data/lessons/11.json`).
2. Check it locally: `npm run dev`, open the URL it prints.
3. Commit and push to `main`.
4. Wait about a minute. Vercel builds and the new version is live.

If the build fails, the old version stays online. Nothing breaks for the user.

## First-time setup (once)

Do this after the Vue app exists in the repo (with `package.json` and an `npm run build` script).

1. Go to [vercel.com](https://vercel.com) and **sign up with GitHub**. This lets Vercel see your repos.
2. Click **Add New → Project**.
3. Find `locchh/n5` and click **Import**. If it's not in the list, click **Adjust GitHub App Permissions** and give Vercel access to the repo.
4. Check the build settings. Vercel detects Vite automatically, so the defaults should be right:

   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

5. Click **Deploy**. When it finishes, you get the production URL.
6. On your phone, open the URL and **Add to Home Screen**, so it opens like an app.

## Page links: `vercel.json`

The app has pages like `/lesson/4`. These pages only exist inside the app (Vue Router), not as real files. So if you open `/lesson/4` directly or refresh it, Vercel can't find a file there and shows a 404.

The fix is to tell Vercel: "for any path, send `index.html`, and let the app show the right page". Put this file at the root of the repo:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Guidelines

- **`main` is always deployable.** Only push to `main` what builds and works locally (`npm run build` passes).
- **Bigger changes go on a branch.** Push the branch, open the preview URL on your phone, then merge.
- **Lesson data is code too.** A broken JSON file can break the build, so run the app locally after editing `data/`.
- **No secrets needed.** The app has no login and no API keys, so there are no environment variables to set.
- **Something went wrong in production?** In the Vercel dashboard, open **Deployments**, pick the last good one and use **Instant Rollback**. Then fix the problem calmly on a branch.

## Optional: deploy from the terminal

The [Vercel CLI](https://vercel.com/docs/cli) can deploy without pushing:

```bash
npm i -g vercel   # install once
vercel            # preview deployment
vercel --prod     # production deployment
```

Pushing to GitHub is still the normal way. The CLI is handy for a quick test.
