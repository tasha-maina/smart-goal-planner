Smart Goal Planner
A React-based fintech app to help users manage multiple savings goals, track progress, and make deposits. The app uses Vite for fast development and json-server to simulate a REST API backend with local data persistence.

Features
Add, update, and delete savings goals (CRUD).

Track progress with visual progress bars.

Make deposits to individual goals, updating saved amounts.

Overview dashboard showing total goals, money saved, deadlines, and warnings.

Data is fetched from and persisted to a local db.json file via json-server.

Technologies
React (with hooks and functional components)

Vite (build tool and dev server)

json-server (mock REST API)

GitHub Pages for deployment

Getting Started
Prerequisites
Node.js and npm installed

Installation
Clone the repo:

bash
Copy code
git clone https://github.com/your-username/smart-goal-planner.git
cd smart-goal-planner
Install dependencies:

bash
Copy code
npm install
Run the mock API server (json-server):

bash
Copy code
npm run server
This will start the json-server on http://localhost:3001 serving db.json.

In a new terminal, run the React dev server:

bash
Copy code
npm run dev
Open your browser at http://localhost:5173 to view the app.

Available Scripts
Command	Description
npm run dev	Run the Vite development server
npm run build	Build the production-ready app
npm run preview	Preview the production build locally
npm run server	Start json-server at localhost:3001
npm run deploy	Deploy to GitHub Pages (uses dist)

Deployment
Build the project:

bash
Copy code
npm run build
Deploy the contents of the dist folder to GitHub Pages:

bash
Copy code
npm run deploy
Your app will be available at:

arduino
Copy code
https://your-github-username.github.io/smart-goal-planner/
Project Structure
php
Copy code
/
├── public/             # Static assets like icons
├── src/                # React source files
│   ├── components/     # Reusable React components
│   ├── App.jsx         # Root app component
│   └── main.jsx        # Entry point
├── db.json             # Local JSON data file for json-server
├── vite.config.js      # Vite configuration (with base path)
├── package.json        # Project metadata and scripts
└── README.md           # This file
Notes
Ensure json-server (npm run server) is running before starting the React app to enable data fetching.

The vite.config.js sets the base path to /smart-goal-planner/ for GitHub Pages deployment.

Make sure to commit your changes and push to the main branch for deployment to work smoothly.