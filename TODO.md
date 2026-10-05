# TODO

## Next up

- [ ] **In-app dice roller**: swipe left from the tracker to a second screen that rolls 2d6
      on screen (animated dice, shake-to-roll optional). The result is recorded exactly like a
      tapped roll, so the stats and history stay in one place.

## Bigger features

- [ ] **Trial mode + $0.99 unlock**: a true one-time $0.99 purchase, no subscriptions or ads.
      Goal: cover the $99/year Apple Developer Program.
  - Apple doesn't offer trials for paid-upfront apps, so: free download + a one-time
    ("non-consumable") in-app purchase at $0.99 that unlocks the full app. Apple allows a free
    time-limited trial for this model (a $0 in-app purchase item, e.g. "7-day trial").
  - Decide the trial: time-limited (full app for N days) or a free tier (e.g. tracking and stats
    free forever; saved games / detailed history unlock with the purchase).
  - Include a "Restore purchase" button (App Store requirement).
  - Tech: RevenueCat (`react-native-purchases`) or `expo-iap`. Needs a development build
    (in-app purchases don't work in Expo Go), plus the Paid Apps agreement, tax and banking
    set up in App Store Connect.
  - Math: Apple takes 15% under the Small Business Program, so roughly $0.84 per sale in the
    US; about 120 sales a year covers the developer fee.

- [ ] **Apple Watch app**: record rolls from the wrist, then swipe/scroll to a second screen
      with quick history and stats. Use case: playing craps and keeping an eye on the 7.
  - Show 7 count vs expected, % of rolls, and rolls since the last 7.
  - Note: every roll is independent, so the chance of a 7 on the *next* roll is always 1 in 6
    (16.7%). Show "expected" as that fixed baseline next to what has actually been rolled.
  - Tech: watchOS UI must be native SwiftUI (Expo can't render JS on the watch). Add a watch
    target with a config plugin (e.g. `@bacons/apple-targets`), build with EAS, and sync
    rolls between phone and watch via WatchConnectivity.

- [ ] **Shared games (online, or maybe just local)**: everyone at the table joins a game with a
      game code and sees the live stats on their own phone.
  - Host creates the game and gets a short code; players join with it.
  - Permissions: host can record rolls, undo, save, and end the game; players are view-only by
    default (host can optionally let others record rolls).
  - Tech options: online via a realtime backend (e.g. Supabase or Firebase); local-only via
    Bluetooth/Wi-Fi peer-to-peer (Multipeer Connectivity), which needs no server or accounts
    but requires a native module and a development build.

## Ideas

- [ ] **Better app name** that makes it obvious it's a dice tracker.
  - App Store name max 30 characters, plus a 30-character subtitle for the pitch
    (e.g. "Track real dice rolls & odds"). Search the App Store to make sure it's not taken.
  - Avoid "Catan" in the name: it's a trademark and can get the app rejected. Mentioning it in
    the description is fine.
  - Starting ideas: Roll Tally, Dice Log, Roll Tracker, Dice Stats, Two Dice Tracker, Seven Out.
  - Favorite so far: **Two Dice**, e.g. "Two Dice – Roll Tracker" with a subtitle like
    "Odds & stats for Catan, craps…". Concern: pigeonholing if other dice are supported later.
  - Update `name` in `app.json` and the "Dice Tracker" title on the main screen.
- [ ] Resume a saved game (load it back into the tracker)
- [ ] Rename a saved game or change its date
- [ ] Track whose turn it is / rolls per player
- [ ] Share or export a game's stats (image or CSV)
- [ ] Custom app icon and splash screen
- [ ] Light mode

## Done

- [x] Tap-to-record pad for 2–12, styled like Catan number tokens (6/8 red, pips for odds)
- [x] Stats chart: total rolls, count and % per number, with expected-odds markers
- [x] Roll history: dice-shaped, last roll pinned and labeled, recent rolls on one line
- [x] Detailed history screen: every roll with time and gap since the previous roll, plus game
      time, roll count and average time per roll (live for the game in progress)
- [x] Undo last roll, with an in-app confirmation dialog
- [x] Save a finished game with a custom name and date; browse and delete saved games
- [x] Game in progress auto-saves, so closing the app never loses rolls
- [x] Screen stays awake while the tracker is open
