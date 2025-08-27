import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, Activity, Hash, Clock, TrendingUp, Database, ArrowLeft } from 'lucide-react';

interface BlockchainStats {
  credit_blockchain: {
    total_blocks: number;
    average_credit_score: number;
  };
  transaction_blockchain: {
    total_blocks: number;
    total_transaction_volume: number;
  };
  verification_history: Array<{
    blockchain_type: string;
    average_integrity_score: number;
    verification_count: number;
  }>;
}

interface ModelAccuracy {
  model_trained: boolean;
  ensemble_accuracy: number;
  blockchain_integrity: number;
  blockchain_verified: boolean;
  total_predictions: number;
  model_hash: string;
}

const BlockchainDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [blockchainStats, setBlockchainStats] = useState<BlockchainStats | null>(null);
  const [modelAccuracy, setModelAccuracy] = useState<ModelAccuracy | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch blockchain statistics
      const statsResponse = await fetch('http://localhost:8000/api/blockchain/statistics');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setBlockchainStats(statsData.blockchain_statistics);
      }

      // Fetch model accuracy
      const accuracyResponse = await fetch('http://localhost:8000/api/ml/model-accuracy');
      if (accuracyResponse.ok) {
        const accuracyData = await accuracyResponse.json();
        setModelAccuracy(accuracyData);
      }

      // Verify blockchain integrity
      const verificationResponse = await fetch('http://localhost:8000/api/blockchain/verify-integrity/credit_score');
      if (verificationResponse.ok) {
        const verificationData = await verificationResponse.json();
        setVerificationStatus(verificationData.verification_result);
      }

    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trainModel = async () => {
    try {
      setIsTraining(true);
      const response = await fetch('http://localhost:8000/api/ml/train-model', {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Model training completed:', result);
        await fetchBlockchainData(); // Refresh data
      }
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      setIsTraining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back to Home Button */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 -mx-6 px-6 py-3 mb-8">
          <button
            onClick={handleBackToHome}
            className="group flex items-center text-slate-600 hover:text-brand-600 transition-all duration-200 hover:bg-brand-50 px-3 py-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium text-sm sm:text-base">Back to Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🔗 Blockchain-Verified Credit Risk Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real-time Dynamic Scoring with Immutable Blockchain Technology for Maximum Reliability and Transparency
          </p>
        </div>

        {/* Model Training Section */}
        {!modelAccuracy?.model_trained && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">🧠 Real-time Dynamic Scoring Model</h3>
                <p className="text-blue-100">Initialize the dynamic scoring model for real-time predictions</p>
              </div>
              <button
                onClick={trainModel}
                disabled={isTraining}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {isTraining ? 'Initializing...' : 'Initialize Model'}
              </button>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Model Accuracy */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Model Accuracy</h3>
            <p className="text-3xl font-bold text-green-600">
              {modelAccuracy?.ensemble_accuracy ? `${(modelAccuracy.ensemble_accuracy * 100).toFixed(1)}%` : 'N/A'}
            </p>
            <p className="text-sm text-slate-500 mt-2">Deep Learning Ensemble</p>
          </div>

          {/* Blockchain Integrity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Blockchain Integrity</h3>
            <p className="text-3xl font-bold text-blue-600">
              {verificationStatus?.integrity_score ? `${(verificationStatus.integrity_score * 100).toFixed(1)}%` : 'N/A'}
            </p>
            <p className="text-sm text-slate-500 mt-2">Verified Immutable</p>
          </div>

          {/* Total Predictions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Predictions</h3>
            <p className="text-3xl font-bold text-purple-600">
              {blockchainStats?.credit_blockchain.total_blocks || 0}
            </p>
            <p className="text-sm text-slate-500 mt-2">Blockchain Verified</p>
          </div>

          {/* Average Credit Score */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Avg Credit Score</h3>
            <p className="text-3xl font-bold text-orange-600">
              {blockchainStats?.credit_blockchain.average_credit_score?.toFixed(0) || 'N/A'}
            </p>
            <p className="text-sm text-slate-500 mt-2">AI Calculated</p>
          </div>
        </div>

        {/* Blockchain Verification Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">🔗 Blockchain Verification</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-800">Credit Score Chain</span>
                </div>
                <span className="text-green-600 font-bold">
                  {verificationStatus?.valid ? '✅ Verified' : '❌ Invalid'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-800">Total Blocks</span>
                </div>
                <span className="text-blue-600 font-bold">
                  {verificationStatus?.total_blocks || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-purple-800">Verified Blocks</span>
                </div>
                <span className="text-purple-600 font-bold">
                  {verificationStatus?.verified_blocks || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Model Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">🧠 AI Model Details</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-indigo-800">Model Type</span>
                  <span className="text-indigo-600 font-bold">Dynamic Scoring</span>
                </div>
                <div className="text-sm text-indigo-600">
                  Real-time transaction analysis with payment behavior tracking
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-green-800">Training Status</span>
                  <span className="text-green-600 font-bold">
                    {modelAccuracy?.model_trained ? '✅ Trained' : '⏳ Pending'}
                  </span>
                </div>
                <div className="text-sm text-green-600">
                  {modelAccuracy?.model_trained ? 'Ready for real-time predictions' : 'Requires initialization'}
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-800">Blockchain Hash</span>
                  <span className="text-blue-600 font-bold">🔐 Secured</span>
                </div>
                <div className="text-xs text-blue-600 font-mono break-all">
                  {modelAccuracy?.model_hash?.substring(0, 32) || 'Not available'}...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">🚀 Enhanced Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Dynamic Scoring AI</h4>
              <p className="text-slate-300 text-sm">
                Real-time transaction analysis with behavioral pattern recognition for accurate micro-credit assessment
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Blockchain Security</h4>
              <p className="text-slate-300 text-sm">
                Immutable record-keeping with cryptographic verification for complete transparency and audit trails
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Real-time Analytics</h4>
              <p className="text-slate-300 text-sm">
                Live monitoring of model performance with continuous accuracy tracking and blockchain verification
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchBlockchainData}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            🔄 Refresh Blockchain Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDashboard;
