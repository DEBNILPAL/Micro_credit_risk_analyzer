# 🌐 Netlify Deployment with Backend Connection

## Option 1: Deploy Backend to Heroku (Recommended)

### Step 1: Prepare Backend for Heroku
1. Create `requirements.txt` in backend folder (already exists)
2. Create `Procfile` in backend folder:
   ```
   web: uvicorn main:app --host=0.0.0.0 --port=$PORT
   ```
3. Update CORS in `main.py` to allow your Netlify domain

### Step 2: Deploy to Heroku
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login to Heroku: `heroku login`
3. Create app: `heroku create your-app-name-backend`
4. Deploy:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend"
   heroku git:remote -a your-app-name-backend
   git push heroku main
   ```

### Step 3: Configure Netlify Environment
1. In Netlify dashboard → Site settings → Environment variables
2. Add: `REACT_APP_API_URL` = `https://your-app-name-backend.herokuapp.com`
3. Redeploy your Netlify site

## Option 2: Deploy Backend to Railway

### Step 1: Deploy to Railway
1. Go to https://railway.app
2. Connect your GitHub repo
3. Deploy the backend folder
4. Get your Railway URL: `https://your-app.up.railway.app`

### Step 2: Configure Netlify
1. Add environment variable: `REACT_APP_API_URL` = `https://your-app.up.railway.app`
2. Redeploy

## Option 3: Deploy Backend to Render

### Step 1: Deploy to Render
1. Go to https://render.com
2. Create new Web Service
3. Connect your repo, select backend folder
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host=0.0.0.0 --port=$PORT`

### Step 2: Configure Netlify
1. Add environment variable: `REACT_APP_API_URL` = `https://your-app.onrender.com`
2. Redeploy

## Quick Test Setup (No Backend Deployment)

If you want to show "Connected" status without deploying backend:

### Create Mock Backend Response
Add this to your Netlify site's `_redirects` file:
```
/api/* https://jsonplaceholder.typicode.com/posts 200
```

### Or Use Environment Variable
Set `REACT_APP_API_URL` to any working API endpoint for demo purposes.

## Netlify Environment Variables Setup

1. **Netlify Dashboard** → Your Site → Site settings
2. **Environment variables** → Add variable
3. **Key**: `REACT_APP_API_URL`
4. **Value**: Your backend URL (e.g., `https://your-backend.herokuapp.com`)
5. **Save** and **redeploy** your site

## Expected Result

After setup:
- ✅ Status shows: 🟢 **Connected**
- ✅ "Initialize Model" button works
- ✅ All backend features functional
- ✅ Professional deployment ready

## Troubleshooting

### Still showing "Disconnected"?
1. Check environment variable is set correctly
2. Ensure backend URL is accessible
3. Check browser console for CORS errors
4. Verify backend is running on the deployed URL

### CORS Issues?
Update your backend's CORS settings to include your Netlify domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-netlify-site.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
