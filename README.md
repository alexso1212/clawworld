# Clawworld

Clawworld is a Phaser + React simulation interface for OpenClaw.

The current default experience is a `ClawLibrary`-style living pixel archive with upstream-inspired rooms, animated patrol actors, asset previews, and runtime cards. The older office/task-world prototype is still in the repo and can be opened with `?mode=office`.

## Modes

- Default: `ClawLibrary` archive shell
- Office fallback: `/?mode=office`
- Local gateway polling: `/?transport=gateway`

`?transport=gateway` is intentionally local-only. On deployed non-local hosts, the app falls back to mock/demo mode unless `window.__CLAWWORLD_ENABLE_GATEWAY__ = true` is set explicitly.

## Local Development

```bash
npm install
npm test
npm run build
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Deployment

This repo now builds as a static Vite app and is ready for GitHub-hosted source control plus Vercel deployment.

### GitHub

1. Create a new GitHub repository.
2. Add it as the remote for this repo.
3. Push `main`.

Example:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Vercel

The repository includes [`vercel.json`](/Users/alex/Clawworld/vercel.json), so Vercel can build it directly:

1. Import the GitHub repository into Vercel.
2. Keep the default install command (`npm install`).
3. Keep the default build command (`npm run build`).
4. Deploy.

This produces a static demo deployment of the archive shell.

## Live OpenClaw Notes

- Browser event hydration still works if a host page injects `window.__CLAWWORLD_BOOT_SESSION__` or dispatches `clawworld:session`.
- The built-in `/api/openclaw/sessions` relay only exists in local Vite dev/preview, because it shells out to `openclaw gateway call sessions.list`.
- If you want live hosted gateway mode later, add a real backend or serverless API instead of relying on the local Vite middleware.

## CI

GitHub Actions now runs:

- `npm test`
- `npm run build`

That gives you a green baseline before wiring up preview deploys.
