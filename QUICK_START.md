# 🚀 Quick Start Guide - Micro Credit Risk Analyzer

## How to Connect the Backend (3 Easy Steps)

### Option 1: One-Click Start (Recommended)
1. **Double-click** `start_backend_simple.bat` in the project root folder
2. Wait for "Server will be available at: http://localhost:8000" message
3. Open your frontend application - it will automatically connect!

### Option 2: Manual Start
1. Open Command Prompt/Terminal
2. Navigate to the project folder:
   ```bash
   cd "c:\Users\debni\Downloads\Micro_credit_risk_analyzer"
   ```
3. Run the backend:
   ```bash
   start_backend_simple.bat
   ```

### Option 3: Python Direct
1. Open Command Prompt in the `backend` folder
2. Install dependencies:
   ```bash
   pip install -r requirements_simple.txt
   ```
3. Start the server:
   ```bash
   python simple_main.py
   ```

## ✅ How to Know It's Working

- **Backend Status**: Look for "Backend Connected" 🟢 indicator in the frontend
- **Server URL**: Backend runs at `http://localhost:8000`
- **API Docs**: Visit `http://localhost:8000/docs` to see available endpoints
- **Health Check**: Visit `http://localhost:8000/health`

## 🔧 Troubleshooting

### "Backend Disconnected" Error
- Make sure the backend is running (see steps above)
- Check if port 8000 is available
- Restart the backend if needed

### "Failed to Fetch" Error
- Ensure backend is started before using frontend features
- Check firewall settings if connection fails
- Try restarting both frontend and backend

### Python Not Found
- Install Python 3.8+ from python.org
- Make sure Python is added to your system PATH

## 🎯 What Works After Connection

- ✅ Initialize Model button
- ✅ Blockchain Dashboard
- ✅ Real-time credit scoring
- ✅ All API endpoints
- ✅ Data visualization

## 📞 Need Help?

If you're still having issues:
1. Check the console output for error messages
2. Ensure Python and pip are installed
3. Try running `python --version` to verify Python installation
4. Make sure no other application is using port 8000
