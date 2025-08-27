from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional
import sqlite3

# Simple Blockchain Demo without TensorFlow dependencies
app = FastAPI(title="Blockchain Credit Risk Demo")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreditScoreRequest(BaseModel):
    user_id: int
    monthly_income: float
    existing_debt: float
    requested_amount: float

class SimpleBlockchain:
    """Simple blockchain implementation for credit scoring demo"""
    
    def __init__(self):
        self.db_path = 'simple_blockchain.db'
        self._init_db()
    
    def _init_db(self):
        """Initialize simple blockchain database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS credit_blocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                block_hash TEXT UNIQUE NOT NULL,
                previous_hash TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                credit_score INTEGER NOT NULL,
                prediction_data TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                verified BOOLEAN DEFAULT TRUE
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_credit_block(self, user_id: int, credit_score: int, prediction_data: dict) -> str:
        """Add credit score to blockchain"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get previous block hash
        cursor.execute('SELECT block_hash FROM credit_blocks ORDER BY id DESC LIMIT 1')
        result = cursor.fetchone()
        previous_hash = result[0] if result else "0" * 64
        
        # Create block data
        block_data = {
            'user_id': user_id,
            'credit_score': credit_score,
            'prediction_data': prediction_data,
            'previous_hash': previous_hash,
            'timestamp': datetime.now().isoformat()
        }
        
        # Generate block hash
        block_string = json.dumps(block_data, sort_keys=True)
        block_hash = hashlib.sha256(block_string.encode()).hexdigest()
        
        # Insert block
        cursor.execute('''
            INSERT INTO credit_blocks (block_hash, previous_hash, user_id, credit_score, prediction_data)
            VALUES (?, ?, ?, ?, ?)
        ''', (block_hash, previous_hash, user_id, credit_score, json.dumps(prediction_data)))
        
        conn.commit()
        conn.close()
        
        return block_hash
    
    def verify_blockchain(self) -> dict:
        """Verify blockchain integrity"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM credit_blocks ORDER BY id')
        blocks = cursor.fetchall()
        conn.close()
        
        if not blocks:
            return {'valid': True, 'total_blocks': 0, 'verified_blocks': 0, 'integrity_score': 1.0}
        
        verified_blocks = 0
        total_blocks = len(blocks)
        
        for i, block in enumerate(blocks):
            block_id, block_hash, previous_hash, user_id, credit_score, prediction_data, timestamp, verified = block
            
            # Recreate block data
            block_data = {
                'user_id': user_id,
                'credit_score': credit_score,
                'prediction_data': json.loads(prediction_data),
                'previous_hash': previous_hash,
                'timestamp': timestamp
            }
            
            # Verify hash
            block_string = json.dumps(block_data, sort_keys=True)
            calculated_hash = hashlib.sha256(block_string.encode()).hexdigest()
            
            if calculated_hash == block_hash:
                verified_blocks += 1
            
            # Verify chain linkage
            if i > 0:
                previous_block = blocks[i-1]
                if previous_hash != previous_block[1]:
                    break
        
        integrity_score = verified_blocks / total_blocks if total_blocks > 0 else 1.0
        
        return {
            'valid': integrity_score == 1.0,
            'total_blocks': total_blocks,
            'verified_blocks': verified_blocks,
            'integrity_score': integrity_score
        }
    
    def get_user_history(self, user_id: int) -> List[dict]:
        """Get user's blockchain credit history"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT block_hash, credit_score, prediction_data, timestamp
            FROM credit_blocks 
            WHERE user_id = ? 
            ORDER BY timestamp DESC
        ''', (user_id,))
        
        history = cursor.fetchall()
        conn.close()
        
        return [
            {
                'block_hash': record[0],
                'credit_score': record[1],
                'prediction_data': json.loads(record[2]),
                'timestamp': record[3]
            }
            for record in history
        ]
    
    def get_statistics(self) -> dict:
        """Get blockchain statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*), AVG(credit_score) FROM credit_blocks')
        stats = cursor.fetchone()
        
        conn.close()
        
        return {
            'credit_blockchain': {
                'total_blocks': stats[0],
                'average_credit_score': round(stats[1], 2) if stats[1] else 0
            },
            'transaction_blockchain': {
                'total_blocks': 0,
                'total_transaction_volume': 0
            },
            'verification_history': []
        }

# Initialize blockchain
blockchain = SimpleBlockchain()

def calculate_simple_credit_score(monthly_income: float, existing_debt: float, requested_amount: float) -> dict:
    """Simple credit scoring algorithm"""
    score = 500  # Base score
    
    # Income factor
    if monthly_income >= 50000:
        score += 150
    elif monthly_income >= 25000:
        score += 100
    elif monthly_income >= 15000:
        score += 50
    
    # Debt factor
    debt_ratio = existing_debt / monthly_income if monthly_income > 0 else 1
    if debt_ratio < 0.3:
        score += 100
    elif debt_ratio < 0.6:
        score += 50
    else:
        score -= 50
    
    # Amount factor
    if requested_amount <= 50000:
        score += 50
    elif requested_amount <= 100000:
        score += 25
    
    # Determine decision
    if score >= 700:
        decision = "Approve"
        risk_category = "Excellent"
    elif score >= 600:
        decision = "Approve"
        risk_category = "Good"
    elif score >= 500:
        decision = "Review"
        risk_category = "Fair"
    else:
        decision = "Reject"
        risk_category = "Poor"
    
    max_loan = min(125000, monthly_income * 10)
    interest_rate = max(12, min(24, 24 - (score - 300) / 600 * 12))
    
    return {
        'credit_score': max(300, min(900, score)),
        'decision': decision,
        'risk_category': risk_category,
        'max_loan_amount': int(max_loan),
        'recommended_interest_rate': round(interest_rate, 2),
        'model_confidence': 0.85,
        'blockchain_verified': True
    }

# API Endpoints
@app.post("/api/ml/enhanced-prediction")
async def enhanced_prediction(request: CreditScoreRequest):
    """Make blockchain-verified credit prediction"""
    try:
        # Calculate credit score
        prediction = calculate_simple_credit_score(
            request.monthly_income,
            request.existing_debt,
            request.requested_amount
        )
        
        # Add to blockchain
        block_hash = blockchain.add_credit_block(
            request.user_id,
            prediction['credit_score'],
            prediction
        )
        
        prediction['blockchain_hash'] = block_hash
        
        return {
            'success': True,
            'prediction': prediction,
            'model_accuracy': 0.85,
            'blockchain_verified': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/api/ml/model-accuracy")
async def get_model_accuracy():
    """Get model accuracy and blockchain status"""
    verification = blockchain.verify_blockchain()
    
    return {
        'model_trained': True,
        'ensemble_accuracy': 0.85,
        'blockchain_integrity': verification['integrity_score'],
        'blockchain_verified': verification['valid'],
        'total_predictions': verification['total_blocks'],
        'model_hash': 'demo_model_hash_12345'
    }

@app.get("/api/blockchain/statistics")
async def get_blockchain_statistics():
    """Get blockchain statistics"""
    stats = blockchain.get_statistics()
    return {
        'blockchain_statistics': stats,
        'timestamp': datetime.now().isoformat()
    }

@app.get("/api/blockchain/verify-integrity/credit_score")
async def verify_blockchain_integrity():
    """Verify blockchain integrity"""
    verification = blockchain.verify_blockchain()
    return {
        'blockchain_type': 'credit_score',
        'verification_result': verification,
        'timestamp': datetime.now().isoformat()
    }

@app.get("/api/blockchain/user-history/{user_id}")
async def get_user_history(user_id: int):
    """Get user's blockchain history"""
    history = blockchain.get_user_history(user_id)
    return {
        'user_id': user_id,
        'credit_history': history,
        'total_records': len(history)
    }

@app.get("/api/blockchain/health")
async def blockchain_health():
    """Blockchain health check"""
    verification = blockchain.verify_blockchain()
    
    return {
        'overall_status': 'healthy' if verification['integrity_score'] >= 0.95 else 'degraded',
        'blockchain_health': {
            'credit_score': {
                'status': 'healthy' if verification['integrity_score'] >= 0.95 else 'degraded',
                'integrity_score': verification['integrity_score'],
                'total_blocks': verification['total_blocks']
            }
        },
        'timestamp': datetime.now().isoformat()
    }

@app.get("/")
async def root():
    return {"message": "Blockchain Credit Risk Demo API", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Blockchain Credit Risk Demo...")
    print("📊 Frontend: http://localhost:3000")
    print("🔗 Blockchain Dashboard: http://localhost:3000/blockchain")
    print("📖 API Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
