# Deployment Guide - Quiz Management System

## Recommended: Deploy to Render (All-in-One)

Render is the best choice for this microservices architecture as it supports Docker Compose natively.

### Prerequisites
- GitHub account with your code pushed
- Render account (free): [render.com](https://render.com)

---

## Quick Deployment Steps

### 1. Deploy Using Blueprint

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "feat: add production deployment configuration"
   git push
   ```

2. **Create Render Account**:
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Sign up with GitHub

3. **Deploy via Blueprint**:
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will detect `render.yaml` and create:
     - Backend web service
     - Frontend web service
     - PostgreSQL database

4. **Wait for Deployment** (~5-10 minutes):
   - Backend will build and deploy
   - Frontend will build and deploy
   - Database will be provisioned

### 2. Update Frontend Environment Variable

After backend deploys:
1. Copy backend URL (e.g., `https://quiz-app-backend.onrender.com`)
2. Go to **quiz-app-frontend** service → **Environment**
3. Update `VITE_API_URL` with actual backend URL
4. Click **"Save Changes"** (triggers redeploy)

### 3. Initialize Database

Go to **quiz-app-backend** service → **Shell** and run:
```bash
rails db:migrate
rails db:seed
```

### 4. Update CORS

After frontend deploys:
1. Copy frontend URL (e.g., `https://quiz-app-frontend.onrender.com`)
2. Update `backend/config/initializers/cors.rb`:
   ```ruby
   origins ['http://localhost:5173', 'https://your-actual-frontend-url.onrender.com']
   ```
3. Commit and push (auto-redeploys)

---

## Your Live URLs

After deployment:
- **Frontend**: `https://quiz-app-frontend.onrender.com`
- **Backend API**: `https://quiz-app-backend.onrender.com`

---

## Testing Your Deployment

1. Visit your frontend URL
2. Sign up as admin (check the admin box)
3. Create a quiz with questions
4. Take the quiz
5. Verify detailed results display

---

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds to wake up
- Database remains active

### Environment Variables Required

**Backend**:
- `RAILS_ENV=production`
- `DATABASE_URL` (auto-provided by Render)
- `SECRET_KEY_BASE` (auto-generated)
- `DEVISE_JWT_SECRET_KEY` (auto-generated)

**Frontend**:
- `VITE_API_URL` (your backend URL)

---

## Troubleshooting

### CORS Errors
- Ensure `backend/config/initializers/cors.rb` includes your frontend URL
- Redeploy backend after updating CORS

### Database Connection Issues
- Verify `DATABASE_URL` is set in backend environment
- Check database is running in Render dashboard

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in `Gemfile` and `package.json`

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is set correctly
- Check backend is running and accessible

---

## Alternative: Railway

If you prefer Railway:

1. Go to [railway.app](https://railway.app)
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Railway auto-detects Docker Compose
4. Add environment variables in dashboard
5. Get URLs from deployments tab

Both platforms work great for this architecture!

