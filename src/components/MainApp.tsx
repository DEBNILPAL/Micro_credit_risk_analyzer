import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Upload, BarChart3, RefreshCw } from 'lucide-react';
import Header from './Header';
import FileUpload from './FileUpload';
import Dashboard from './Dashboard';
import UserTable from './UserTable';
import RBIComplianceDashboard from './RBIComplianceDashboard';
import MLInsightsDashboard from './MLInsightsDashboard';
import AIAssistant from './AIAssistant';
import PageTransition from './PageTransition';
import SkeletonLoader from './SkeletonLoader';
import { RiskScore, DashboardStats } from '../types';

const MainApp: React.FC = () => {
  const navigate = useNavigate();
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rbi-compliance' | 'ml-insights'>('overview');
  const [lastAnalysisDate, setLastAnalysisDate] = useState<string | null>(null);

  // Load persisted data on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('creditAnalysis_riskScores');
    const savedStats = localStorage.getItem('creditAnalysis_dashboardStats');
    const savedDate = localStorage.getItem('creditAnalysis_date');
    
    if (savedScores && savedStats) {
      try {
        setRiskScores(JSON.parse(savedScores));
        setDashboardStats(JSON.parse(savedStats));
        setLastAnalysisDate(savedDate);
      } catch (error) {
        console.error('Error loading saved analysis data:', error);
        // Clear corrupted data
        localStorage.removeItem('creditAnalysis_riskScores');
        localStorage.removeItem('creditAnalysis_dashboardStats');
        localStorage.removeItem('creditAnalysis_date');
      }
    }
  }, []);

  const handleFileProcessed = (scores: RiskScore[], stats: DashboardStats) => {
    setRiskScores(scores);
    setDashboardStats(stats);
    const currentDate = new Date().toLocaleString();
    setLastAnalysisDate(currentDate);
    
    // Persist data to localStorage
    localStorage.setItem('creditAnalysis_riskScores', JSON.stringify(scores));
    localStorage.setItem('creditAnalysis_dashboardStats', JSON.stringify(stats));
    localStorage.setItem('creditAnalysis_date', currentDate);
  };

  const handleRefreshData = () => {
    // Clear all stored data
    localStorage.removeItem('creditAnalysis_riskScores');
    localStorage.removeItem('creditAnalysis_dashboardStats');
    localStorage.removeItem('creditAnalysis_date');
    
    // Reset state
    setRiskScores([]);
    setDashboardStats(null);
    setLastAnalysisDate(null);
    setActiveTab('overview');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Back to Landing Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={handleBackToLanding}
            className="group flex items-center text-slate-600 hover:text-brand-600 transition-all duration-200 hover:bg-brand-50 px-3 py-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium text-sm sm:text-base">Back to Home</span>
          </button>
        </div>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="space-y-8 sm:space-y-12">
          {/* File Upload Section */}
          <div className={`transition-all duration-500 delay-200 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                      Upload Transaction Data
                    </h2>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">
                      Upload your CSV or JSON file to begin risk analysis
                      {lastAnalysisDate && (
                        <span className="block text-xs text-green-600 font-medium mt-1">
                          📊 Last analysis: {lastAnalysisDate}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Refresh Button */}
                {(riskScores.length > 0 || dashboardStats) && (
                  <button
                    onClick={handleRefreshData}
                    className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                    <span className="hidden sm:inline">Clear Analysis</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-large border border-slate-200 p-4 sm:p-8">
              <FileUpload 
                onFileProcessed={handleFileProcessed}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>

          {/* Dashboard Section */}
          {isLoading && (
            <div className={`transition-all duration-500 delay-300 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                      Processing Analytics
                    </h2>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">Calculating risk scores and generating insights...</p>
                  </div>
                </div>
              </div>
              <SkeletonLoader variant="dashboard" />
            </div>
          )}
          
          {dashboardStats && !isLoading && (
            <div className={`transition-all duration-500 delay-300 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        Risk Analysis Dashboard
                      </h2>
                      <p className="text-slate-600 mt-1 text-sm sm:text-base">
                        Comprehensive insights and compliance overview
                        {lastAnalysisDate && (
                          <span className="block text-xs text-blue-600 font-medium mt-1">
                            💾 Data persisted • Analysis from: {lastAnalysisDate}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Additional Refresh Button in Dashboard */}
                  <button
                    onClick={handleRefreshData}
                    className="group flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                  >
                    <RefreshCw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-medium border border-slate-200 mb-6 sm:mb-8">
                <div className="border-b border-slate-200">
                  <nav className="flex space-x-1 p-2">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                        activeTab === 'overview'
                          ? 'bg-brand-500 text-white shadow-soft'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="hidden sm:inline">Risk Overview</span>
                      <span className="sm:hidden">Overview</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('rbi-compliance')}
                      className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 ${
                        activeTab === 'rbi-compliance'
                          ? 'bg-brand-500 text-white shadow-soft'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">RBI Compliance</span>
                      <span className="sm:hidden">RBI</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('ml-insights')}
                      className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 ${
                        activeTab === 'ml-insights'
                          ? 'bg-brand-500 text-white shadow-soft'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">ML Insights</span>
                      <span className="sm:hidden">ML</span>
                    </button>
                  </nav>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="animate-fadeIn">
                {activeTab === 'overview' ? (
                  <Dashboard stats={dashboardStats} riskScores={riskScores} />
                ) : activeTab === 'rbi-compliance' ? (
                  <RBIComplianceDashboard stats={dashboardStats} scores={riskScores} />
                ) : (
                  <MLInsightsDashboard riskScores={riskScores} stats={dashboardStats} />
                )}
              </div>
            </div>
          )}

          {/* Results Table */}
          {isLoading && (
            <div className={`transition-all duration-500 delay-400 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
              <SkeletonLoader variant="table" />
            </div>
          )}
          
          {riskScores.length > 0 && !isLoading && (
            <div className={`transition-all duration-500 delay-400 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                      Risk Assessment Results
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                      Detailed analysis of {riskScores.length} applicants with risk scores and recommendations
                      {lastAnalysisDate && (
                        <span className="block text-xs text-purple-600 font-medium mt-1">
                          🔄 Auto-saved • Last updated: {lastAnalysisDate}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Export/Refresh Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRefreshData}
                      className="group flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                      <RefreshCw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-large border border-slate-200 overflow-hidden">
                <UserTable riskScores={riskScores} />
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* AI Assistant */}
      <AIAssistant riskScores={riskScores} stats={dashboardStats ?? undefined} />
      </div>
    </PageTransition>
  );
};

export default MainApp;
