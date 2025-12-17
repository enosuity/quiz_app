# Quick Deployment Guide

## 🚀 Deploy to Render (5 Steps)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: add production deployment configuration"
git push
```

### Step 2: Create Render Account
- Go to [dashboard.render.com](https://dashboard.render.com)
- Sign up with GitHub (free)

### Step 3: Deploy via Blueprint
1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render detects `render.yaml` and creates:
   - Backend service
   - Frontend service  
   - PostgreSQL database
4. Wait 5-10 minutes for deployment

### Step 4: Update Frontend URL
After backend deploys:
1. Copy backend URL (e.g., `https://quiz-app-backend.onrender.com`)
2. Go to **quiz-app-frontend** → **Environment**
3. Update `VITE_API_URL` to actual backend URL
4. Save (triggers redeploy)

### Step 5: Initialize Database
Go to **quiz-app-backend** → **Shell**:
```bash
rails db:migrate
rails db:seed
```

### Step 6: Update CORS (Final)
After frontend deploys:
1. Copy frontend URL (e.g., `https://quiz-app-frontend.onrender.com`)
2. Update `backend/config/initializers/cors.rb`:
   ```ruby
   origins ['http://localhost:5173', 'https://your-frontend-url.onrender.com']
   ```
3. Commit and push (auto-redeploys)

---

## ✅ Done!

Your app is live at:
- **Frontend**: `https://quiz-app-frontend.onrender.com`
- **Backend**: `https://quiz-app-backend.onrender.com`

Test it:
1. Sign up as admin
2. Create a quiz
3. Take the quiz
4. View results

---

## 📝 Notes

**Free Tier**: Services sleep after 15 min inactivity (30s wake-up time)

**Need Help?** Check `DEPLOYMENT.md` for detailed troubleshooting.

