## Setup

This is the repo for the Memory Game.

The project structure is as follows:

```text
memory-game/
├── package.json           # Root workspace config
├── docs/                  # Documentation for the project
│   └── README.md          # Contains designs for guidance
├── apps/
│   ├── client/            # React frontend
│   │   ├── package.json
│   │   └── src/
│   └── server/            # Node + Express server
│       ├── package.json
│       └── src/
```

## Install

In the root of the project run the install command.

```shell
# Run in root of project
npm install
```

## Run

### Running the Server

The server should be run before the client.

```shell
# Run in root of project
npm run server
```

> ✅ The server will start on [http://localhost:3000](http://localhost:3000)

### Running the Client

Instructions for starting the client can be found in `apps/client/README.md`.

### Server API Routes

- **GET** /api/high-scores
  - Content-Type: application/json
- **POST** /api/high-scores
  - Content-Type: application/json
  - Body: See example request body

## Hosted Version

A static version of the application is hosted on GitHub Pages: [https://vinaylohar.github.io/flip-it/](https://vinaylohar.github.io/flip-it/)

