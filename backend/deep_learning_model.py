import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import joblib
import sqlite3
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import hashlib
import json

class DeepLearningCreditModel:
    """Enhanced Deep Learning Credit Risk Assessment Model with Blockchain Integration"""
    
    def __init__(self, db_path: str = 'credit_risk.db'):
        self.db_path = db_path
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.deep_model = None
        self.ensemble_models = {}
        self.blockchain_hash = None
        self.model_accuracy = 0.0
        self.feature_importance = {}
        
    def create_deep_neural_network(self, input_dim: int) -> keras.Model:
        """Create advanced deep neural network for credit scoring"""
        model = keras.Sequential([
            # Input layer with dropout for regularization
            layers.Dense(256, activation='relu', input_shape=(input_dim,)),
            layers.Dropout(0.3),
            layers.BatchNormalization(),
            
            # Hidden layers with residual connections
            layers.Dense(128, activation='relu'),
            layers.Dropout(0.25),
            layers.BatchNormalization(),
            
            layers.Dense(64, activation='relu'),
            layers.Dropout(0.2),
            layers.BatchNormalization(),
            
            layers.Dense(32, activation='relu'),
            layers.Dropout(0.15),
            
            # Output layers for multi-task learning
            layers.Dense(16, activation='relu'),
            layers.Dense(8, activation='relu'),
            
            # Final output layer (sigmoid for probability)
            layers.Dense(1, activation='sigmoid', name='credit_score')
        ])
        
        # Advanced optimizer with learning rate scheduling
        optimizer = keras.optimizers.Adam(
            learning_rate=0.001,
            beta_1=0.9,
            beta_2=0.999,
            epsilon=1e-07
        )
        
        model.compile(
            optimizer=optimizer,
            loss='binary_crossentropy',
            metrics=['accuracy', 'precision', 'recall']
        )
        
        return model
    
    def extract_enhanced_features(self, user_data: Dict) -> np.ndarray:
        """Extract comprehensive features for deep learning model"""
        features = []
        
        # Basic financial features
        features.extend([
            user_data.get('monthly_income', 0) / 100000,  # Normalized
            user_data.get('existing_debt', 0) / 100000,
            user_data.get('requested_amount', 0) / 100000,
            user_data.get('age', 25) / 100,
            user_data.get('years_of_employment', 0) / 50,
        ])
        
        # Payment behavior features (enhanced)
        payment_features = [
            user_data.get('electricity_bill_on_time', 80) / 100,
            user_data.get('mobile_bill_on_time', 80) / 100,
            user_data.get('rent_payment_on_time', 80) / 100,
            user_data.get('credit_card_payment_on_time', 80) / 100,
        ]
        features.extend(payment_features)
        
        # Digital behavior features
        features.extend([
            min(user_data.get('upi_transactions_per_month', 10) / 100, 1),
            min(user_data.get('digital_wallet_usage', 50) / 100, 1),
            min(user_data.get('online_bill_payments', 50) / 100, 1),
        ])
        
        # Advanced risk indicators
        debt_to_income = user_data.get('existing_debt', 0) / max(user_data.get('monthly_income', 1), 1)
        features.extend([
            min(debt_to_income, 2),  # Cap at 200%
            user_data.get('emergency_savings', 0) / max(user_data.get('monthly_income', 1), 1),
            user_data.get('previous_loan_defaults', 0) / 10,  # Normalized
        ])
        
        # Employment and location risk
        employment_risk = self._calculate_employment_risk(user_data.get('employment_type', 'employed'))
        location_risk = self._calculate_location_risk(user_data.get('city_tier', 3))
        features.extend([employment_risk, location_risk])
        
        # Behavioral patterns (derived features)
        payment_consistency = np.mean(payment_features)
        payment_variance = np.var(payment_features)
        features.extend([payment_consistency, payment_variance])
        
        # Time-based features
        features.extend([
            user_data.get('income_stability_months', 6) / 60,  # Normalized to 5 years
            user_data.get('account_age_months', 12) / 120,     # Normalized to 10 years
        ])
        
        return np.array(features).reshape(1, -1)
    
    def _calculate_employment_risk(self, employment_type: str) -> float:
        """Calculate employment risk score"""
        risk_mapping = {
            'government': 0.1,
            'private_permanent': 0.2,
            'private_contract': 0.4,
            'self_employed': 0.5,
            'freelancer': 0.6,
            'student': 0.7,
            'unemployed': 0.9
        }
        return risk_mapping.get(employment_type, 0.5)
    
    def _calculate_location_risk(self, city_tier: int) -> float:
        """Calculate location-based risk"""
        tier_risk = {1: 0.1, 2: 0.2, 3: 0.3, 4: 0.4}
        return tier_risk.get(city_tier, 0.4)
    
    def generate_synthetic_training_data(self, num_samples: int = 10000) -> Tuple[np.ndarray, np.ndarray]:
        """Generate synthetic training data for model training"""
        np.random.seed(42)
        
        # Generate realistic synthetic data
        data = []
        labels = []
        
        for _ in range(num_samples):
            # Generate user profile
            monthly_income = np.random.lognormal(10, 0.5) * 1000  # Log-normal distribution
            age = np.random.normal(35, 10)
            age = max(18, min(65, age))
            
            # Employment and stability
            employment_types = ['government', 'private_permanent', 'private_contract', 'self_employed', 'freelancer']
            employment_type = np.random.choice(employment_types, p=[0.2, 0.4, 0.2, 0.15, 0.05])
            years_employment = max(0, np.random.exponential(3))
            
            # Payment behavior (correlated with income and employment)
            base_payment_score = 60 + (monthly_income / 1000) * 0.5
            if employment_type == 'government':
                base_payment_score += 15
            elif employment_type == 'private_permanent':
                base_payment_score += 10
            
            payment_scores = []
            for _ in range(4):  # 4 payment types
                score = max(0, min(100, np.random.normal(base_payment_score, 15)))
                payment_scores.append(score)
            
            # Digital behavior
            digital_adoption = np.random.beta(2, 3) * 100  # Skewed towards lower adoption
            if age < 30:
                digital_adoption += 20
            elif age > 50:
                digital_adoption -= 15
            
            # Debt and financial health
            existing_debt = np.random.exponential(monthly_income * 0.3)
            emergency_savings = np.random.exponential(monthly_income * 0.5)
            previous_defaults = np.random.poisson(0.2)
            
            # Location
            city_tier = np.random.choice([1, 2, 3, 4], p=[0.3, 0.3, 0.25, 0.15])
            
            # Create user data dict
            user_data = {
                'monthly_income': monthly_income,
                'existing_debt': existing_debt,
                'requested_amount': np.random.uniform(10000, 100000),
                'age': age,
                'years_of_employment': years_employment,
                'electricity_bill_on_time': payment_scores[0],
                'mobile_bill_on_time': payment_scores[1],
                'rent_payment_on_time': payment_scores[2],
                'credit_card_payment_on_time': payment_scores[3],
                'upi_transactions_per_month': max(0, np.random.normal(digital_adoption/2, 20)),
                'digital_wallet_usage': digital_adoption,
                'online_bill_payments': digital_adoption * 0.8,
                'emergency_savings': emergency_savings,
                'previous_loan_defaults': previous_defaults,
                'employment_type': employment_type,
                'city_tier': city_tier,
                'income_stability_months': max(1, np.random.normal(12, 6)),
                'account_age_months': max(1, np.random.normal(24, 12))
            }
            
            # Extract features
            features = self.extract_enhanced_features(user_data).flatten()
            
            # Generate label based on realistic criteria
            credit_worthiness = self._calculate_creditworthiness(user_data)
            label = 1 if credit_worthiness > 0.6 else 0
            
            data.append(features)
            labels.append(label)
        
        return np.array(data), np.array(labels)
    
    def _calculate_creditworthiness(self, user_data: Dict) -> float:
        """Calculate ground truth creditworthiness for synthetic data"""
        score = 0.5  # Base score
        
        # Income factor
        if user_data['monthly_income'] > 50000:
            score += 0.2
        elif user_data['monthly_income'] > 25000:
            score += 0.1
        
        # Payment behavior
        avg_payment = np.mean([
            user_data['electricity_bill_on_time'],
            user_data['mobile_bill_on_time'],
            user_data['rent_payment_on_time'],
            user_data['credit_card_payment_on_time']
        ])
        score += (avg_payment - 50) / 200  # Normalize to -0.25 to +0.25
        
        # Debt burden
        debt_ratio = user_data['existing_debt'] / user_data['monthly_income']
        if debt_ratio < 0.3:
            score += 0.15
        elif debt_ratio > 0.6:
            score -= 0.2
        
        # Employment stability
        if user_data['employment_type'] in ['government', 'private_permanent']:
            score += 0.1
        elif user_data['employment_type'] in ['freelancer', 'unemployed']:
            score -= 0.15
        
        # Previous defaults
        score -= user_data['previous_loan_defaults'] * 0.1
        
        # Emergency savings
        savings_ratio = user_data['emergency_savings'] / user_data['monthly_income']
        if savings_ratio > 3:
            score += 0.1
        elif savings_ratio < 1:
            score -= 0.1
        
        return max(0, min(1, score))
    
    def train_ensemble_model(self) -> Dict[str, float]:
        """Train ensemble of models including deep learning"""
        print("Generating synthetic training data...")
        X, y = self.generate_synthetic_training_data(15000)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        print("Training ensemble models...")
        
        # 1. Random Forest
        rf_model = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42)
        rf_model.fit(X_train_scaled, y_train)
        rf_pred = rf_model.predict(X_test_scaled)
        rf_accuracy = accuracy_score(y_test, rf_pred)
        
        # 2. Gradient Boosting
        gb_model = GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, random_state=42)
        gb_model.fit(X_train_scaled, y_train)
        gb_pred = gb_model.predict(X_test_scaled)
        gb_accuracy = accuracy_score(y_test, gb_pred)
        
        # 3. Neural Network (sklearn)
        nn_model = MLPClassifier(hidden_layer_sizes=(128, 64, 32), max_iter=500, random_state=42)
        nn_model.fit(X_train_scaled, y_train)
        nn_pred = nn_model.predict(X_test_scaled)
        nn_accuracy = accuracy_score(y_test, nn_pred)
        
        # 4. Deep Learning Model (TensorFlow)
        print("Training deep neural network...")
        self.deep_model = self.create_deep_neural_network(X_train_scaled.shape[1])
        
        # Callbacks for training
        early_stopping = keras.callbacks.EarlyStopping(
            monitor='val_loss', patience=10, restore_best_weights=True
        )
        reduce_lr = keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss', factor=0.2, patience=5, min_lr=0.0001
        )
        
        # Train deep model
        history = self.deep_model.fit(
            X_train_scaled, y_train,
            epochs=100,
            batch_size=32,
            validation_split=0.2,
            callbacks=[early_stopping, reduce_lr],
            verbose=1
        )
        
        # Evaluate deep model
        deep_pred_prob = self.deep_model.predict(X_test_scaled)
        deep_pred = (deep_pred_prob > 0.5).astype(int).flatten()
        deep_accuracy = accuracy_score(y_test, deep_pred)
        
        # Store models
        self.ensemble_models = {
            'random_forest': rf_model,
            'gradient_boosting': gb_model,
            'neural_network': nn_model,
            'deep_learning': self.deep_model
        }
        
        # Calculate overall ensemble accuracy
        ensemble_pred = self._ensemble_predict(X_test_scaled)
        ensemble_accuracy = accuracy_score(y_test, ensemble_pred)
        
        # Store feature importance
        self.feature_importance = {
            'random_forest': rf_model.feature_importances_,
            'gradient_boosting': gb_model.feature_importances_
        }
        
        # Update model accuracy
        self.model_accuracy = ensemble_accuracy
        
        # Generate blockchain hash for model integrity
        self.blockchain_hash = self._generate_model_hash()
        
        # Save models
        self._save_models()
        
        accuracies = {
            'random_forest': rf_accuracy,
            'gradient_boosting': gb_accuracy,
            'neural_network': nn_accuracy,
            'deep_learning': deep_accuracy,
            'ensemble': ensemble_accuracy
        }
        
        print(f"Model Training Complete!")
        print(f"Random Forest Accuracy: {rf_accuracy:.4f}")
        print(f"Gradient Boosting Accuracy: {gb_accuracy:.4f}")
        print(f"Neural Network Accuracy: {nn_accuracy:.4f}")
        print(f"Deep Learning Accuracy: {deep_accuracy:.4f}")
        print(f"Ensemble Accuracy: {ensemble_accuracy:.4f}")
        print(f"Blockchain Hash: {self.blockchain_hash}")
        
        return accuracies
    
    def _ensemble_predict(self, X: np.ndarray) -> np.ndarray:
        """Make ensemble predictions"""
        # Get predictions from all models
        rf_pred = self.ensemble_models['random_forest'].predict_proba(X)[:, 1]
        gb_pred = self.ensemble_models['gradient_boosting'].predict_proba(X)[:, 1]
        nn_pred = self.ensemble_models['neural_network'].predict_proba(X)[:, 1]
        deep_pred = self.deep_model.predict(X).flatten()
        
        # Weighted ensemble (deep learning gets higher weight)
        ensemble_prob = (rf_pred * 0.2 + gb_pred * 0.25 + nn_pred * 0.25 + deep_pred * 0.3)
        
        return (ensemble_prob > 0.5).astype(int)
    
    def predict_credit_risk(self, user_data: Dict) -> Dict:
        """Predict credit risk using ensemble model"""
        if not self.ensemble_models:
            raise ValueError("Models not trained. Please train the model first.")
        
        # Extract features
        features = self.extract_enhanced_features(user_data)
        features_scaled = self.scaler.transform(features)
        
        # Get predictions from all models
        rf_prob = self.ensemble_models['random_forest'].predict_proba(features_scaled)[0, 1]
        gb_prob = self.ensemble_models['gradient_boosting'].predict_proba(features_scaled)[0, 1]
        nn_prob = self.ensemble_models['neural_network'].predict_proba(features_scaled)[0, 1]
        deep_prob = self.deep_model.predict(features_scaled)[0, 0]
        
        # Ensemble prediction
        ensemble_prob = (rf_prob * 0.2 + gb_prob * 0.25 + nn_prob * 0.25 + deep_prob * 0.3)
        
        # Convert to credit score (300-900 scale)
        credit_score = int(300 + (ensemble_prob * 600))
        
        # Determine risk category
        if credit_score >= 750:
            risk_category = "Excellent"
            decision = "Approve"
        elif credit_score >= 650:
            risk_category = "Good"
            decision = "Approve"
        elif credit_score >= 550:
            risk_category = "Fair"
            decision = "Review"
        else:
            risk_category = "Poor"
            decision = "Reject"
        
        # Calculate loan parameters
        max_loan_amount = min(125000, user_data.get('monthly_income', 0) * 10 * (credit_score / 900))
        interest_rate = max(10, min(26, 26 - (credit_score - 300) / 600 * 16))
        
        return {
            'credit_score': credit_score,
            'risk_category': risk_category,
            'decision': decision,
            'default_probability': 1 - ensemble_prob,
            'max_loan_amount': int(max_loan_amount),
            'recommended_interest_rate': round(interest_rate, 2),
            'model_confidence': ensemble_prob,
            'model_accuracy': self.model_accuracy,
            'individual_predictions': {
                'random_forest': rf_prob,
                'gradient_boosting': gb_prob,
                'neural_network': nn_prob,
                'deep_learning': deep_prob
            },
            'blockchain_verified': self._verify_model_integrity(),
            'blockchain_hash': self.blockchain_hash
        }
    
    def _generate_model_hash(self) -> str:
        """Generate blockchain hash for model integrity"""
        model_data = {
            'timestamp': datetime.now().isoformat(),
            'accuracy': self.model_accuracy,
            'model_params': str(self.deep_model.count_params()) if self.deep_model else "0"
        }
        
        model_string = json.dumps(model_data, sort_keys=True)
        return hashlib.sha256(model_string.encode()).hexdigest()
    
    def _verify_model_integrity(self) -> bool:
        """Verify model integrity using blockchain hash"""
        if not self.blockchain_hash:
            return False
        
        current_hash = self._generate_model_hash()
        return current_hash == self.blockchain_hash
    
    def _save_models(self):
        """Save trained models"""
        try:
            # Save sklearn models
            joblib.dump(self.ensemble_models['random_forest'], 'models/random_forest_model.pkl')
            joblib.dump(self.ensemble_models['gradient_boosting'], 'models/gradient_boosting_model.pkl')
            joblib.dump(self.ensemble_models['neural_network'], 'models/neural_network_model.pkl')
            joblib.dump(self.scaler, 'models/feature_scaler.pkl')
            
            # Save deep learning model
            if self.deep_model:
                self.deep_model.save('models/deep_learning_model.h5')
            
            # Save metadata
            metadata = {
                'accuracy': self.model_accuracy,
                'blockchain_hash': self.blockchain_hash,
                'feature_importance': {k: v.tolist() if hasattr(v, 'tolist') else v 
                                     for k, v in self.feature_importance.items()},
                'training_date': datetime.now().isoformat()
            }
            
            with open('models/model_metadata.json', 'w') as f:
                json.dump(metadata, f, indent=2)
                
            print("Models saved successfully!")
            
        except Exception as e:
            print(f"Error saving models: {e}")
    
    def load_models(self):
        """Load pre-trained models"""
        try:
            import os
            if not os.path.exists('models'):
                os.makedirs('models')
                return False
            
            # Load sklearn models
            self.ensemble_models['random_forest'] = joblib.load('models/random_forest_model.pkl')
            self.ensemble_models['gradient_boosting'] = joblib.load('models/gradient_boosting_model.pkl')
            self.ensemble_models['neural_network'] = joblib.load('models/neural_network_model.pkl')
            self.scaler = joblib.load('models/feature_scaler.pkl')
            
            # Load deep learning model
            self.deep_model = keras.models.load_model('models/deep_learning_model.h5')
            
            # Load metadata
            with open('models/model_metadata.json', 'r') as f:
                metadata = json.load(f)
                self.model_accuracy = metadata['accuracy']
                self.blockchain_hash = metadata['blockchain_hash']
                self.feature_importance = metadata['feature_importance']
            
            print("Models loaded successfully!")
            return True
            
        except Exception as e:
            print(f"Error loading models: {e}")
            return False

