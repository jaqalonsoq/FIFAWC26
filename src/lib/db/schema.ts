import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  db = new Database(path.join(dataDir, 'predictor.db'))
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  initSchema(db)
  return db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      flag TEXT NOT NULL,
      grp TEXT NOT NULL,
      elo REAL DEFAULT 1500,
      avg_goals_for REAL DEFAULT 1.3,
      avg_goals_against REAL DEFAULT 1.1,
      avg_corners REAL DEFAULT 5.0,
      avg_yellow_cards REAL DEFAULT 1.8,
      avg_red_cards REAL DEFAULT 0.1,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      team_id INTEGER NOT NULL REFERENCES teams(id),
      position TEXT NOT NULL,
      avg_goals_per_game REAL DEFAULT 0.0,
      games_played INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY,
      home_team_id INTEGER NOT NULL REFERENCES teams(id),
      away_team_id INTEGER NOT NULL REFERENCES teams(id),
      match_date TEXT NOT NULL,
      stage TEXT NOT NULL,
      grp TEXT,
      venue TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL REFERENCES matches(id),
      created_at TEXT DEFAULT (datetime('now')),
      home_win_pct REAL NOT NULL,
      draw_pct REAL NOT NULL,
      away_win_pct REAL NOT NULL,
      double_chance_1x REAL NOT NULL DEFAULT 0,
      double_chance_12 REAL NOT NULL DEFAULT 0,
      double_chance_x2 REAL NOT NULL DEFAULT 0,
      expected_home_goals REAL NOT NULL,
      expected_away_goals REAL NOT NULL,
      over15_pct REAL NOT NULL DEFAULT 0,
      over25_pct REAL NOT NULL,
      over35_pct REAL NOT NULL,
      btts_yes_pct REAL NOT NULL,
      clean_sheet_home_pct REAL NOT NULL DEFAULT 0,
      clean_sheet_away_pct REAL NOT NULL DEFAULT 0,
      expected_corners REAL NOT NULL,
      over85_corners_pct REAL NOT NULL DEFAULT 0,
      over105_corners_pct REAL NOT NULL DEFAULT 0,
      expected_yellow_cards REAL NOT NULL,
      over35_yellows_pct REAL NOT NULL DEFAULT 0,
      red_card_pct REAL NOT NULL DEFAULT 0,
      most_likely_score TEXT NOT NULL,
      top_scorers TEXT NOT NULL DEFAULT '[]',
      score_distribution TEXT NOT NULL DEFAULT '[]'
    );

    CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id, created_at DESC);

    CREATE TABLE IF NOT EXISTS match_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL REFERENCES matches(id),
      minute INTEGER NOT NULL,
      event_type TEXT NOT NULL,
      team_id INTEGER REFERENCES teams(id),
      player_id INTEGER REFERENCES players(id),
      detail TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS match_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL REFERENCES matches(id),
      team_id INTEGER NOT NULL REFERENCES teams(id),
      shots_total INTEGER DEFAULT 0,
      shots_on_target INTEGER DEFAULT 0,
      corners INTEGER DEFAULT 0,
      possession REAL DEFAULT 50,
      yellow_cards INTEGER DEFAULT 0,
      red_cards INTEGER DEFAULT 0,
      fouls INTEGER DEFAULT 0,
      offsides INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(match_id, team_id)
    );

    CREATE TABLE IF NOT EXISTS montecarlo_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT DEFAULT (datetime('now')),
      runs INTEGER NOT NULL,
      champion_odds TEXT NOT NULL,
      finalist_odds TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_montecarlo_date ON montecarlo_cache(created_at DESC);
  `)
}
