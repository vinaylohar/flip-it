# Memory Game Client

This is the frontend client for the Memory Game Task. It is built using **React**, **TypeScript**, and **Vite** for a fast and modern development experience.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Install](#install)
- [Run](#run)
- [Build](#build)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [Game Variations](#game-variations)
- [Authentication](#authentication)
- [Future Plans](#future-plans)
- [Contributors](#contributors)

---

## Features

- **React + TypeScript**: Modern frontend development with type safety.
- **Vite**: Lightning-fast development server with HMR (Hot Module Replacement).
- **React Hooks**: Simplified state and lifecycle management.
- **Redux with Thunk Middleware**: Centralized state management with support for asynchronous actions.
- **Responsive Design**: Optimized for various screen sizes.

---

## Requirements

- MacOS, Linux, or Windows
- Node.js 20+
- npm 8+

---

## Setup

1. Clone this repository to your local machine:
   ```bash
   git clone <repo_name>
   ```

2. Navigate to the client directory:
   ```bash
   cd flip-it/apps/client
   ```

---

## Install

Install the required dependencies:
```bash
npm install
```

---

## Run

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Build

Build the application for production:
```bash
npm run build
```

The production-ready files will be in the `dist` folder.

---

## Project Structure

```
apps/client/
├── public/         # Static assets
├── src/
│   ├── components/ # Reusable React components
│   ├── hooks/      # Custom React hooks
│   ├── pages/      # Application pages
│   ├── styles/     # Global and component-specific styles
│   ├── utils/      # Utility functions
│   ├── App.tsx     # Main application component
│   └── main.tsx    # Entry point
├── package.json    # Project metadata and dependencies
└── vite.config.ts  # Vite configuration
```

---

## State Management

The application uses **Redux** for state management, along with **Redux Thunk** middleware for handling asynchronous actions. The global state is structured to manage:

- **User Authentication**: Firebase user data and authentication state.
- **Game State**: Current game progress, player scores, and settings.
- **Leaderboard Data**: Fetched high scores for the single-player mode.

State is organized into slices, each responsible for a specific feature. Actions and reducers are defined to ensure predictable state updates.

---

## Game Variations

- **Single Player**: A solo mode where players can test their memory skills. The leaderboard is available only for this variation.
- **Multiplayer Local**: A local multiplayer mode where players can compete on the same device.

---

## Authentication

The application uses **Firebase Authentication** to manage user accounts. Users can sign up, log in, and securely access their game data.

---

## Future Plans

- **Online Multiplayer**: We plan to implement an online multiplayer mode using WebSockets or Firebase Realtime Database. This will allow players to compete with others over the internet in real-time.
- **Enhanced Leaderboard**: Extend the leaderboard to include online multiplayer rankings.

---

## Contributors

- [Vinay Lohar]
