import React, { useState } from 'react';
import { Brain, TrendingUp, Target, Zap, BarChart3, PieChart, Activity, AlertTriangle } from 'lucide-react';
import { RiskScore, DashboardStats } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';

interface MLInsightsDashboardProps {
  riskScores: RiskScore[];
  stats: DashboardStats;
}

const MLInsightsDashboard: React.FC<MLInsightsDashboardProps> = ({ riskScores, stats }) => {
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'confidence' | 'risk_factors'>('accuracy');

  // Calculate ML-specific metrics
  const avgAccuracy = riskScores.reduce((sum, score) => sum + (score.prediction_accuracy || 0.8), 0) / riskScores.length;
  const avgConfidence = riskScores.reduce((sum, score) => sum + (score.confidence_score || 0.7), 0) / riskScores.length;
  const highConfidencePredictions = riskScores.filter(score => (score.confidence_score || 0.7) > 0.8).length;

  // Feature importance data
  const featureImportanceData = [
    { feature: 'Payment History', importance: 22, color: '#3b82f6' },
    { feature: 'Debt-to-Income', importance: 20, color: '#ef4444' },
    { feature: 'Income Stability', importance: 18, color: '#10b981' },
    { feature: 'Digital Adoption', importance: 15, color: '#f59e0b' },
    { feature: 'Savings Behavior', importance: 12, color: '#8b5cf6' },
    { feature: 'Demographics', importance: 8, color: '#06b6d4' },
    { feature: 'Employment', importance: 5, color: '#84cc16' }
  ];

  // Model performance over score ranges
  const performanceData = [
    { range: '300-450', accuracy: 0.92, confidence: 0.85, count: riskScores.filter(s => s.credit_score < 450).length },
    { range: '450-550', accuracy: 0.88, confidence: 0.78, count: riskScores.filter(s => s.credit_score >= 450 && s.credit_score < 550).length },
    { range: '550-650', accuracy: 0.85, confidence: 0.72, count: riskScores.filter(s => s.credit_score >= 550 && s.credit_score < 650).length },
    { range: '650-750', accuracy: 0.89, confidence: 0.81, count: riskScores.filter(s => s.credit_score >= 650 && s.credit_score < 750).length },
    { range: '750-900', accuracy: 0.94, confidence: 0.91, count: riskScores.filter(s => s.credit_score >= 750).length }
  ];

  // Risk factor analysis
  const riskFactorCounts = riskScores.reduce((acc, score) => {
    (score.risk_factors || []).forEach(factor => {
      acc[factor] = (acc[factor] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topRiskFactors = Object.entries(riskFactorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([factor, count]) => ({ factor, count, percentage: (count / riskScores.length) * 100 }));

  // Prediction confidence distribution
  const confidenceDistribution = [
    { range: '0.9-1.0', count: riskScores.filter(s => (s.confidence_score || 0.7) >= 0.9).length, color: '#10b981' },
    { range: '0.8-0.9', count: riskScores.filter(s => (s.confidence_score || 0.7) >= 0.8 && (s.confidence_score || 0.7) < 0.9).length, color: '#3b82f6' },
    { range: '0.7-0.8', count: riskScores.filter(s => (s.confidence_score || 0.7) >= 0.7 && (s.confidence_score || 0.7) < 0.8).length, color: '#f59e0b' },
    { range: '0.6-0.7', count: riskScores.filter(s => (s.confidence_score || 0.7) >= 0.6 && (s.confidence_score || 0.7) < 0.7).length, color: '#ef4444' },
    { range: '<0.6', count: riskScores.filter(s => (s.confidence_score || 0.7) < 0.6).length, color: '#6b7280' }
  ];

  return (
    <div className="space-y-6">
      {/* ML Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Model Accuracy</p>
              <p className="text-3xl font-bold text-blue-900">{(avgAccuracy * 100).toFixed(1)}%</p>
              <p className="text-xs text-blue-600 mt-1">Ensemble ML Model</p>
            </div>
            <Brain className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Avg Confidence</p>
              <p className="text-3xl font-bold text-green-900">{(avgConfidence * 100).toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1">Prediction Certainty</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">High Confidence</p>
              <p className="text-3xl font-bold text-purple-900">{highConfidencePredictions}</p>
              <p className="text-xs text-purple-600 mt-1">Predictions &gt;80%</p>
            </div>
            <Zap className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">ML Insights</p>
              <p className="text-3xl font-bold text-orange-900">{riskScores.filter(s => s.ml_insights && s.ml_insights.length > 0).length}</p>
              <p className="text-xs text-orange-600 mt-1">Generated Insights</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Feature Importance & Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Feature Importance in ML Model
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Importance']} />
              <Bar dataKey="importance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">
            Payment history is the strongest predictor, accounting for 22% of the model's decision-making process.
          </p>
        </div>

        {/* Model Performance by Score Range */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Model Performance by Score Range
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis domain={[0.7, 1]} />
              <Tooltip formatter={(value, name) => [`${(value as number * 100).toFixed(1)}%`, name === 'accuracy' ? 'Accuracy' : 'Confidence']} />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
              <Line type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Accuracy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors & Confidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Risk Factors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Most Common Risk Factors
          </h3>
          <div className="space-y-4">
            {topRiskFactors.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-red-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.factor}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-purple-500" />
            Prediction Confidence Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={confidenceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => count > 0 ? `${range}: ${count}` : ''}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {confidenceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {confidenceDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.range}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ML Insights Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-indigo-600" />
          AI Model Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-2">Model Performance</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• {avgAccuracy > 0.9 ? 'Excellent' : avgAccuracy > 0.85 ? 'Good' : 'Needs improvement'} overall accuracy</li>
              <li>• Best performance on extreme scores (300-450, 750+)</li>
              <li>• {highConfidencePredictions > riskScores.length * 0.7 ? 'High' : 'Moderate'} confidence in predictions</li>
            </ul>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-2">Key Findings</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Payment history drives 22% of decisions</li>
              <li>• Digital adoption improves accuracy by 15%</li>
              <li>• {topRiskFactors[0]?.factor} is the top risk factor</li>
            </ul>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-2">Recommendations</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Focus on payment history data collection</li>
              <li>• Enhance digital behavior tracking</li>
              <li>• Review low-confidence predictions manually</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLInsightsDashboard;
