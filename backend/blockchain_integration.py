from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional
import sqlite3
from sqlalchemy.orm import Session

# Blockchain Router for API endpoints
blockchain_router = APIRouter(prefix="/api/blockchain", tags=["blockchain"])

class BlockchainTransaction(BaseModel):
    user_id: int
    transaction_type: str
    amount: float
    timestamp: str
    previous_hash: str

class CreditScoreBlock(BaseModel):
    user_id: int
    credit_score: int
    model_version: str
    prediction_confidence: float
    risk_factors: List[str]

class BlockchainVerification(BaseModel):
    block_hash: str
    is_valid: bool
    verification_timestamp: str

class CreditBlockchain:
    """Enhanced Blockchain system for credit scoring transparency and immutability"""
    
    def __init__(self, db_path: str = 'credit_risk.db'):
        self.db_path = db_path
        self._init_blockchain_tables()
        self.difficulty = 4  # Mining difficulty for proof of work
    
    def _init_blockchain_tables(self):
        """Initialize comprehensive blockchain tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Credit score blockchain
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS credit_score_blockchain (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                block_hash TEXT UNIQUE NOT NULL,
                previous_hash TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                credit_score INTEGER NOT NULL,
                model_version TEXT NOT NULL,
                prediction_confidence REAL NOT NULL,
                risk_factors TEXT NOT NULL,
                merkle_root TEXT NOT NULL,
                nonce INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                miner_id TEXT DEFAULT 'system',
                block_size INTEGER DEFAULT 0,
                verified BOOLEAN DEFAULT TRUE
            )
        ''')
        
        # Transaction blockchain for financial history
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transaction_blockchain (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                block_hash TEXT UNIQUE NOT NULL,
                previous_hash TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                transaction_type TEXT NOT NULL,
                amount REAL NOT NULL,
                transaction_hash TEXT NOT NULL,
                merkle_root TEXT NOT NULL,
                nonce INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                verified BOOLEAN DEFAULT TRUE
            )
        ''')
        
        # Model versioning blockchain
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS model_version_blockchain (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                block_hash TEXT UNIQUE NOT NULL,
                previous_hash TEXT NOT NULL,
                model_version TEXT NOT NULL,
                accuracy REAL NOT NULL,
                training_data_hash TEXT NOT NULL,
                algorithm_hash TEXT NOT NULL,
                deployment_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                nonce INTEGER NOT NULL,
                verified BOOLEAN DEFAULT TRUE
            )
        ''')
        
        # Audit trail for all predictions
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS prediction_audit_blockchain (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                block_hash TEXT UNIQUE NOT NULL,
                previous_hash TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                input_data_hash TEXT NOT NULL,
                prediction_hash TEXT NOT NULL,
                model_hash TEXT NOT NULL,
                prediction_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                auditor_signature TEXT,
                nonce INTEGER NOT NULL,
                verified BOOLEAN DEFAULT TRUE
            )
        ''')
        
        # Blockchain integrity verification log
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS blockchain_verification_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                blockchain_type TEXT NOT NULL,
                total_blocks INTEGER NOT NULL,
                verified_blocks INTEGER NOT NULL,
                integrity_score REAL NOT NULL,
                verification_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                verification_hash TEXT NOT NULL
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def calculate_merkle_root(self, transactions: List[str]) -> str:
        """Calculate Merkle root for block integrity"""
        if not transactions:
            return hashlib.sha256(b'').hexdigest()
        
        if len(transactions) == 1:
            return hashlib.sha256(transactions[0].encode()).hexdigest()
        
        # Pair up transactions and hash them
        next_level = []
        for i in range(0, len(transactions), 2):
            if i + 1 < len(transactions):
                combined = transactions[i] + transactions[i + 1]
            else:
                combined = transactions[i] + transactions[i]  # Duplicate if odd number
            
            next_level.append(hashlib.sha256(combined.encode()).hexdigest())
        
        return self.calculate_merkle_root(next_level)
    
    def proof_of_work(self, block_data: str) -> int:
        """Simple proof of work algorithm"""
        nonce = 0
        target = "0" * self.difficulty
        
        while True:
            hash_attempt = hashlib.sha256(f"{block_data}{nonce}".encode()).hexdigest()
            if hash_attempt.startswith(target):
                return nonce
            nonce += 1
            
            # Prevent infinite loop in demo
            if nonce > 1000000:
                break
        
        return nonce
    
    def add_credit_score_block(self, user_id: int, credit_score: int, model_version: str, 
                              prediction_confidence: float, risk_factors: List[str]) -> str:
        """Add credit score to blockchain with enhanced security"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get previous block hash
        cursor.execute('SELECT block_hash FROM credit_score_blockchain ORDER BY id DESC LIMIT 1')
        result = cursor.fetchone()
        previous_hash = result[0] if result else "0" * 64
        
        # Create block data
        block_data = {
            'user_id': user_id,
            'credit_score': credit_score,
            'model_version': model_version,
            'prediction_confidence': prediction_confidence,
            'risk_factors': risk_factors,
            'previous_hash': previous_hash,
            'timestamp': datetime.now().isoformat()
        }
        
        # Calculate Merkle root
        transactions = [json.dumps(block_data, sort_keys=True)]
        merkle_root = self.calculate_merkle_root(transactions)
        
        # Proof of work
        block_string = json.dumps(block_data, sort_keys=True) + merkle_root
        nonce = self.proof_of_work(block_string)
        
        # Generate final block hash
        final_block_data = block_string + str(nonce)
        block_hash = hashlib.sha256(final_block_data.encode()).hexdigest()
        
        # Insert block
        cursor.execute('''
            INSERT INTO credit_score_blockchain 
            (block_hash, previous_hash, user_id, credit_score, model_version, 
             prediction_confidence, risk_factors, merkle_root, nonce)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (block_hash, previous_hash, user_id, credit_score, model_version,
              prediction_confidence, json.dumps(risk_factors), merkle_root, nonce))
        
        conn.commit()
        conn.close()
        
        return block_hash
    
    def add_transaction_block(self, user_id: int, transaction_type: str, amount: float) -> str:
        """Add financial transaction to blockchain"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get previous block hash
        cursor.execute('SELECT block_hash FROM transaction_blockchain ORDER BY id DESC LIMIT 1')
        result = cursor.fetchone()
        previous_hash = result[0] if result else "0" * 64
        
        # Create transaction hash
        transaction_data = {
            'user_id': user_id,
            'transaction_type': transaction_type,
            'amount': amount,
            'timestamp': datetime.now().isoformat()
        }
        transaction_hash = hashlib.sha256(json.dumps(transaction_data, sort_keys=True).encode()).hexdigest()
        
        # Calculate Merkle root
        merkle_root = self.calculate_merkle_root([transaction_hash])
        
        # Proof of work
        block_string = f"{previous_hash}{transaction_hash}{merkle_root}"
        nonce = self.proof_of_work(block_string)
        
        # Generate block hash
        final_block_data = block_string + str(nonce)
        block_hash = hashlib.sha256(final_block_data.encode()).hexdigest()
        
        # Insert block
        cursor.execute('''
            INSERT INTO transaction_blockchain 
            (block_hash, previous_hash, user_id, transaction_type, amount, 
             transaction_hash, merkle_root, nonce)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (block_hash, previous_hash, user_id, transaction_type, amount,
              transaction_hash, merkle_root, nonce))
        
        conn.commit()
        conn.close()
        
        return block_hash
    
    def verify_blockchain_integrity(self, blockchain_type: str = 'credit_score') -> Dict:
        """Comprehensive blockchain integrity verification"""
        table_map = {
            'credit_score': 'credit_score_blockchain',
            'transaction': 'transaction_blockchain',
            'model_version': 'model_version_blockchain',
            'prediction_audit': 'prediction_audit_blockchain'
        }
        
        table_name = table_map.get(blockchain_type, 'credit_score_blockchain')
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute(f'SELECT * FROM {table_name} ORDER BY id')
        blocks = cursor.fetchall()
        
        if not blocks:
            return {'valid': True, 'total_blocks': 0, 'verified_blocks': 0, 'integrity_score': 1.0}
        
        verified_blocks = 0
        total_blocks = len(blocks)
        
        for i, block in enumerate(blocks):
            # Verify block hash and proof of work
            if self._verify_single_block(block, blockchain_type):
                verified_blocks += 1
            
            # Verify chain linkage (except for genesis block)
            if i > 0:
                previous_block = blocks[i-1]
                if blockchain_type == 'credit_score':
                    if block[2] != previous_block[1]:  # previous_hash != previous block_hash
                        break
                elif blockchain_type == 'transaction':
                    if block[2] != previous_block[1]:
                        break
        
        integrity_score = verified_blocks / total_blocks if total_blocks > 0 else 1.0
        
        # Log verification
        verification_data = {
            'blockchain_type': blockchain_type,
            'total_blocks': total_blocks,
            'verified_blocks': verified_blocks,
            'integrity_score': integrity_score,
            'timestamp': datetime.now().isoformat()
        }
        
        verification_hash = hashlib.sha256(json.dumps(verification_data, sort_keys=True).encode()).hexdigest()
        
        cursor.execute('''
            INSERT INTO blockchain_verification_log 
            (blockchain_type, total_blocks, verified_blocks, integrity_score, verification_hash)
            VALUES (?, ?, ?, ?, ?)
        ''', (blockchain_type, total_blocks, verified_blocks, integrity_score, verification_hash))
        
        conn.commit()
        conn.close()
        
        return {
            'valid': integrity_score == 1.0,
            'total_blocks': total_blocks,
            'verified_blocks': verified_blocks,
            'integrity_score': integrity_score,
            'verification_hash': verification_hash
        }
    
    def _verify_single_block(self, block: tuple, blockchain_type: str) -> bool:
        """Verify a single block's integrity"""
        try:
            if blockchain_type == 'credit_score':
                block_id, block_hash, previous_hash, user_id, credit_score, model_version, \
                prediction_confidence, risk_factors, merkle_root, nonce, timestamp, miner_id, block_size, verified = block
                
                # Recreate block data
                block_data = {
                    'user_id': user_id,
                    'credit_score': credit_score,
                    'model_version': model_version,
                    'prediction_confidence': prediction_confidence,
                    'risk_factors': json.loads(risk_factors),
                    'previous_hash': previous_hash,
                    'timestamp': timestamp
                }
                
                block_string = json.dumps(block_data, sort_keys=True) + merkle_root
                final_block_data = block_string + str(nonce)
                calculated_hash = hashlib.sha256(final_block_data.encode()).hexdigest()
                
                return calculated_hash == block_hash
            
            elif blockchain_type == 'transaction':
                block_id, block_hash, previous_hash, user_id, transaction_type, amount, \
                transaction_hash, merkle_root, nonce, timestamp, verified = block
                
                block_string = f"{previous_hash}{transaction_hash}{merkle_root}"
                final_block_data = block_string + str(nonce)
                calculated_hash = hashlib.sha256(final_block_data.encode()).hexdigest()
                
                return calculated_hash == block_hash
            
            return False
            
        except Exception:
            return False
    
    def get_user_credit_history(self, user_id: int) -> List[Dict]:
        """Get complete credit history for a user from blockchain"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT block_hash, credit_score, model_version, prediction_confidence, 
                   risk_factors, timestamp, verified
            FROM credit_score_blockchain 
            WHERE user_id = ? 
            ORDER BY timestamp DESC
        ''', (user_id,))
        
        history = cursor.fetchall()
        conn.close()
        
        return [
            {
                'block_hash': record[0],
                'credit_score': record[1],
                'model_version': record[2],
                'prediction_confidence': record[3],
                'risk_factors': json.loads(record[4]),
                'timestamp': record[5],
                'blockchain_verified': record[6]
            }
            for record in history
        ]
    
    def get_blockchain_statistics(self) -> Dict:
        """Get comprehensive blockchain statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        stats = {}
        
        # Credit score blockchain stats
        cursor.execute('SELECT COUNT(*), AVG(credit_score) FROM credit_score_blockchain')
        credit_stats = cursor.fetchone()
        stats['credit_blockchain'] = {
            'total_blocks': credit_stats[0],
            'average_credit_score': round(credit_stats[1], 2) if credit_stats[1] else 0
        }
        
        # Transaction blockchain stats
        cursor.execute('SELECT COUNT(*), SUM(amount) FROM transaction_blockchain')
        transaction_stats = cursor.fetchone()
        stats['transaction_blockchain'] = {
            'total_blocks': transaction_stats[0],
            'total_transaction_volume': round(transaction_stats[1], 2) if transaction_stats[1] else 0
        }
        
        # Verification stats
        cursor.execute('''
            SELECT blockchain_type, AVG(integrity_score), COUNT(*) 
            FROM blockchain_verification_log 
            GROUP BY blockchain_type
        ''')
        verification_stats = cursor.fetchall()
        stats['verification_history'] = [
            {
                'blockchain_type': record[0],
                'average_integrity_score': round(record[1], 4),
                'verification_count': record[2]
            }
            for record in verification_stats
        ]
        
        conn.close()
        return stats

