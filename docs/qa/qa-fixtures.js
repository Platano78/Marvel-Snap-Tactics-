/**
 * Snapapoulous Prime — QA fixture seed corpus (Phase 0 standing corpus)
 * Derived: 2026-07-20, Q1 crawl (Dashboard / Profile / Analytics), against index.html
 *   (grepped the real parsers/consumers, not guessed — see shape notes per key below).
 *
 * USAGE: paste the function body into a chrome-devtools `evaluate_script` call against
 * the target page, or `page.evaluate()` in Playwright/Puppeteer. Idempotent — safe to
 * re-run. Always re-navigate/reload after seeding so React re-reads localStorage on
 * mount (the app only re-reads player-OS keys on mount + on a 'snap-data-updated'
 * CustomEvent — it does NOT poll localStorage, so a bare seed with no reload/event
 * will not appear in the UI).
 *
 * SHARED-BROWSER WARNING: if multiple QA agents are running concurrently against the
 * same chrome-devtools MCP session, the "currently selected page" is a GLOBAL pointer
 * with no per-agent isolation — another agent's select_page/new_page can silently steal
 * your target between tool calls. ALWAYS guard every evaluate_script call with a
 * location.href port check (see the `if (!location.href.includes(':PORT'))` line inside
 * the function below — swap PORT for your own) and abort/reselect on mismatch. Never
 * report a defect from a measurement you didn't verify was taken on your own page.
 *
 * STORAGE KEY SHAPES (verified against the real read/write sites in index.html):
 *
 * snap_collection            {owned: string[] (exact card-data.json `name` values,
 *                             case-sensitive), lastUpdated: ISO string}
 *                             Read by getOwnedCount() via exact-name Set membership.
 *
 * snap_matches                Array<{id, timestamp: ISO string, result: 'WIN'|'LOSS',
 *                             cubes: number, opponent: string, deck: string, notes: string,
 *                             snapped: 'NONE'|'PLAYER'|'OPPONENT'|'BOTH'}>.
 *                             ARRAY ORDER MATTERS: the app always appends
 *                             (`setMatches(prev => [...prev, newMatch])` — Quick Match
 *                             handler), so array order is chronological ASCENDING
 *                             (oldest first). Dashboard's "recent matches" window is
 *                             `matches.slice(-5).reverse()` — a positional slice, NOT a
 *                             timestamp sort — so a fixture with matches out of
 *                             chronological array order will show the wrong "recent"
 *                             window and momentum-ribbon math even though Match
 *                             History (which does sort by timestamp) looks fine.
 *
 * snap_rank                   {tier, currentRank, skillRating, gamesPlayedInSeason,
 *                             highWatermark, highWatermarkTier, seasonId, importedAt}
 *
 * snap_game_data_mtime         Bare ISO string (NOT JSON-wrapped) — read directly via
 *                             localStorage.getItem, not JSON.parse'd. Staleness threshold
 *                             for the "open Marvel Snap to refresh" hint is >24h old.
 *
 * snap_wallet                 {credits, gold, tokens, keys, fullWallet: {borderCharges,
 *                             tickets: {Bronze, Silver, Gold, ProvingGrounds, Infinity,
 *                             Vibranium}}, importedAt}. Currency fields are TOP-LEVEL,
 *                             NOT nested under a `currencies` key (Dashboard's Wallet
 *                             Widget reads wallet.credits directly).
 *
 * snap_rewards                 {pityCounters: {s4 (/20), s5 (/60), spotlightKey (/4)},
 *                             isCloseToS4, isCloseToS5, isCloseToSpotlight, importedAt}
 *
 * snap_collection_enhanced     {collectionScore, cosmetics: {avatars, titles, cardBacks,
 *                             albums}, variantCount, godSplitCount, totalBoosters,
 *                             cards: [{cardDefId, variants: string[], boosters, splitLevel}],
 *                             avatarCardDefIds: string[] (unique CardDefId per owned avatar —
 *                             feeds Cosmetics tab's Avatars gallery via getCardArtUrl),
 *                             albumCompletion: [{name, owned, total}] (feeds Cosmetics tab's
 *                             Albums progress bars; owned===total marks a complete album)}
 *                             hasHallOfArmor (Profile tab) requires variantCount>0 OR
 *                             totalBoosters>0.
 *
 * snap_profile_stats           {wins, losses, ties, totalGames, winRate, snaps, concedes,
 *                             opponentConcedes, snapId, currencies: {credits, gold, tokens},
 *                             rankData: <same shape as snap_rank>, skillRating, importedAt}.
 *                             This is what
 *                             Dashboard's "Lifetime Stats" and Analytics' "Season
 *                             Stats"/"Currencies" blocks read — independent of
 *                             snap_matches (local match tracking); Dashboard prefers
 *                             importedStats over locally-tracked matches when present.
 *
 * snap_battlepass               {level, season, claimedLevels: number[], importedAt}.
 *                             Dashboard's Battle Pass card only renders when level > 0.
 *
 * snap_missions                 {daily: [{id, description, progress, target, completed,
 *                             reward: {Amount, Currency}}], weekly: [...same shape],
 *                             dailyCompleted, weeklyCompleted, importedAt}.
 *                             hasMissions (Analytics tab) requires
 *                             daily.length + weekly.length > 0. Reward is only rendered
 *                             when BOTH an amount (Amount|Quantity|Count) and a
 *                             currency (Currency|CurrencyType|Type) key are present.
 *
 * snap_mastery                  {cards: [{card, level, levelCap}], importedAt}.
 *                             hasMastery requires cards.length > 0. avgLevel =
 *                             (sum(level)/count).toFixed(1); maxedCards = count where
 *                             level >= (levelCap || 30).
 *
 * snap_card_performance          {cards: {cardName: {netCubes}}, importedAt}. Powers
 *                             Dashboard's heroCard selection (best-netCubes OWNED card
 *                             wins the hero slot) and Arsenal shelf ordering, and
 *                             Analytics' Card Performance list/filter/sort + gained/
 *                             lost/net totals (a netCubes of exactly 0 counts toward
 *                             NEITHER the positive nor negative bucket).
 *
 * snap_timemodel                 {serverTime, dailyReset, weeklyReset, seasonReset,
 *                             importedAt} — all ISO strings. Feeds Dashboard's "Resets"
 *                             tile countdown.
 *
 * snap_decks                     [{id, name, cards: string[] (card names)}] — feeds
 *                             Profile's "Favorite Decks" strip.
 *
 * ROUTING NOTE (2026-07-20): Battle Pass, Missions, Mastery, and Hall of Armor are NOT
 * separate tabs/routes. The url-param whitelist (index.html ~line 13714) only allows:
 * dashboard, ai, collection, database, decks, compare, settings, oracle, history,
 * profile, analytics, simulator. Settings' "More Features" grid (~line 10740) has
 * exactly 7 buttons: Profile, Dashboard, Oracle, Match History, Analytics, Simulator,
 * Creators(decks) — nothing else. The four "missing" surfaces are sub-sections nested
 * inside other tabs:
 *   - Battle Pass  -> a card on the Dashboard tab (gated on battlePass.level > 0)
 *   - Missions, Mastery -> sections inside the Analytics tab / CardPerformanceView
 *   - Hall of Armor -> a section inside the Profile tab / UserProfile
 *
 * FIXTURE GROUND TRUTH (this exact seed, hand-traced against the formulas in index.html
 * so results are checkable without guessing):
 *   - 10 matches: totalGames=10, totalWins=7, winRate=70%, netCubes=+20.
 *   - Today's 6 matches: net=+17, current streak=4 wins in a row.
 *   - Companion headline should read: "You're up 17 cubes today. Your Shuri OTA deck
 *     is carrying. That's 4 in a row." (deck-credit requires count>=2 AND net>0 today;
 *     Shuri OTA net+10 beats Zoo net+6).
 *   - heroCard should be "Fin Fang Foom" (+45 netCubes, best among the 8 owned cards
 *     with performance data).
 *   - Card Performance totals: totalPositive=+112, totalNegative=-37, Net=+75.
 *   - Mastery summary: totalCards=8, avgLevel="18.8", maxedCards=3.
 *   - momentum ribbon: gold node on the newest visible match (m9), since the current
 *     streak is WIN and >=3.
 */
