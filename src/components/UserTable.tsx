import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Shield, AlertTriangle, CheckCircle, XCircle, Brain, Zap } from 'lucide-react';
import { RiskScore } from '../types';

interface UserTableProps {
  riskScores: RiskScore[];
}

const UserTable: React.FC<UserTableProps> = ({ riskScores }) => {
  const [sortField, setSortField] = useState<keyof RiskScore>('credit_score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterDecision, setFilterDecision] = useState<string>('all');

  const handleSort = (field: keyof RiskScore) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = riskScores
    .filter(score => filterDecision === 'all' || score.decision === filterDecision)
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const label = sortField.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return 0;
    });

  const getRiskBandColor = (riskBand: string) => {
    switch (riskBand) {
      case 'Excellent':
        return 'bg-success-100 text-success-800';
      case 'Good':
        return 'bg-primary-100 text-primary-800';
      case 'Fair':
        return 'bg-warning-100 text-warning-800';
      case 'Poor':
      case 'Very Poor':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'Approve':
        return 'bg-success-100 text-success-800';
      case 'Review':
        return 'bg-warning-100 text-warning-800';
      case 'Reject':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = [
      'User ID', 'Credit Score', 'Risk Band', 'Decision', 'RBI Compliant', 
      'Max Eligible Amount', 'EMI Ratio', 'ML Confidence', 'Prediction Accuracy',
      'Improvement Suggestions', 'RBI Violations', 'ML Insights', 'Risk Factors'
    ];
    
    const csvData = [
      headers.join(','),
      ...filteredAndSortedData.map(score => [
        score.user_id,
        score.credit_score,
        score.risk_band,
        score.decision,
        score.rbi_compliant ? 'Yes' : 'No',
        score.max_eligible_amount,
        score.emi_to_income_ratio + '%',
        ((score.confidence_score || 0.7) * 100).toFixed(1) + '%',
        ((score.prediction_accuracy || 0.8) * 100).toFixed(1) + '%',
        `"${score.improvement_suggestions.join('; ')}"`,
        `"${score.rbi_violations.join('; ')}"`,
        `"${(score.ml_insights || []).join('; ')}"`,
        `"${(score.risk_factors || []).join('; ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'credit_analysis_results.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const SortIcon = ({ field }: { field: keyof RiskScore }) => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-primary-600" />
      : <ChevronDown className="h-4 w-4 text-primary-600" />;
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-medium border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-auto">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Decision
              </label>
              <select
                id="filter"
                value={filterDecision}
                onChange={(e) => setFilterDecision(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Decisions</option>
                <option value="Approve">Approved</option>
                <option value="Review">Under Review</option>
                <option value="Reject">Rejected</option>
              </select>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Showing {filteredAndSortedData.length} of {riskScores.length} users
            </div>
          </div>
          
          <button
            onClick={exportToCSV}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {filteredAndSortedData.map((score) => (
            <div key={score.user_id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="font-medium text-gray-900">{score.user_id}</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDecisionColor(score.decision)}`}>
                  {score.decision}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Credit Score:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{score.credit_score}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score.credit_score >= 750 ? 'bg-success-500' :
                          score.credit_score >= 650 ? 'bg-primary-500' :
                          score.credit_score >= 550 ? 'bg-warning-500' : 'bg-danger-500'
                        }`}
                        style={{ width: `${((score.credit_score - 300) / 600) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risk Band:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskBandColor(score.risk_band)}`}>
                    {score.risk_band}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">RBI Compliant:</span>
                  <div className="flex items-center">
                    {score.rbi_compliant ? (
                      <CheckCircle className="h-4 w-4 text-success-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-danger-500" />
                    )}
                    <span className={`ml-1 text-sm ${score.rbi_compliant ? 'text-success-700' : 'text-danger-700'}`}>
                      {score.rbi_compliant ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Max Loan:</span>
                  <span className="text-sm text-gray-900">₹{((score.max_eligible_amount || 0)/1000).toFixed(0)}K</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">EMI Ratio:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-900">{(score.emi_to_income_ratio || 0).toFixed(1)}%</span>
                    {(score.emi_to_income_ratio || 0) > 50 && (
                      <AlertTriangle className="h-3 w-3 text-warning-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ML Confidence:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-900">{((score.confidence_score || 0.7) * 100).toFixed(1)}%</span>
                    {(score.confidence_score || 0.7) > 0.8 ? (
                      <Zap className="h-3 w-3 text-green-500" />
                    ) : (
                      <Brain className="h-3 w-3 text-blue-500" />
                    )}
                  </div>
                </div>
                
                <details className="mt-3">
                  <summary className="cursor-pointer text-primary-600 hover:text-primary-800 text-sm font-medium">
                    View Details & ML Insights
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">ML Insights:</p>
                      <div className="space-y-1">
                        {(score.ml_insights || ['No ML insights available']).slice(0, 3).map((insight, index) => (
                          <div key={index} className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-800">
                            <Brain className="h-3 w-3 inline mr-1" />
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Improvement Suggestions:</p>
                      <div className="space-y-1">
                        {score.improvement_suggestions.slice(0, 3).map((suggestion, index) => (
                          <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                    {(score.risk_factors || []).length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-orange-700 mb-1">Risk Factors:</p>
                        <div className="space-y-1">
                          {(score.risk_factors || []).map((factor, index) => (
                            <div key={index} className="text-xs bg-orange-100 px-2 py-1 rounded text-orange-800">
                              {factor}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {score.rbi_violations.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-1">RBI Violations:</p>
                        <div className="space-y-1">
                          {score.rbi_violations.map((violation, index) => (
                            <div key={index} className="text-xs bg-red-100 px-2 py-1 rounded text-red-800">
                              {violation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th 
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('credit_score')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Credit Score</span>
                    <SortIcon field="credit_score" />
                  </div>
                </th>
                <th 
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                  onClick={() => handleSort('risk_band')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Risk Band</span>
                    <SortIcon field="risk_band" />
                  </div>
                </th>
                <th 
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('decision')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Decision</span>
                    <SortIcon field="decision" />
                  </div>
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  RBI Compliant
                </th>
                <th 
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                  onClick={() => handleSort('max_eligible_amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Max Loan</span>
                    <SortIcon field="max_eligible_amount" />
                  </div>
                </th>
                <th 
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden xl:table-cell"
                  onClick={() => handleSort('emi_to_income_ratio')}
                >
                  <div className="flex items-center space-x-1">
                    <span>EMI Ratio</span>
                    <SortIcon field="emi_to_income_ratio" />
                  </div>
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedData.map((score) => (
                <tr key={score.user_id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {score.user_id}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">
                        {score.credit_score}
                      </span>
                      <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            score.credit_score >= 750 ? 'bg-success-500' :
                            score.credit_score >= 650 ? 'bg-primary-500' :
                            score.credit_score >= 550 ? 'bg-warning-500' : 'bg-danger-500'
                          }`}
                          style={{ width: `${((score.credit_score - 300) / 600) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskBandColor(score.risk_band)}`}>
                      {score.risk_band}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDecisionColor(score.decision)}`}>
                      {score.decision}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center">
                      {score.rbi_compliant ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-500" />
                      ) : (
                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-danger-500" />
                      )}
                      <span className={`ml-1 sm:ml-2 text-xs sm:text-sm ${score.rbi_compliant ? 'text-success-700' : 'text-danger-700'}`}>
                        {score.rbi_compliant ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    ₹{((score.max_eligible_amount || 0)/1000).toFixed(0)}K
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{(score.emi_to_income_ratio || 0).toFixed(1)}%</span>
                      {(score.emi_to_income_ratio || 0) > 50 && (
                        <div className="relative group">
                          <AlertTriangle className="h-4 w-4 text-warning-500" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Exceeds RBI guideline of 50%
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <details className="group">
                      <summary className="cursor-pointer text-primary-600 hover:text-primary-800 text-xs sm:text-sm font-medium">
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs space-y-2 max-w-xs">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Improvement Suggestions:</p>
                          <div className="space-y-1">
                            {score.improvement_suggestions.slice(0, 3).map((suggestion, index) => (
                              <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        </div>
                        {score.rbi_violations.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-700 mb-1">RBI Violations:</p>
                            <div className="space-y-1">
                              {score.rbi_violations.map((violation, index) => (
                                <div key={index} className="text-xs bg-red-100 px-2 py-1 rounded text-red-800">
                                  {violation}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filter criteria.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