# Initialize blockchain instance
credit_blockchain = CreditBlockchain()

# API Endpoints
@blockchain_router.post("/add-credit-score")
async def add_credit_score_to_blockchain(
    user_id: int,
    credit_score: int,
    model_version: str,
    prediction_confidence: float,
    risk_factors: List[str]
):
    """Add credit score to blockchain"""
    try:
        block_hash = credit_blockchain.add_credit_score_block(
            user_id, credit_score, model_version, prediction_confidence, risk_factors
        )
        
        return {
            'success': True,
            'block_hash': block_hash,
            'message': 'Credit score added to blockchain successfully'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding to blockchain: {str(e)}")

@blockchain_router.post("/add-transaction")
async def add_transaction_to_blockchain(
    user_id: int,
    transaction_type: str,
    amount: float
):
    """Add transaction to blockchain"""
    try:
        block_hash = credit_blockchain.add_transaction_block(user_id, transaction_type, amount)
        
        return {
            'success': True,
            'block_hash': block_hash,
            'message': 'Transaction added to blockchain successfully'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding transaction: {str(e)}")

@blockchain_router.get("/verify-integrity/{blockchain_type}")
async def verify_blockchain_integrity(blockchain_type: str):
    """Verify blockchain integrity"""
    try:
        verification_result = credit_blockchain.verify_blockchain_integrity(blockchain_type)
        
        return {
            'blockchain_type': blockchain_type,
            'verification_result': verification_result,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying blockchain: {str(e)}")

@blockchain_router.get("/user-history/{user_id}")
async def get_user_blockchain_history(user_id: int):
    """Get user's complete blockchain history"""
    try:
        credit_history = credit_blockchain.get_user_credit_history(user_id)
        
        return {
            'user_id': user_id,
            'credit_history': credit_history,
            'total_records': len(credit_history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@blockchain_router.get("/statistics")
async def get_blockchain_statistics():
    """Get comprehensive blockchain statistics"""
    try:
        stats = credit_blockchain.get_blockchain_statistics()
        
        return {
            'blockchain_statistics': stats,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")

@blockchain_router.get("/health")
async def blockchain_health_check():
    """Health check for blockchain system"""
    try:
        # Verify all blockchain types
        health_status = {}
        blockchain_types = ['credit_score', 'transaction']
        
        for blockchain_type in blockchain_types:
            verification = credit_blockchain.verify_blockchain_integrity(blockchain_type)
            health_status[blockchain_type] = {
                'status': 'healthy' if verification['integrity_score'] >= 0.95 else 'degraded',
                'integrity_score': verification['integrity_score'],
                'total_blocks': verification['total_blocks']
            }
        
        overall_health = all(status['status'] == 'healthy' for status in health_status.values())
        
        return {
            'overall_status': 'healthy' if overall_health else 'degraded',
            'blockchain_health': health_status,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")