function seedSnapapoulousFixtures() {
  // Swap '8130' for whichever port you're actually testing against.
  if (!location.href.includes(':8130')) {
    return { ABORT_WRONG_PAGE: location.href };
  }

  const now = Date.now();
  const iso = (ms) => new Date(ms).toISOString();
  const H = 3600000, D = 86400000;

  const owned = ["Fin Fang Foom","Abomination","Cyclops","Hawkeye","Hulk","Iron Man","Medusa","Misty Knight",
    "Punisher","Quicksilver","Sentinel","Shocker","Star-Lord","The Thing","Jessica Jones","Ka-Zar",
    "Mister Fantastic","Nightcrawler","Odin","Spectrum","White Tiger","Wolfsbane","Ant Man","Blue Marvel",
    "Colossus","Gamora","Ironheart","America Chavez","Angel","Angela"];

  localStorage.setItem('snap_collection', JSON.stringify({ owned, lastUpdated: iso(now) }));

  const matches = [
    { id:'m0', timestamp: iso(now - 2*D), result:'WIN',  cubes:2, opponent:'', deck:'Aggro Surfer', notes:'', snapped:'NONE' },
    { id:'m1', timestamp: iso(now - D - 14*H), result:'LOSS', cubes:2, opponent:'Bob', deck:'Aggro Surfer', notes:'', snapped:'NONE' },
    { id:'m2', timestamp: iso(now - D - 10*H), result:'WIN',  cubes:4, opponent:'', deck:'Shuri OTA', notes:'', snapped:'NONE' },
    { id:'m3', timestamp: iso(now - D - 4*H),  result:'LOSS', cubes:1, opponent:'Alice', deck:'', notes:'', snapped:'NONE' },
    { id:'m4', timestamp: iso(now - 10*H), result:'WIN',  cubes:8, opponent:'Carol', deck:'Zoo', notes:'', snapped:'PLAYER' },
    { id:'m5', timestamp: iso(now - 8*H),  result:'LOSS', cubes:2, opponent:'', deck:'Zoo', notes:'Misplayed Turn 5, shoulda held tech', snapped:'OPPONENT' },
    { id:'m6', timestamp: iso(now - 6*H),  result:'WIN',  cubes:4, opponent:'', deck:'Shuri OTA', notes:'', snapped:'NONE' },
    { id:'m7', timestamp: iso(now - 4*H),  result:'WIN',  cubes:4, opponent:'', deck:'Shuri OTA', notes:'', snapped:'NONE' },
    { id:'m8', timestamp: iso(now - 2*H),  result:'WIN',  cubes:2, opponent:'', deck:'Shuri OTA', notes:'', snapped:'PLAYER' },
    { id:'m9', timestamp: iso(now - 1*H),  result:'WIN',  cubes:1, opponent:'', deck:'', notes:'', snapped:'NONE' },
  ];
  localStorage.setItem('snap_matches', JSON.stringify(matches));

  const rank = { tier:'Vibranium', currentRank:87, skillRating:1450, gamesPlayedInSeason:42,
    highWatermark:92, highWatermarkTier:'Vibranium', seasonId:'Season 2026.07 Dragons', importedAt: iso(now) };
  localStorage.setItem('snap_rank', JSON.stringify(rank));

  localStorage.setItem('snap_game_data_mtime', iso(now - 3*H));

  localStorage.setItem('snap_wallet', JSON.stringify({
    credits: 50000, gold: 3200, tokens: 875, keys: 3,
    fullWallet: { borderCharges: 12, tickets: { Bronze:5, Silver:3, Gold:1, ProvingGrounds:0, Infinity:0, Vibranium:0 } },
    importedAt: iso(now)
  }));

  localStorage.setItem('snap_rewards', JSON.stringify({
    pityCounters: { s4: 16, s5: 52, spotlightKey: 2 },
    isCloseToS4: true, isCloseToS5: true, isCloseToSpotlight: false,
    importedAt: iso(now)
  }));

  localStorage.setItem('snap_collection_enhanced', JSON.stringify({
    collectionScore: 125000,
    cosmetics: { avatars: 12, titles: 5, cardBacks: 20, albums: 3 },
    variantCount: 6, godSplitCount: 2, totalBoosters: 680,
    cards: [
      { cardDefId: 'FinFangFoom', variants: ['v1','v2','v3'], boosters: 200, splitLevel: 3 },
      { cardDefId: 'Abomination', variants: ['v1'], boosters: 180, splitLevel: 2 },
      { cardDefId: 'Cyclops', variants: ['v1','v2'], boosters: 90, splitLevel: 1 },
      { cardDefId: 'Hawkeye', variants: [], boosters: 160, splitLevel: 0 },
      { cardDefId: 'Hulk', variants: [], boosters: 50, splitLevel: 0 }
    ],
    // defIds that exist in card-data.json so getCardArtUrl resolves real art in the gallery.
    avatarCardDefIds: ['FinFangFoom','Abomination','Cyclops','Hawkeye','Hulk','Uatu','Mirage','OmegaRed'],
    // At least one COMPLETE album (owned===total) so the full-state check-mark renders.
    albumCompletion: [
      { name: 'Venomized Villains', owned: 2, total: 12 },
      { name: 'Staying Hipp', owned: 9, total: 12 },
      { name: 'Pixel Discarder', owned: 9, total: 9 }
    ],
    importedAt: iso(now)
  }));

  localStorage.setItem('snap_profile_stats', JSON.stringify({
    wins: 7, losses: 3, ties: 0, totalGames: 10, winRate: 70, snaps: 4, concedes: 1, opponentConcedes: 2,
    snapId: 'Snapapoulous#1234',
    currencies: { credits: 50000, gold: 3200, tokens: 875 },
    rankData: rank, skillRating: 1450, importedAt: iso(now)
  }));

  localStorage.setItem('snap_battlepass', JSON.stringify({
    level: 42, season: 'Dragons Rising', claimedLevels: Array.from({length:30}, (_,i)=>i+1),
    importedAt: iso(now)
  }));

  localStorage.setItem('snap_missions', JSON.stringify({
    daily: [
      { id:1, description:'Play 3 matches', progress:3, target:3, completed:true, reward:{Amount:500, Currency:'Credits'} },
      { id:2, description:'Win with Deadpool', progress:1, target:1, completed:true, reward:{Amount:100, Currency:'Gold'} },
      { id:3, description:'Deal 50 damage', progress:20, target:50, completed:false, reward:{Amount:300, Currency:'Credits'} }
    ],
    weekly: [
      { id:4, description:'Win 10 games', progress:6, target:10, completed:false, reward:{Amount:1000, Currency:'Credits'} },
      { id:5, description:'Open 5 card packs', progress:5, target:5, completed:true, reward:{Amount:1, Currency:'Key'} }
    ],
    dailyCompleted: 2, weeklyCompleted: 1, importedAt: iso(now)
  }));

  localStorage.setItem('snap_mastery', JSON.stringify({
    cards: [
      { card:'Fin Fang Foom', level:30, levelCap:30 },
      { card:'Abomination', level:25, levelCap:30 },
      { card:'Cyclops', level:18, levelCap:30 },
      { card:'Hawkeye', level:30, levelCap:30 },
      { card:'Hulk', level:10, levelCap:30 },
      { card:'Iron Man', level:5, levelCap:30 },
      { card:'Medusa', level:30, levelCap:30 },
      { card:'Misty Knight', level:2, levelCap:30 }
    ],
    importedAt: iso(now)
  }));

  localStorage.setItem('snap_timemodel', JSON.stringify({
    serverTime: iso(now), dailyReset: iso(now + 5*H + 20*60000), weeklyReset: iso(now + 3*D + 2*H),
    seasonReset: iso(now + 20*D), importedAt: iso(now)
  }));

  localStorage.setItem('snap_card_performance', JSON.stringify({
    cards: {
      'Fin Fang Foom': { netCubes: 45 }, 'Abomination': { netCubes: -12 }, 'Cyclops': { netCubes: 30 },
      'Hawkeye': { netCubes: 22 }, 'Hulk': { netCubes: -5 }, 'Iron Man': { netCubes: 15 },
      'Medusa': { netCubes: 0 }, 'Misty Knight': { netCubes: -20 }
    },
    importedAt: iso(now)
  }));

  localStorage.setItem('snap_decks', JSON.stringify([
    { id:'d1', name:'Shuri OTA', cards:['Fin Fang Foom','Cyclops','Hawkeye','Iron Man','Medusa'] }
  ]));

  // Force React to reload player-OS state without a full navigation, where the
  // consuming component listens for it (Dashboard, UserProfile, CardPerformanceView
  // all do). A full reload also works and is more reliable for first-mount state
  // (collection/matches are only read via useState lazy-init at the App root).
  window.dispatchEvent(new CustomEvent('snap-data-updated'));

  return { seeded: true, href: location.href };
}
