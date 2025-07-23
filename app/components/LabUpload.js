'use client'

import { useState } from 'react'
import { Upload, FileText, Check, AlertCircle, Brain, Loader2 } from 'lucide-react'

export default function LabUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setAnalysis(null)
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setUploading(false)
      setAnalyzing(true)
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock AI analysis results
      const mockAnalysis = {
        summary: "Overall health markers show improvement with some areas needing attention.",
        keyFindings: [
          {
            marker: "HbA1c",
            value: "5.7%",
            status: "borderline",
            insight: "Pre-diabetic range. Consider reducing carbohydrate intake and increasing physical activity."
          },
          {
            marker: "Vitamin D",
            value: "22 ng/mL",
            status: "low",
            insight: "Below optimal range. Recommend supplementation with 5000 IU daily and retest in 3 months."
          },
          {
            marker: "TSH",
            value: "2.8 mIU/L",
            status: "normal",
            insight: "Within normal range but trending higher. Monitor thyroid function."
          },
          {
            marker: "Homocysteine",
            value: "12 μmol/L",
            status: "elevated",
            insight: "Slightly elevated. Consider B-vitamin supplementation and MTHFR testing."
          }
        ],
        recommendations: [
          "Implement a low-glycemic diet focusing on whole foods",
          "Start Vitamin D3 supplementation: 5000 IU daily with K2",
          "Add methylated B-complex supplement",
          "Increase omega-3 fatty acids through diet or supplementation",
          "Schedule follow-up labs in 3 months"
        ],
        riskFactors: [
          "Metabolic syndrome risk due to elevated HbA1c",
          "Potential cardiovascular risk from elevated homocysteine",
          "Vitamin D deficiency impacting immune function"
        ]
      }
      
      setAnalysis(mockAnalysis)
      setAnalyzing(false)
      
      if (onUploadComplete) {
        onUploadComplete(file, mockAnalysis)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
      setAnalyzing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Lab Results</h2>
      
      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drop your lab results PDF here or click to browse
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Select PDF
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploading && !analyzing && !analysis && (
              <button
                onClick={() => setFile(null)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>

          {!analysis && (
            <button
              onClick={handleUpload}
              disabled={uploading || analyzing}
              className="w-full btn-primary flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Uploading...
                </>
              ) : analyzing ? (
                <>
                  <Brain className="animate-pulse h-5 w-5 mr-2" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload & Analyze
                </>
              )}
            </button>
          )}

          {analysis && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">AI Analysis Summary</h3>
                <p className="text-sm text-blue-700">{analysis.summary}</p>
              </div>

              <div>
                <h3 className="font-medium mb-3">Key Findings</h3>
                <div className="space-y-3">
                  {analysis.keyFindings.map((finding, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{finding.marker}</p>
                          <p className="text-2xl font-bold">{finding.value}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          finding.status === 'normal' ? 'bg-green-100 text-green-800' :
                          finding.status === 'borderline' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {finding.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{finding.insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-3">Risk Factors</h3>
                <div className="space-y-2">
                  {analysis.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-red-700">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn-primary">
                  Save to Client Record
                </button>
                <button className="flex-1 btn-secondary">
                  Create Protocol
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 