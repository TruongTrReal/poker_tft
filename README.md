# Poker Tactics Player Draft

Static player-facing draft UI for a poker variant with TFT-style upgrade cards.

## Run locally

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Deploy

This app is static and serverless: `index.html`, `styles.css`, `app.js`, and `assets/`.

### Vercel

1. Import this repository into Vercel.
2. Framework preset: `Other`.
3. Build command: leave empty.
4. Output directory: leave empty.
5. Deploy.

### Netlify

1. Import this repository into Netlify.
2. Build command: leave empty.
3. Publish directory: `.`.
4. Deploy.

### GitHub Pages

1. Push this folder to a GitHub repository.
2. In repository settings, enable Pages from the main branch root.
3. Open the generated Pages URL.

## Data model

Player name, current draft, selected cards, and sound preference are saved in each browser with `localStorage`.
Everyone can use the same public URL, but each device keeps its own local draft state.

The host controls in this static build also live in the same browser state:

- The host can set the next round's Silver / Gold / Diamond rates.
- Generated offers in the same round avoid repeating the exact same 3-card set.
- A card selected in one round is blocked from appearing in the next round.

For one host to control every player's phone in real time, add a shared room backend such as Supabase, Firebase, or Cloudflare Durable Objects.
