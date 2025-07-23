'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Upload, 
  Calendar, 
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Brain,
  Download,
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import LabUpload from '@/app/components/LabUpload'

export default function LabResultsPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [labResults, setLabResults] = useState([])
  const [selectedResult, setSelectedResult] = useState(null)

  // Mock data - replace with actual API calls
  const clients = [
    { id: 1, name: 'John Driver', email: 'john@example.com' },
    { id: 2, name: 'Mary Smith', email: 'mary@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ]

  const mockLabResults = [
    {
      id: 1,
      clientName: 'John Driver',
      testDate: '2024-03-15',
      testType: 'Comprehensive Metabolic Panel',
      status: 'ai_analyzed',
      flaggedCount: 3,
      analysis: {
        summary: 'Overall metabolic health shows signs of insulin resistance with elevated inflammatory markers.',
        flaggedValues: [
          {
            marker: 'HbA1c',
            value: '6.2%',
            status: 'high',
            concern: 'Indicates prediabetes',
            optimalRange: '< 5.5%'
          },
          {
            marker: 'CRP',
            value: '4.8 mg/L',
            status: 'high',
            concern: 'Elevated inflammation',
            optimalRange: '< 1.0 mg/L'
          },
          {
            marker: 'Vitamin D',
            value: '18 ng/mL',
            status: 'low',
            concern: 'Deficiency affecting immune function',
            optimalRange: '40-60 ng/mL'
          }
        ],
        recommendations: {
          immediate: [
            'Start vitamin D3 5000 IU daily',
            'Implement anti-inflammatory diet',
            'Increase physical activity to 30 min/day'
          ],
          shortTerm: [
            'Begin berberine 500mg twice daily with meals',
            'Add omega-3 fatty acids 2g daily',
            'Schedule follow-up glucose tolerance test'
          ],
          longTerm: [
            'Weight loss goal: 15-20 pounds over 3 months',
            'Establish consistent sleep schedule',
            'Consider continuous glucose monitoring'
          ]
        }
      }
    }
  ]

  const handleUploadComplete = (result) => {
    console.log('Lab upload complete:', result)
    setShowUpload(false)
    // Refresh lab results list
  }

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending_review: { color: 'yellow', icon: Clock, text: 'Pending Review' },
      ai_analyzed: { color: 'blue', icon: Brain, text: 'AI Analyzed' },
      reviewed: { color: 'green', icon: CheckCircle, text: 'Reviewed' }
    }

    const config = statusConfig[status] || statusConfig.pending_review
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lab Results Management</h1>
            <p className="text-gray-600 mt-1">AI-powered analysis and tracking</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Upload className="h-5 w-5" />
            Upload New Results
          </button>
        </div>

        {showUpload && (
          <div className="mb-8">
            <LabUpload 
              clientId={selectedClient?.id}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        )}

        {/* Results List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Recent Lab Results</h2>
          </div>
          
          <div className="divide-y">
            {mockLabResults.map(result => (
              <div key={result.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedResult(result)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium">{result.testType}</h3>
                      <StatusBadge status={result.status} />
                      {result.flaggedCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3" />
                          {result.flaggedCount} Flagged
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {result.clientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(result.testDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {result.analysis && (
                      <p className="mt-2 text-sm text-gray-700">{result.analysis.summary}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Analysis View */}
        {selectedResult && selectedResult.analysis && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">AI Analysis Results</h2>
            
            {/* Flagged Values */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Flagged Values</h3>
              <div className="space-y-3">
                {selectedResult.analysis.flaggedValues.map((item, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium">{item.marker}</h4>
                          <span className={`text-sm font-semibold ${
                            item.status === 'high' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {item.value}
                          </span>
                          {item.status === 'high' ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.concern}</p>
                        <p className="text-xs text-gray-500 mt-1">Optimal range: {item.optimalRange}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-red-600">Immediate Actions</h3>
                <ul className="space-y-2">
                  {selectedResult.analysis.recommendations.immediate.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 text-orange-600">Short Term (1-4 weeks)</h3>
                <ul className="space-y-2">
                  {selectedResult.analysis.recommendations.shortTerm.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 text-blue-600">Long Term (1-3 months)</h3>
                <ul className="space-y-2">
                  {selectedResult.analysis.recommendations.longTerm.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 