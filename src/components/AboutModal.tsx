import React from 'react';
import { X, Shield, BookOpen, FileText, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-6xl p-4 sm:p-6 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl sm:rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-2 rounded-xl">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">About Micro Credit & Financial Inclusion</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto space-y-6 sm:space-y-8">
            
            {/* Micro Credit Overview */}
            <section>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">What is Micro Credit?</h3>
              </div>
              <div className="bg-brand-50 p-4 sm:p-6 rounded-xl">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                  Micro credit refers to small loans provided to individuals or small businesses who lack access to traditional banking services. 
                  These loans are typically unsecured and designed to help borrowers start or expand small businesses, improve their living conditions, 
                  or meet emergency financial needs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-brand-700 mb-2 text-sm sm:text-base">Key Features</h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <li>• Small loan amounts (₹5,000 - ₹2,00,000)</li>
                      <li>• No collateral required</li>
                      <li>• Flexible repayment terms</li>
                      <li>• Focus on financial inclusion</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-brand-700 mb-2 text-sm sm:text-base">Target Beneficiaries</h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <li>• Women entrepreneurs</li>
                      <li>• Rural farmers</li>
                      <li>• Small business owners</li>
                      <li>• Unbanked population</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Government Schemes */}
            <section>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Government Micro Credit Schemes</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-primary-50 p-4 sm:p-6 rounded-xl">
                  <h4 className="font-semibold text-primary-700 mb-2 sm:mb-3 text-sm sm:text-base">Pradhan Mantri Mudra Yojana (PMMY)</h4>
                  <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3">
                    Provides loans up to ₹10 lakhs to non-corporate, non-farm small/micro enterprises.
                  </p>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center text-xs sm:text-sm">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2" />
                      <span>Shishu: Up to ₹50,000</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2" />
                      <span>Kishore: ₹50,000 - ₹5 lakhs</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2" />
                      <span>Tarun: ₹5 - ₹10 lakhs</span>
                    </div>
                  </div>
                </div>

                <div className="bg-success-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-success-700 mb-3">Stand Up India Scheme</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Facilitates bank loans between ₹10 lakhs to ₹1 crore for SC/ST and women entrepreneurs.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Manufacturing: ₹10L - ₹1Cr</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Services: ₹10L - ₹1Cr</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Trading: ₹10L - ₹1Cr</span>
                    </div>
                  </div>
                </div>

                <div className="bg-warning-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-warning-700 mb-3">National Rural Livelihood Mission</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Promotes self-employment and organization of rural poor through Self Help Groups (SHGs).
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Community Investment Fund</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Revolving Fund Support</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-purple-700 mb-3">Deendayal Antyodaya Yojana</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Skill development and placement assistance for urban and rural poor.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Urban Component (DAY-NULM)</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Rural Component (DAY-NRLM)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* RBI Guidelines */}
            <section>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-danger-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">RBI Guidelines for Micro Credit</h3>
              </div>
              <div className="bg-danger-50 p-4 sm:p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold text-danger-700 mb-2 sm:mb-3 text-sm sm:text-base">Lending Guidelines</h4>
                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                      <li className="flex items-start">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Interest Rate Cap:</strong> Maximum 26% per annum for MFIs</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Loan Amount:</strong> Maximum ₹1.25 lakhs per borrower</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Multiple Lending:</strong> Maximum 2 MFIs per borrower</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Repayment Frequency:</strong> Monthly or fortnightly installments</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-danger-700 mb-3">Borrower Protection</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Fair Practices:</strong> Transparent pricing and terms</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Grievance Redressal:</strong> Proper complaint mechanism</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Recovery Practices:</strong> No coercive methods allowed</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Data Privacy:</strong> Protection of borrower information</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg border border-danger-200">
                  <h5 className="font-semibold text-danger-700 mb-2 text-sm sm:text-base">Key RBI Compliance Requirements</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="font-medium">EMI to Income Ratio:</span>
                      <p className="text-danger-600">Maximum 50% of household income</p>
                    </div>
                    <div>
                      <span className="font-medium">Credit Bureau Reporting:</span>
                      <p className="text-danger-600">Mandatory for loans above ₹50,000</p>
                    </div>
                    <div>
                      <span className="font-medium">Cooling Period:</span>
                      <p className="text-danger-600">7 days after loan sanction</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Alternative Credit Scoring */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-success-600" />
                <h3 className="text-xl font-semibold text-gray-900">Alternative Credit Scoring</h3>
              </div>
              <div className="bg-success-50 p-6 rounded-xl">
                <p className="text-gray-700 mb-4">
                  Our platform uses alternative data sources to assess creditworthiness for individuals without traditional credit history.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-success-700 mb-3">Data Sources</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• UPI transaction patterns</li>
                      <li>• Mobile recharge history</li>
                      <li>• Utility bill payments</li>
                      <li>• Digital wallet usage</li>
                      <li>• E-commerce transactions</li>
                      <li>• Social media activity (optional)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-success-700 mb-3">Scoring Factors</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Payment consistency</li>
                      <li>• Transaction velocity</li>
                      <li>• Account stability</li>
                      <li>• Digital footprint depth</li>
                      <li>• Behavioral patterns</li>
                      <li>• Risk indicators</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">Benefits of Our Platform</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-primary-700 mb-2">For Lenders</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Reduced default risk</li>
                    <li>• Faster loan processing</li>
                    <li>• RBI compliance assurance</li>
                    <li>• Automated decision making</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-primary-700 mb-2">For Borrowers</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Access to credit without collateral</li>
                    <li>• Fair interest rates</li>
                    <li>• Quick approval process</li>
                    <li>• Credit score improvement</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-primary-700 mb-2">For Society</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Financial inclusion</li>
                    <li>• Economic empowerment</li>
                    <li>• Reduced poverty</li>
                    <li>• Digital economy growth</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
