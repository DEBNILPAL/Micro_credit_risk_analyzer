from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import os

# Simple FastAPI app for Railway deployment
app = FastAPI(title="Micro Credit Risk Analyzer - Railway Backend")

# CORS middleware - allow all origins for demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple model training endpoint
@app.post("/api/ml/train-model")
async def train_model():
    """Simple model training simulation"""
    try:
        # Simulate training time
        await asyncio.sleep(2)
        
        return {
            'success': True,
            'message': 'Model initialized successfully (Railway Demo)',
            'accuracies': {
                'dynamic_scoring': 0.87,
                'ensemble': 0.85,
                'blockchain_verified': 0.98
            },
            'model_hash': 'railway_demo_v1.0',
            'blockchain_blocks_created': 5,
            'training_time': '2.0 seconds'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

# Model accuracy endpoint
@app.get("/api/ml/model-accuracy")
async def get_model_accuracy():
    """Get model accuracy (demo data)"""
    return {
        'model_trained': True,
        'ensemble_accuracy': 0.85,
        'blockchain_integrity': 0.98,
        'blockchain_verified': True,
        'total_predictions': 25,
        'model_hash': 'railway_demo_v1.0'
    }

# Blockchain statistics endpoint
@app.get("/api/blockchain/statistics")
async def get_blockchain_stats():
    """Get blockchain statistics (demo data)"""
    return {
        'blockchain_statistics': {
            'credit_blockchain': {
                'total_blocks': 25,
                'average_credit_score': 720
            },
            'transaction_blockchain': {
                'total_blocks': 15,
                'total_transaction_volume': 150000
            },
            'verification_history': [
                {
                    'blockchain_type': 'credit_score',
                    'average_integrity_score': 0.98,
                    'verification_count': 25
                }
            ]
        }
    }

# Blockchain verification endpoint
@app.get("/api/blockchain/verify-integrity/credit_score")
async def verify_blockchain_integrity():
    """Verify blockchain integrity (demo data)"""
    return {
        'verification_result': {
            'valid': True,
            'total_blocks': 25,
            'verified_blocks': 25,
            'integrity_score': 0.98
        }
    }

# Health check endpoints
@app.get("/")
async def root():
    return {"message": "Micro Credit Risk Analyzer Backend is running on Railway!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Railway backend running successfully"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print("=" * 60)
    print("🚂 Railway Deployment - Micro Credit Risk Analyzer")
    print("=" * 60)
    print(f"📡 Server running on port: {port}")
    print("🔗 Ready for Netlify connection")
    print("=" * 60)
    
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
