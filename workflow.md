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
	- `Sending encrypted q:`
	- `Proxy status:`
	- `Decrypted query Brave saw:`
- Badge indicates `encrypted on device + proxied anonymously`

## 3. Current Known Behavior

- Frontend encrypts query client-side with libsodium secretbox using a shared secret.
- Frontend sends encrypted payload to Cloudflare proxy.
- Proxy decrypts the query server-side and forwards to Brave.
- Brave returns results for the original human query.
- Provides true privacy: plain-text queries never leave the device.

## 4. Git Push After Changes

```bash
git add -p
git commit -m "your message"
git push
```

Never commit `.env` — it is gitignored.

## 5. Backend Milestone Completed

Current backend implementation:

- Receives encrypted payload from frontend.
- Performs server-side decryption using shared secret.
- Calls Brave with the decrypted query.
- Returns normal search results to frontend.
