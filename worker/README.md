# Cloudflare Worker Setup

This worker proxies API calls for TrustMRR and FRED, adding CORS headers
and keeping your API keys safe (never exposed to the browser).

## Step-by-step setup

### 1. Get your API keys

- **TrustMRR**: Go to https://trustmrr.com/dashboard-dev and generate a key (starts with `tmrr_`)
- **FRED**: Go to https://fred.stlouisfed.org/docs/api/api_key.html and request a free key

### 2. Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler
```

### 3. Log in to Cloudflare

```bash
wrangler login
```

This opens a browser — sign up or log in (free account).

### 4. Deploy the worker

```bash
cd worker
wrangler deploy
```

It will print your worker URL, something like:
`https://tide-api-proxy.YOUR_ACCOUNT.workers.dev`

### 5. Add your API keys

Go to the Cloudflare dashboard:
1. Workers & Pages → tide-api-proxy → Settings → Variables
2. Add these environment variables (click "Encrypt" for each):

| Variable | Value |
|---|---|
| `TRUSTMRR_API_KEY` | `tmrr_your_key_here` |
| `FRED_API_KEY` | `your_fred_key_here` |
| `ALLOWED_ORIGIN` | `https://jaronwenger.github.io` |

### 6. Tell your site about the worker

Create a `.env` file in the project root:

```
VITE_WORKER_URL=https://tide-api-proxy.YOUR_ACCOUNT.workers.dev
```

For GitHub Pages, add `VITE_WORKER_URL` as a repository secret and
update the deploy workflow to use it during build.

### 7. Test it

```bash
npm start
```

The TrustMRR and FRED sections should now show live data.
