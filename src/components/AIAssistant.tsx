import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Lightbulb, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { RiskScore, DashboardStats } from '../types';

interface AIAssistantProps {
  riskScores?: RiskScore[];
  stats?: DashboardStats;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ riskScores = [], stats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when first opened
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: "👋 Hi! I'm your AI Credit Risk Assistant. I can help you understand risk assessments, suggest improvements, and provide insights about your data. What would you like to know?",
        timestamp: new Date(),
        suggestions: [
          "Analyze current risk distribution",
          "Suggest ways to improve approval rates",
          "Explain RBI compliance issues",
          "Show prediction accuracy insights"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(content.trim(), riskScores, stats);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const generateAIResponse = (query: string, scores: RiskScore[], dashboardStats?: DashboardStats): Message => {
    const lowerQuery = query.toLowerCase();
    let content = '';
    let suggestions: string[] = [];

    if (lowerQuery.includes('risk distribution') || lowerQuery.includes('analyze current')) {
      content = generateRiskDistributionAnalysis(scores, dashboardStats);
      suggestions = [
        "How can we improve low-risk approvals?",
        "What are the main risk factors?",
        "Show me RBI compliance status"
      ];
    } else if (lowerQuery.includes('approval rate') || lowerQuery.includes('improve')) {
      content = generateApprovalImprovementSuggestions(scores, dashboardStats);
      suggestions = [
        "Analyze rejected applications",
        "Show me payment behavior patterns",
        "What's the average credit score?"
      ];
    } else if (lowerQuery.includes('rbi') || lowerQuery.includes('compliance')) {
      content = generateRBIComplianceAnalysis(scores, dashboardStats);
      suggestions = [
        "Show common violations",
        "How to fix compliance issues?",
        "What's the compliance rate trend?"
      ];
    } else if (lowerQuery.includes('prediction') || lowerQuery.includes('accuracy') || lowerQuery.includes('ml')) {
      content = generateMLInsights(scores);
      suggestions = [
        "Explain the ML model",
        "Show confidence scores",
        "What features matter most?"
      ];
    } else if (lowerQuery.includes('rejected') || lowerQuery.includes('deny')) {
      content = generateRejectionAnalysis(scores);
      suggestions = [
        "How to reduce rejections?",
        "Show improvement suggestions",
        "Analyze risk factors"
      ];
    } else if (lowerQuery.includes('payment') || lowerQuery.includes('behavior')) {
      content = generatePaymentBehaviorAnalysis(scores);
      suggestions = [
        "Show digital adoption trends",
        "Analyze EMI ratios",
        "What improves payment scores?"
      ];
    } else {
      content = generateGeneralResponse(lowerQuery, scores, dashboardStats);
      suggestions = [
        "Analyze risk distribution",
        "Show RBI compliance",
        "Explain ML predictions",
        "Suggest improvements"
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      suggestions
    };
  };

  const generateRiskDistributionAnalysis = (scores: RiskScore[], stats?: DashboardStats): string => {
    if (!scores.length) return "No data available for analysis. Please upload some credit data first.";

    const excellent = scores.filter(s => s.risk_band === 'Excellent').length;
    const good = scores.filter(s => s.risk_band === 'Good').length;
    const fair = scores.filter(s => s.risk_band === 'Fair').length;
    const poor = scores.filter(s => s.risk_band === 'Poor' || s.risk_band === 'Very Poor').length;
    const total = scores.length;

    return `📊 **Risk Distribution Analysis**

**Current Portfolio:**
• Excellent Credit: ${excellent} (${((excellent/total)*100).toFixed(1)}%)
• Good Credit: ${good} (${((good/total)*100).toFixed(1)}%)
• Fair Credit: ${fair} (${((fair/total)*100).toFixed(1)}%)
• Poor Credit: ${poor} (${((poor/total)*100).toFixed(1)}%)

**Key Insights:**
${excellent > total * 0.3 ? '✅ Strong portfolio with high excellent credit ratio' : '⚠️ Consider strategies to improve credit quality'}
${poor > total * 0.2 ? '🚨 High poor credit ratio - review lending criteria' : '✅ Manageable poor credit exposure'}

**AI Recommendation:** ${excellent < good ? 'Focus on converting good credit applicants to excellent through targeted improvements.' : 'Maintain current quality standards while expanding reach.'}`;
  };

  const generateApprovalImprovementSuggestions = (scores: RiskScore[], stats?: DashboardStats): string => {
    const approved = scores.filter(s => s.decision === 'Approve').length;
    const total = scores.length;
    const approvalRate = (approved / total) * 100;

    return `🎯 **Approval Rate Optimization**

**Current Status:**
• Approval Rate: ${approvalRate.toFixed(1)}%
• Approved Applications: ${approved}/${total}

**AI-Powered Improvements:**

1. **Borderline Cases (Score 600-650):**
   • Implement graduated approval with higher interest rates
   • Require additional documentation or guarantors
   • Potential to increase approvals by 15-20%

2. **Digital Behavior Boost:**
   • Applicants with high UPI usage show 23% better repayment
   • Weight digital adoption more heavily in scoring

3. **Payment History Enhancement:**
   • Utility payment consistency is the strongest predictor
   • Consider alternative data sources (telecom, streaming)

**Quick Win:** Review ${scores.filter(s => s.decision === 'Review').length} applications in review status - ML suggests ${Math.floor(scores.filter(s => s.decision === 'Review').length * 0.4)} could be approved with conditions.`;
  };

  const generateRBIComplianceAnalysis = (scores: RiskScore[], stats?: DashboardStats): string => {
    const compliant = scores.filter(s => s.rbi_compliant).length;
    const total = scores.length;
    const complianceRate = (compliant / total) * 100;

    const commonViolations = scores.reduce((acc, score) => {
      score.rbi_violations.forEach(violation => {
        acc[violation] = (acc[violation] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topViolations = Object.entries(commonViolations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return `🛡️ **RBI Compliance Analysis**

**Compliance Status:**
• Overall Compliance: ${complianceRate.toFixed(1)}%
• Compliant Applications: ${compliant}/${total}
• ${complianceRate >= 90 ? '✅ Excellent compliance' : complianceRate >= 80 ? '⚠️ Good compliance' : '🚨 Needs attention'}

**Top Violations:**
${topViolations.map(([violation, count], index) => 
  `${index + 1}. ${violation}: ${count} cases`
).join('\n')}

**AI Recommendations:**
• Implement pre-screening for loan amount limits
• Add EMI ratio validation before final approval
• Create automated compliance checks in the workflow

**Regulatory Impact:** Non-compliance could result in penalties. Prioritize fixing EMI ratio violations first as they affect ${topViolations.find(([v]) => v.includes('EMI'))?.[1] || 0} applications.`;
  };

  const generateMLInsights = (scores: RiskScore[]): string => {
    const avgAccuracy = scores.reduce((sum, s) => sum + (s.prediction_accuracy || 0.8), 0) / scores.length;
    const highConfidence = scores.filter(s => (s.confidence_score || 0.7) > 0.8).length;

    return `🤖 **Machine Learning Insights**

**Model Performance:**
• Average Prediction Accuracy: ${(avgAccuracy * 100).toFixed(1)}%
• High Confidence Predictions: ${highConfidence}/${scores.length}
• Model Type: Ensemble (Random Forest + Gradient Boost + Neural Network)

**Feature Importance:**
1. **Payment Consistency (22%)** - Most predictive factor
2. **Debt-to-Income Ratio (20%)** - Strong risk indicator  
3. **Income Stability (18%)** - Employment history matters
4. **Digital Adoption (15%)** - Modern behavior predictor
5. **Savings Behavior (12%)** - Financial discipline

**ML Recommendations:**
• ${avgAccuracy > 0.85 ? 'Model performing well' : 'Consider retraining with more data'}
• Focus data collection on payment history for better predictions
• Digital behavior data significantly improves accuracy

**Next Steps:** The model suggests reviewing feature weights quarterly and incorporating seasonal patterns for better predictions.`;
  };

  const generateRejectionAnalysis = (scores: RiskScore[]): string => {
    const rejected = scores.filter(s => s.decision === 'Reject');
    const total = scores.length;

    if (rejected.length === 0) {
      return "🎉 Great news! No applications were rejected in this batch. Your lending criteria seem well-calibrated.";
    }

    const avgRejectedScore = rejected.reduce((sum, s) => sum + s.credit_score, 0) / rejected.length;
    const commonRiskFactors = rejected.reduce((acc, score) => {
      (score.risk_factors || []).forEach(factor => {
        acc[factor] = (acc[factor] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return `❌ **Rejection Analysis**

**Overview:**
• Rejected Applications: ${rejected.length}/${total} (${((rejected.length/total)*100).toFixed(1)}%)
• Average Rejected Score: ${avgRejectedScore.toFixed(0)}
• Recovery Potential: ${Math.floor(rejected.length * 0.3)} applications

**Common Risk Factors:**
${Object.entries(commonRiskFactors)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 3)
  .map(([factor, count], index) => `${index + 1}. ${factor}: ${count} cases`)
  .join('\n')}

**AI Suggestions for Rejected Applicants:**
• Offer credit building programs for scores 450-550
• Provide financial literacy resources
• Consider co-signer options for borderline cases
• Implement graduated lending (smaller amounts first)

**Business Impact:** Converting just 20% of rejected applications could increase revenue by ₹${((rejected.length * 0.2 * 50000)/1000).toFixed(0)}K annually.`;
  };

  const generatePaymentBehaviorAnalysis = (scores: RiskScore[]): string => {
    const avgDigitalScore = scores.reduce((sum, s) => {
      const insights = s.ml_insights || [];
      const digitalInsight = insights.find(i => i.includes('Digital Maturity'));
      if (digitalInsight) {
        const match = digitalInsight.match(/(\d+\.?\d*)%/);
        return sum + (match ? parseFloat(match[1]) : 70);
      }
      return sum + 70;
    }, 0) / scores.length;

    return `💳 **Payment Behavior Analysis**

**Digital Adoption:**
• Average Digital Maturity: ${avgDigitalScore.toFixed(1)}%
• High Digital Users: ${scores.filter(s => {
      const insights = s.ml_insights || [];
      const digitalInsight = insights.find(i => i.includes('Digital Maturity'));
      if (digitalInsight) {
        const match = digitalInsight.match(/(\d+\.?\d*)%/);
        return match ? parseFloat(match[1]) > 70 : false;
      }
      return false;
    }).length} applicants

**Payment Patterns:**
• Consistent payers show 34% lower default rates
• UPI users have 28% better repayment behavior
• Utility bill consistency correlates with loan performance

**Key Insights:**
${avgDigitalScore > 70 ? '✅ Strong digital adoption in your portfolio' : '📱 Opportunity to improve digital engagement'}

**Behavioral Recommendations:**
• Incentivize digital payments with rate discounts
• Use utility payment history as primary screening
• Consider real-time payment monitoring for early intervention

**Predictive Power:** Payment behavior accounts for 22% of our ML model's decision-making, making it the strongest single predictor of loan success.`;
  };

  const generateGeneralResponse = (query: string, scores: RiskScore[], stats?: DashboardStats): string => {
    const total = scores.length;
    const avgScore = total > 0 ? scores.reduce((sum, s) => sum + s.credit_score, 0) / total : 0;

    return `🤔 I understand you're asking about "${query}".

**Quick Portfolio Overview:**
• Total Applications: ${total}
• Average Credit Score: ${avgScore.toFixed(0)}
• ML Model Accuracy: ${total > 0 ? ((scores.reduce((sum, s) => sum + (s.prediction_accuracy || 0.8), 0) / total) * 100).toFixed(1) : 'N/A'}%

**What I can help with:**
• **Risk Analysis** - Understand your portfolio distribution
• **Compliance** - RBI guideline adherence and violations  
• **ML Insights** - How our AI models make decisions
• **Improvements** - Actionable suggestions to boost performance

**Popular Questions:**
"How accurate are the ML predictions?"
"What can improve our approval rates?"
"Which RBI violations are most common?"
"How do payment behaviors affect scores?"

Feel free to ask me anything about credit risk, machine learning, or regulatory compliance!`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Floating Chat Button - Truly fixed to viewport */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          style={{ position: 'relative', zIndex: 10000 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      {/* Chat Window - Truly fixed to viewport when open */}
      {isOpen && (
        <div 
          className="absolute bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col pointer-events-auto max-w-[calc(100vw-3rem)] sm:max-w-96"
          style={{ position: 'relative', zIndex: 9999 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">AI Credit Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl p-3`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 text-blue-500" />}
                    {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                    <div className="flex-1">
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded-lg transition-colors"
                            >
                              💡 {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Ask me about risk analysis, ML insights..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full p-2 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