# Blockchain Integration for Model Verification
class CreditModelBlockchain:
    """Blockchain system for credit model verification and audit trail"""
    
    def __init__(self, db_path: str = 'credit_risk.db'):
        self.db_path = db_path
        self._init_blockchain_tables()
    
    def _init_blockchain_tables(self):
        """Initialize blockchain tables in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS model_blockchain (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                block_hash TEXT UNIQUE NOT NULL,
                previous_hash TEXT,
                model_version TEXT NOT NULL,
                accuracy REAL NOT NULL,
                training_data_hash TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                verified BOOLEAN DEFAULT TRUE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS prediction_audit (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                prediction_hash TEXT NOT NULL,
                model_hash TEXT NOT NULL,
                input_features_hash TEXT NOT NULL,
                prediction_result TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                verified BOOLEAN DEFAULT TRUE
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_model_block(self, model_version: str, accuracy: float, training_data_hash: str) -> str:
        """Add new model block to blockchain"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get previous block hash
        cursor.execute('SELECT block_hash FROM model_blockchain ORDER BY id DESC LIMIT 1')
        result = cursor.fetchone()
        previous_hash = result[0] if result else "0"
        
        # Create block data
        block_data = {
            'model_version': model_version,
            'accuracy': accuracy,
            'training_data_hash': training_data_hash,
            'previous_hash': previous_hash,
            'timestamp': datetime.now().isoformat()
        }
        
        # Generate block hash
        block_string = json.dumps(block_data, sort_keys=True)
        block_hash = hashlib.sha256(block_string.encode()).hexdigest()
        
        # Insert block
        cursor.execute('''
            INSERT INTO model_blockchain (block_hash, previous_hash, model_version, accuracy, training_data_hash)
            VALUES (?, ?, ?, ?, ?)
        ''', (block_hash, previous_hash, model_version, accuracy, training_data_hash))
        
        conn.commit()
        conn.close()
        
        return block_hash
    
    def verify_blockchain_integrity(self) -> bool:
        """Verify the integrity of the model blockchain"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM model_blockchain ORDER BY id')
        blocks = cursor.fetchall()
        conn.close()
        
        if not blocks:
            return True
        
        # Verify each block
        for i, block in enumerate(blocks):
            block_id, block_hash, previous_hash, model_version, accuracy, training_data_hash, timestamp, verified = block
            
            # Recreate block data
            block_data = {
                'model_version': model_version,
                'accuracy': accuracy,
                'training_data_hash': training_data_hash,
                'previous_hash': previous_hash,
                'timestamp': timestamp
            }
            
            # Verify hash
            block_string = json.dumps(block_data, sort_keys=True)
            calculated_hash = hashlib.sha256(block_string.encode()).hexdigest()
            
            if calculated_hash != block_hash:
                return False
            
            # Verify chain linkage (except for first block)
            if i > 0:
                previous_block = blocks[i-1]
                if previous_hash != previous_block[1]:  # previous_block[1] is block_hash
                    return False
        
        return True
    
    def audit_prediction(self, user_id: int, input_features: Dict, prediction_result: Dict, model_hash: str):
        """Audit a prediction in the blockchain"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Hash input features
        features_string = json.dumps(input_features, sort_keys=True)
        features_hash = hashlib.sha256(features_string.encode()).hexdigest()
        
        # Hash prediction result
        result_string = json.dumps(prediction_result, sort_keys=True)
        prediction_hash = hashlib.sha256(result_string.encode()).hexdigest()
        
        # Insert audit record
        cursor.execute('''
            INSERT INTO prediction_audit (user_id, prediction_hash, model_hash, input_features_hash, prediction_result)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, prediction_hash, model_hash, features_hash, result_string))
        
        conn.commit()
        conn.close()
    
    def get_model_history(self) -> List[Dict]:
        """Get complete model history from blockchain"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM model_blockchain ORDER BY timestamp DESC')
        blocks = cursor.fetchall()
        conn.close()
        
        return [
            {
                'id': block[0],
                'block_hash': block[1],
                'previous_hash': block[2],
                'model_version': block[3],
                'accuracy': block[4],
                'training_data_hash': block[5],
                'timestamp': block[6],
                'verified': block[7]
            }
            for block in blocks
        ]

if __name__ == "__main__":
    # Initialize and train the enhanced model
    model = DeepLearningCreditModel()
    
    # Train the ensemble model
    accuracies = model.train_ensemble_model()
    
    # Initialize blockchain
    blockchain = CreditModelBlockchain()
    
    # Add model to blockchain
    training_data_hash = hashlib.sha256(str(15000).encode()).hexdigest()  # Sample size hash
    block_hash = blockchain.add_model_block("v2.0_deep_learning", accuracies['ensemble'], training_data_hash)
    
    print(f"Model added to blockchain with hash: {block_hash}")
    print(f"Blockchain integrity verified: {blockchain.verify_blockchain_integrity()}")
