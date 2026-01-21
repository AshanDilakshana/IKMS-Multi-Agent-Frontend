# IKMS Multi-Agent Frontend

This project is a React-based frontend application built with [Vite](https://vitejs.dev/).

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Features

- **Fast Development**: Powered by Vite for instant server start.
- **React**: Component-based UI development using React 19.
- **Linting**: Pre-configured ESLint for code quality.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Download and install [Node.js](https://nodejs.org/) (version 18 or higher recommended).
- **npm**: Node Package Manager is installed with Node.js.

## Installation

1. **Clone the repository** (if applicable):

   ```bash
   git clone <repository-url>
   cd IKMS-Multi-Agent-Frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

## Usage

To start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL shown in the terminal).

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

```
IKMS-Multi-Agent-Frontend/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images and fonts
│   ├── components/      # Reusable components
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML entry point
├── package.json         # Project metadata and dependencies
├── vite.config.js       # Vite configuration
└── README.md            # Project documentation
```

## Technologies Used

- [React](https://react.dev/) - JS Library for building user interfaces
- [Vite](https://vitejs.dev/) - Frontend Tooling
- [ESLint](https://eslint.org/) - Pluggable JavaScript linter
