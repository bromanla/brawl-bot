# Brawl Stats Service

This repository contains a Node.js-based service designed for tracking and analyzing player statistics in the game Brawl Stars. The service interacts with the Brawl Stars API and uses SQLite for data storage. It is built for educational purposes, utilizing experimental features of Node.js, and is not recommended for production environments.

---

## Features

- **Daily and Seasonal Statistics:**

  - Tracks player trophies and calculates daily and seasonal differences.
  - Maintains a record of top performers and underperformers.

- **Integration with VK:**

  - Sends updates and commands through VK messages.

- **Cron Jobs:**
  - Automates daily tasks for updating statistics.

---

## Experimental Features

This project uses the following Node.js experimental flags:

- `--experimental-sqlite`
- `--experimental-strip-types`

**Note:** These features are unstable and used here solely for personal development and learning.

---

## Usage

### VK Commands

- `/season`: Triggers the seasonal statistics update.
- Additional commands can be added in `BotService`.

### Logs and Messages

- Daily and seasonal statistics are logged and optionally sent via VK messages.

---

## Environment Variables

| Variable                 | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `NODE_ENV`               | Environment mode (`development`/`production`). |
| `VK_TOKEN`               | VK API token.                                  |
| `VK_CONVERSATION_ID`     | VK conversation ID for messages.               |
| `VK_ADMIN`               | Comma-separated list of admin user IDs.        |
| `BRAWL_CLAN_TAG`         | Brawl Stars clan tag.                          |
| `BRAWL_TOKEN`            | Brawl Stars API token.                         |
| `BRAWL_RECORD_LABEL`     | Label for top performance messages.            |
| `BRAWL_ANTIRECORD_LABEL` | Label for underperformance messages.           |

---

## Project Structure

```plaintext
src/
├── bot/                  # VK bot integration
├── brawl/                # Brawl Stars API services
├── common/               # Shared configurations and utilities
├── octopus/              # Core service orchestrator
├── player/               # Player-related logic and database operations
├── season/               # Seasonal data handling
├── store/                # SQLite wrapper
└── index.ts              # Entry point
```
