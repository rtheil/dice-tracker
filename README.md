# Dice Tracker

A dice roll tracker for Catan and other 2d6 games. Roll your physical dice, tap the number,
and watch the distribution build up against the expected odds.

Built with [Expo](https://expo.dev) (React Native + TypeScript), so it can be developed on
Windows and run on an iPhone without a Mac.

## Run it on your iPhone

1. Install **Expo Go** from the App Store on your iPhone.
2. On your PC, in this folder:

   ```bash
   npm install
   npx expo start
   ```

3. Scan the QR code in the terminal with the iPhone Camera app. It opens in Expo Go.
   Edits to the code reload on the phone instantly.

The phone and PC must be on the same Wi-Fi. If it won't connect (corporate network, firewall),
use `npx expo start --tunnel`.

You can also preview in a browser with `npm run web`.

## Put it on the App Store (or just your own phone, permanently)

Expo Go is for development. To install it as a real app:

1. Join the [Apple Developer Program](https://developer.apple.com/programs/) ($99/year).
2. `npx eas-cli@latest build --platform ios` builds the app in Expo's cloud (no Mac needed).
3. `npx eas-cli@latest submit --platform ios` uploads it to App Store Connect, where you can
   install it via TestFlight or publish it to the store.

## Project layout

```
src/app/            Screens (Expo Router: each file is a route)
  index.tsx         The tracker
  saved/index.tsx   Saved games list
  saved/[id].tsx    One saved game's stats and full history
src/components/     StatsChart, RollHistory, RollPad, SaveGameModal, ...
src/state/          GameContext: current game, saved games, persistence
src/lib/            Dice math, storage, formatting, confirm dialogs
```

See [TODO.md](TODO.md) for what's next.
