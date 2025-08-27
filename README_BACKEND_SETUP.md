# 🔧 Backend Setup Guide

## 🚀 Super Easy Setup (Recommended)

### Step 1: One-Click Start
Simply **double-click** the `start_backend_simple.bat` file in the project root folder.

That's it! The backend will automatically:
- Install required packages
- Start the server at `http://localhost:8000`
- Connect to your frontend

### Step 2: Verify Connection
- Look for the **🟢 Backend Connected** indicator in your frontend
- The "Initialize Model" button should now work without errors

## 🛠️ Alternative Setup Methods

### Method 2: Command Line
```bash
# Navigate to project folder
cd "c:\Users\debni\Downloads\Micro_credit_risk_analyzer"

# Run the simple backend
start_backend_simple.bat
```

### Method 3: Python Direct
```bash
# Install Python dependencies
cd backend
pip install -r requirements_simple.txt

# Start the simple backend
python simple_main.py
```

## ✅ How to Know It's Working

1. **Console Output**: You should see:
   ```
   🚀 Starting Micro Credit Risk Analyzer Backend
   📡 Server will be available at: http://localhost:8000
   ```

2. **Frontend Indicator**: The dashboard shows **🟢 Backend Connected**

3. **Browser Test**: Visit `http://localhost:8000/health` - you should see:
   ```json
   {"status": "healthy", "message": "Backend is running successfully"}
   ```

## 🔍 Troubleshooting

### "Backend Disconnected" Still Showing?
- Wait 5-10 seconds after starting the backend
- Refresh your frontend page
- Check if port 8000 is available

### Python Not Found Error?
- Install Python 3.8+ from [python.org](https://python.org)
- Make sure to check "Add Python to PATH" during installation
- Restart your command prompt after installation

### Port 8000 Already in Use?
- Close any other applications using port 8000
- Or modify the port in `simple_main.py` (line with `port=8000`)

## 📋 What's Included in Simple Backend

The simplified backend provides:
- ✅ Model training simulation
- ✅ Blockchain statistics (demo data)
- ✅ Model accuracy metrics
- ✅ Health check endpoints
- ✅ CORS configuration for frontend

## 🎯 Next Steps

Once connected:
1. Click **"🚀 Initialize Model"** in the frontend
2. Watch the training simulation complete
3. Explore the blockchain dashboard features
4. All network errors should be resolved!

---

**Need more help?** Check `QUICK_START.md` for additional troubleshooting tips.
