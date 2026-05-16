# Arcana Exchange

A fan-made web application for exchanging Lunar Arcana cards in Genshin Impact.

The website does not perform the exchange itself — it helps players find matching trade partners.

## Features

- Import Lunar Arcana collection from HoYoLAB HTML
- Automatic profile verification via Enka API
- Search players who:
  - own a card
  - offer extra copies
  - want a card
- Perfect trade matching system
- Player profile avatars from Enka assets

## Tech Stack

### Backend
- Spring Boot
- PostgreSQL
- Flyway
- JPA / Hibernate

### Frontend
- Angular standalone
- Signals
- TypeScript

## How It Works

1. Player creates profile using Genshin UID
2. Backend generates verification code
3. Player places code into Genshin signature
4. Backend verifies profile via Enka API
5. Player uploads HoYoLAB Lunar Arcana HTML
6. Backend parses cards and updates collection

## Project Structure

```text
backend/
frontend/
scripts/
