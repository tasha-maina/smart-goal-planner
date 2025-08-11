# Smart Goal Planner

A React-based fintech app to help users manage multiple savings goals, track progress, and make deposits. The app uses **Vite** for fast development and **json-server** to simulate a REST API backend with local data persistence.

---

## Features

- ✅ Add, update, and delete savings goals (CRUD)
- ✅ Track progress with visual progress bars
- ✅ Make deposits to individual goals
- ✅ Overview dashboard with total savings, deadlines, and warnings
- ✅ Data persistence via local `db.json` using json-server

---

## Technologies

- React (with hooks and functional components)
- Vite (build tool and dev server)
- json-server (mock REST API)
- GitHub Pages for deployment *(optional)*

---

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repo:

git clone https://github.com/tasha-maina/smart-goal-planner.git
cd smart-goal-planner

2. Install dependencies:

npm install

3.Start the mock API server (json-server)

npm run server
This will start json-server at http://localhost:3001 serving the db.json file.

4.In a new terminal, run the React development server:
npm run dev
Then open your browser at http://localhost:5173 to use the app.

Available Scripts
Command	            Description
npm run dev         Run the Vite development server

npm run build	    Build the production ready app

npm run preview	    Preview the production build locally

npm run server	    Start json-server at port 3001

npm run deploy	    Deploy to GitHub Pages (optional)

Deployment (Optional)
⚠️ Note: For the Smart Goal Planner challenge, you only need to submit your GitHub repository. Deployment is optional and provided for your own use or demo purposes.

To deploy to GitHub Pages:

Build the project:

npm run build
Deploy:
npm run deploy
Your app will be available at:
https://tasha-maina.github.io/smart-goal-planner/

Project Structure
/
├── public/             # Static assets like icons
├── src/                # React source files
│   ├── components/     # Reusable React components
│   ├── App.jsx         # Root app component
│   └── main.jsx        # Entry point
├── db.json             # Local JSON data file for json-server
├── vite.config.js      # Vite configuration
├── package.json        # Project metadata and scripts
└── README.md           # This file

Notes
Make sure json-server is running before you start the React app.

All goal data is stored and fetched from db.json.


