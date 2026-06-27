# Poker Tactics Player Draft

Player-facing draft UI for a poker variant with TFT-style upgrade cards.

## Run locally

```sh
python3 server.py
```

The terminal prints two links:

- Player URL: share this with all players on the same Wi-Fi.
- Host URL: open this only on the game master's device.

Keep the terminal running while playing.

## Playing

Games are tuned around 3+ players, each starting with 10 points. Before the first poker hand, the host opens the first draft round so everyone chooses their first core. Interest is assumed to stay capped at 5 points.

Players open the Player URL, enter their name, wait for the host to open a draft round, then choose one of three cards. Each card slot can be rerolled once per draft round. A player's chosen cards stay visible in their own hand.

The host opens the Host URL, clicks `Quản trò`, chooses whether the next round is Silver, Gold, or Diamond, then opens the next draft round. Players cannot open rounds themselves while connected to the server.

The shared server keeps round state in memory:

- Only the Host URL can choose the next card tier and open rounds.
- The host can create a new game, which resets the shared room and all connected players' card state while keeping player names.
- Every offer in a draft round uses one card tier only.
- Some comeback, top-player, and endgame cores are delayed until later rounds so they do not appear before the first poker hand.
- Generated offers in the same round avoid repeating the exact same 3-card set.
- Cards selected during one round are blocked from appearing in the next round.

## Deploy

The full multiplayer version needs a small shared server, so use `server.py` for local Wi-Fi games. Static hosts can still serve the UI, but they will not sync rounds, host controls, or selected-card locks across devices.

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

### Render

Create a Web Service from this repository.

- Runtime: `Python`
- Build Command: `pip install -r requirements.txt`
- Start Command: `python3 server.py`
- Environment Variable: set `HOST_TOKEN` to a private host password, for example `my-secret-host-token`

After deploy:

- Player URL: `https://your-render-app.onrender.com/`
- Host URL: `https://your-render-app.onrender.com/?host=my-secret-host-token`

### GitHub Pages

1. Push this folder to a GitHub repository.
2. In repository settings, enable Pages from the main branch root.
3. Open the generated Pages URL.

## Data model

Player name, current draft, selected cards, and sound preference are saved in each browser with `localStorage`.

Round state, host permissions, next-round card tier, offer signatures, and selected-card locks live in the running Python server process. Restarting the server resets the shared room.
