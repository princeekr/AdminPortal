# Deployment & Run Guide

## Local Development

To run the project locally, follow these steps:

1.  **Install Dependencies**
    Note: Both frontend and backend dependencies are now in the root `package.json`.
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Ensure you have a `.env` file in the `backend_admin` directory (or root if running unified) with:
    ```
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    ```
    And in the root level `.env` for frontend (if any keys are needed there).

3.  **Start Backend**
    In a terminal:
    ```bash
    cd backend_admin
    npm start
    ```
    (Or `nodemon index.js` if you have nodemon installed globally/locally).
    *The backend runs on http://localhost:5000*

4.  **Start Frontend**
    In a NEW terminal (root directory):
    ```bash
    npm run dev
    ```
    *The frontend runs on http://localhost:3000 (usually)*

    > **Note:** The `vite.config.ts` is configured to proxy requests from `/api` -> `http://localhost:5000/api`. So the frontend will successfully talk to the backend.

---

## Deploying to Vercel

The project is configured for a "Serverless Monorepo" deployment on Vercel.

1.  **Push to GitHub**
    - Commit all changes (including `vercel.json` and `api/index.js`).
    - Push to a GitHub repository.

2.  **Connect to Vercel**
    - Go to [Vercel](https://vercel.com).
    - "Add New" -> "Project" -> Import your GitHub repo.

3.  **Project Configuration**
    - **Framework Preset:** Vite (Vercel should detect this automatically).
    - **Root Directory:** `./` (Leave distinct).

4.  **Environment Variables**
    - Add your `MONGO_URI` to the Vercel Project Settings > Environment Variables.

5.  **Deploy**
    - Click **Deploy**.

### How it works on Vercel
- **Frontend**: Vercel serves the built React app (`dist`).
- **Backend**: `vercel.json` routes any request to `/api/*` to the `api/index.js` serverless function.
- **Dependency Management**: Vercel installs dependencies from the root `package.json`, which now includes both frontend and backend packages.

## Troubleshooting

- **500 Errors on /api**: Check Vercel Logs > Functions. Usually invalid DB string or missing env vars.
- **Frontend API Errors**: Ensure your `fetch` calls use relative paths (e.g., `/api/registrations`) and NOT hardcoded execution-time URLs.
