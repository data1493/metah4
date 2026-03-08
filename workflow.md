# Metah4 Dev Workflow

## 1. Run Dev Server

```bash
npm run dev
```

Opens at http://localhost:5173

## 2. Test Search

- Type any query into the search box
- Click GO or press Enter
- Check browser console for proxy debug logs:
	- `Proxy response status:`
	- `Proxy response data:`
- Badge indicates `hashed on device + proxied anonymously`

## 3. Current Known Behavior

- Frontend hashes query with SHA-256 before sending.
- Frontend sends hash to Cloudflare proxy.
- Proxy currently forwards the hash directly to Brave.
- Brave returns results for the hash literal, not the original human query.
- Backend decryption/translation logic is in progress.

## 4. Git Push After Changes

```bash
git add -p
git commit -m "your message"
git push
```

Never commit `.env` — it is gitignored.

## 5. Backend Milestone In Progress

Current backend goal:

- Receive hashed payload from frontend.
- Perform controlled server-side recovery/decryption/translation to a searchable term.
- Call Brave with the recovered query.
- Return normal search results to frontend.
