# Memory Game Server

This is the backend server for the Memory Game Task. It is built using Node.js and Express and provides APIs for managing high scores and game-related data.

---

## Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Install](#install)
- [Run](#run)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributors](#contributors)

---

## Requirements

- MacOS, Linux, or Windows
- Git
- Node.js 20+

---

## Setup

1. Clone this repository to your local machine.
2. Navigate to the `apps/server` directory:
   ```bash
   cd apps/server

## Install

Install the required dependencies by running:
```shell
# Run in root of project
npm install
```

## Run

Start the server by running:
```shell
# Run in root of project
npm run server
```

## API Documentation
Base URL
http://localhost:3000

Endpoints

1. Root Endpoint
URL: /
- Method: GET
- Response:
    200 OK:

```shell
Welcome to the Memory Game API
```

2. Get High Scores
- URL: /api/high-scores
- Method: GET
- Headers:
    playerfbid (string): The Firebase ID of the player.
- Query Parameters:
    category (string): The category of the high scores to fetch.
- Response:
    200 OK:

```json
[
  {
    "rank": 1,
    "username": "Player1",
    "score": 9500,
    "isCurrentPlayer": false
  },
  {
    "rank": 2,
    "username": "Player2",
    "score": 9000,
    "isCurrentPlayer": true
  }
]
```
      400 Bad Request: Missing or invalid parameters.

3. Submit High Score
- URL: /api/high-scores
- Method: POST
- Headers:
      playerfbid (string): The Facebook ID of the player.
- Body:
```json
{
  "player": "Player1",
  "guesses": 15,
  "timeTakeInSeconds": 120,
  "category": "easy"
}
```

- Response:
    201 Created:
```json
{
  "score": 8500
}
```
      500 Internal Server Error: Unable to save the score.

## Project Structure

```text
server/
├── package.json           # Server dependencies and scripts
├── src/
│   ├── app.ts             # Express app initialization
│   ├── server.ts          # Server entry point
│   ├── routes/            # API route handlers
│   │   ├── index.ts       # Root route
│   │   └── highScores.ts  # High scores routes
│   ├── middleware/        # Middleware functions
│   │   ├── errorHandler.ts
│   │   └── highScore.ts
│   ├── services/          # Services
│   │   └── database.ts
│   └── types/             # TypeScript types
│       └── index.ts
```

## Contributors

- [@vinaylohar](https://github.com/vinaylohar)