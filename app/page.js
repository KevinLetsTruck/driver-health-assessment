'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  CheckCircle, 
  User, 
  Truck, 
  Activity, 
  Target, 
  Brain, 
  FileText,
  AlertTriangle,
  Clock,
  Zap,
  Mail,
  Phone
} from 'lucide-react'

export default function DriverHealthAssessment() {
  // State management
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [completedSections, setCompletedSections] = useState(new Set())
  const [validationErrors, setValidationErrors] = useState({})
  const [autoSaveStatus, setAutoSaveStatus] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Assessment sections with complete structure
  const sections = [
    {
      id: 'profile',
      title: 'Driver Profile',
      icon: User,
      required: true,
      description: 'Basic information and driving background'
    },
    {
      id: 'equipment',
      title: 'Equipment & Setup',
      icon: Truck,
      required: true,
      description: 'Your truck and living conditions'
    },
    {
      id: 'health',
      title: 'Current Health',
      icon: Activity,
      required: true,
      description: 'Health status and concerns'
    },
    {
      id: 'symptoms',
      title: 'Symptom Review',
      icon: FileText,
      required: true,
      description: 'Comprehensive symptom checklist'
    },
    {
      id: 'family',
      title: 'Family History',
      icon: User,
      required: true,
      description: 'Family health patterns'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Factors',
      icon: Brain,
      required: true,
      description: 'Sleep, stress, and daily habits'
    },
    {
      id: 'diet',
      title: 'Diet & Nutrition',
      icon: Activity,
      required: true,
      description: 'Eating patterns and food sensitivities'
    },
    {
      id: 'environment',
      title: 'Environmental Factors',
      icon: AlertTriangle,
      required: true,
      description: 'Exposures and toxins'
    },
    {
      id: 'goals',
      title: 'Health Goals',
      icon: Target,
      required: true,
      description: 'What you want to achieve'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      icon: FileText,
      required: true,
      description: 'Final review and submission'
    }
  ]

  // Calculate progress
  const progress = (completedSections.size / (sections.length - 1)) * 100

  // Auto-save functionality
  useEffect(() => {
    const autoSave = async () => {
      try {
        setAutoSaveStatus('Saving...')
        
        // Save to localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('driverHealthAssessment', JSON.stringify({
            formData,
            currentStep,
            completedSections: Array.from(completedSections),
            timestamp: new Date().toISOString()
          }))
          setAutoSaveStatus('✓ Saved')
          setTimeout(() => setAutoSaveStatus(''), 2000)
        }
      } catch (error) {
        setAutoSaveStatus('⚠ Save failed')
        console.error('Auto-save error:', error)
      }
    }

    const timer = setTimeout(autoSave, 2000)
    return () => clearTimeout(timer)
  }, [formData, currentStep, completedSections])

  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('driverHealthAssessment')
        if (saved) {
          const { formData: savedData, currentStep: savedStep, completedSections: savedCompleted } = JSON.parse(saved)
          setFormData(savedData || {})
          setCurrentStep(savedStep || 0)
          setCompletedSections(new Set(savedCompleted || []))
        }
      } catch (error) {
        console.log('No saved data found')
      }
    }
  }, [])

  // Form data update
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation errors
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validation
  const validateSection = () => {
    const currentSection = sections[currentStep]
    const errors = {}
    
    switch (currentSection.id) {
      case 'profile':
        if (!formData.fullName?.trim()) errors.fullName = 'Name is required'
        if (!formData.age || formData.age < 18) errors.age = 'Age must be 18 or older'
        if (!formData.email?.includes('@')) errors.email = 'Valid email is required'
        if (!formData.yearsDriving) errors.yearsDriving = 'Experience is required'
        if (!formData.routeType) errors.routeType = 'Route type is required'
        break
      case 'equipment':
        if (!formData.truckType) errors.truckType = 'Truck type is required'
        break
      case 'health':
        if (!formData.overallHealth) errors.overallHealth = 'Health rating is required'
        if (!formData.energyLevel) errors.energyLevel = 'Energy level is required'
        break
      case 'symptoms':
        // Optional section - no required fields
        break
      case 'family':
        // Optional section - no required fields
        break
      case 'lifestyle':
        if (!formData.sleepQuality) errors.sleepQuality = 'Sleep quality is required'
        if (!formData.stressLevel) errors.stressLevel = 'Stress level is required'
        break
      case 'diet':
        if (!formData.primaryDiet) errors.primaryDiet = 'Primary diet is required'
        if (!formData.waterIntake) errors.waterIntake = 'Water intake is required'
        break
      case 'environment':
        // Optional section - no required fields
        break
      case 'goals':
        if (!formData.primaryGoal) errors.primaryGoal = 'Primary goal is required'
        if (!formData.commitmentLevel) errors.commitmentLevel = 'Commitment level is required'
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Navigation
  const nextStep = () => {
    if (validateSection()) {
      const currentSection = sections[currentStep]
      setCompletedSections(prev => new Set([...prev, currentSection.id]))
      
      if (currentStep < sections.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex)
  }

  // Submit assessment
  const submitAssessment = async () => {
    if (!validateSection()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          completedSections: Array.from(completedSections)
        })
      })
      
      if (response.ok) {
        setShowResults(true)
        // Clear saved data after successful submission
        localStorage.removeItem('driverHealthAssessment')
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your assessment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Results/Success screen
  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="card text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Assessment Submitted Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing your Driver Health Assessment. Kevin Rutherford, FNTP will review your responses and contact you within 24-48 hours.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <div className="text-left text-sm text-blue-700 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Your assessment has been securely saved</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Check your email for confirmation and next steps</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Expect a call to schedule your consultation</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              <strong>Kevin Rutherford, FNTP</strong><br />
              Functional Medicine for Truckers<br />
              support@letstruck.com | 855-800-3835
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentSection = sections[currentStep]

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Driver Health Assessment</h1>
            <p className="text-blue-100 mt-1">Comprehensive health evaluation for professional drivers</p>
            <p className="text-sm text-blue-200 mt-1">Kevin Rutherford, FNTP • Functional Medicine for Truckers</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">Auto-save: {autoSaveStatus}</div>
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
            <div className="text-blue-200 text-sm">Complete</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-blue-800 rounded-full h-2 mt-4">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isCompleted = completedSections.has(section.id)
            const isCurrent = index === currentStep
            
            return (
              <button
                key={section.id}
                onClick={() => goToStep(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isCurrent 
                    ? 'bg-blue-600 text-white' 
                    : isCompleted
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.title}
                {isCompleted && <CheckCircle className="w-4 h-4" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Current Section Content */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <currentSection.icon className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{currentSection.title}</h2>
            <p className="text-sm text-gray-600">{currentSection.description}</p>
          </div>
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {currentSection.id === 'profile' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName || ''}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                    className="input-field"
                    placeholder="Your age"
                    min="18"
                    max="99"
                  />
                  {validationErrors.age && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.age}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="input-field"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years Driving Professionally *</label>
                  <select
                    value={formData.yearsDriving || ''}
                    onChange={(e) => updateFormData('yearsDriving', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-5">1-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10-20">10-20 years</option>
                    <option value="20+">20+ years</option>
                  </select>
                  {validationErrors.yearsDriving && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.yearsDriving}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route Type *</label>
                  <select
                    value={formData.routeType || ''}
                    onChange={(e) => updateFormData('routeType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select route type</option>
                    <option value="otr">OTR (Over-the-Road)</option>
                    <option value="regional">Regional</option>
                    <option value="local">Local</option>
                    <option value="dedicated">Dedicated Route</option>
                  </select>
                  {validationErrors.routeType && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.routeType}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {currentSection.id === 'equipment' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Truck Type *</label>
                  <select
                    value={formData.truckType || ''}
                    onChange={(e) => updateFormData('truckType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select truck type</option>
                    <option value="company">Company Truck</option>
                    <option value="owner-operator">Owner Operator</option>
                    <option value="lease">Lease Purchase</option>
                  </select>
                  {validationErrors.truckType && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.truckType}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sleeper Size</label>
                  <select
                    value={formData.sleeperSize || ''}
                    onChange={(e) => updateFormData('sleeperSize', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select sleeper size</option>
                    <option value="day-cab">Day Cab (No Sleeper)</option>
                    <option value="36-inch">36 inch</option>
                    <option value="48-inch">48 inch</option>
                    <option value="60-inch">60 inch</option>
                    <option value="72-inch">72 inch+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Available Equipment (Check all that apply):</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Refrigerator/Cooler',
                    'Microwave',
                    'Inverter (1000W+)',
                    'APU/Generator',
                    'Hot Plate/Burner',
                    'Coffee Maker'
                  ].map((equipment) => (
                    <label key={equipment} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.equipment?.includes(equipment) || false}
                        onChange={(e) => {
                          const current = formData.equipment || []
                          if (e.target.checked) {
                            updateFormData('equipment', [...current, equipment])
                          } else {
                            updateFormData('equipment', current.filter(item => item !== equipment))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{equipment}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentSection.id === 'health' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overall Health Rating *</label>
                  <select
                    value={formData.overallHealth || ''}
                    onChange={(e) => updateFormData('overallHealth', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Rate your health</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  {validationErrors.overallHealth && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.overallHealth}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Energy Level *</label>
                  <select
                    value={formData.energyLevel || ''}
                    onChange={(e) => updateFormData('energyLevel', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Rate your energy</option>
                    <option value="very-high">Very High</option>
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                    <option value="very-low">Very Low</option>
                  </select>
                  {validationErrors.energyLevel && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.energyLevel}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Health Concerns</label>
                <textarea
                  value={formData.healthConcerns || ''}
                  onChange={(e) => updateFormData('healthConcerns', e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Describe any current health issues, symptoms, or concerns..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications/Supplements</label>
                <textarea
                  value={formData.medications || ''}
                  onChange={(e) => updateFormData('medications', e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="List any medications or supplements you're currently taking..."
                />
              </div>
            </>
          )}

          {currentSection.id === 'symptoms' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headaches</label>
                  <select
                    value={formData.headaches || ''}
                    onChange={(e) => updateFormData('headaches', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fatigue</label>
                  <select
                    value={formData.fatigue || ''}
                    onChange={(e) => updateFormData('fatigue', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joint Pain</label>
                  <select
                    value={formData.jointPain || ''}
                    onChange={(e) => updateFormData('jointPain', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nausea/Vomiting</label>
                  <select
                    value={formData.nauseaVomiting || ''}
                    onChange={(e) => updateFormData('nauseaVomiting', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diarrhea</label>
                  <select
                    value={formData.diarrhea || ''}
                    onChange={(e) => updateFormData('diarrhea', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Constipation</label>
                  <select
                    value={formData.constipation || ''}
                    onChange={(e) => updateFormData('constipation', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cough</label>
                  <select
                    value={formData.cough || ''}
                    onChange={(e) => updateFormData('cough', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sore Throat</label>
                  <select
                    value={formData.soreThroat || ''}
                    onChange={(e) => updateFormData('soreThroat', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Runny Nose</label>
                  <select
                    value={formData.runnyNose || ''}
                    onChange={(e) => updateFormData('runnyNose', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sinus Pressure</label>
                  <select
                    value={formData.sinusPressure || ''}
                    onChange={(e) => updateFormData('sinusPressure', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Itching/Rashes</label>
                  <select
                    value={formData.itchingRashes || ''}
                    onChange={(e) => updateFormData('itchingRashes', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Symptoms</label>
                  <textarea
                    value={formData.otherSymptoms || ''}
                    onChange={(e) => updateFormData('otherSymptoms', e.target.value)}
                    className="input-field"
                    rows="3"
                    placeholder="Describe any other symptoms you're experiencing..."
                  />
                </div>
              </div>
            </>
          )}

          {currentSection.id === 'family' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Health</label>
                  <select
                    value={formData.mothersHealth || ''}
                    onChange={(e) => updateFormData('mothersHealth', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select health status</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Health</label>
                  <select
                    value={formData.fathersHealth || ''}
                    onChange={(e) => updateFormData('fathersHealth', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select health status</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Siblings Health</label>
                  <select
                    value={formData.siblingsHealth || ''}
                    onChange={(e) => updateFormData('siblingsHealth', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select health status</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Children's Health</label>
                  <select
                    value={formData.childrensHealth || ''}
                    onChange={(e) => updateFormData('childrensHealth', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select health status</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grandparents Health</label>
                  <select
                    value={formData.grandparentsHealth || ''}
                    onChange={(e) => updateFormData('grandparentsHealth', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select health status</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aunts/Uncles Health</label>
                  <select
                    value={formData.auntsUnclesHealth || ''}
                    onChange={(e) => updateFormData('auntsUnclesHealth', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select health status</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {currentSection.id === 'lifestyle' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Quality (1-10) *</label>
                  <select
                    value={formData.sleepQuality || ''}
                    onChange={(e) => updateFormData('sleepQuality', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Rate sleep quality</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1} - {i < 3 ? 'Poor' : i < 6 ? 'Fair' : i < 8 ? 'Good' : 'Excellent'}</option>
                    ))}
                  </select>
                  {validationErrors.sleepQuality && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.sleepQuality}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level (1-10) *</label>
                  <select
                    value={formData.stressLevel || ''}
                    onChange={(e) => updateFormData('stressLevel', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Rate stress level</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1} - {i < 3 ? 'Low' : i < 6 ? 'Moderate' : i < 8 ? 'High' : 'Very High'}</option>
                    ))}
                  </select>
                  {validationErrors.stressLevel && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.stressLevel}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Frequency</label>
                  <select
                    value={formData.exerciseFreq || ''}
                    onChange={(e) => updateFormData('exerciseFreq', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="few-times-week">Few times per week</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Hours of Sleep</label>
                  <input
                    type="number"
                    value={formData.sleepHours || ''}
                    onChange={(e) => updateFormData('sleepHours', e.target.value)}
                    className="input-field"
                    placeholder="Hours per night"
                    min="1"
                    max="12"
                    step="0.5"
                  />
                </div>
              </div>
            </>
          )}

          {currentSection.id === 'diet' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diet</label>
                  <select
                    value={formData.primaryDiet || ''}
                    onChange={(e) => updateFormData('primaryDiet', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select primary diet</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Sensitivities</label>
                  <textarea
                    value={formData.foodSensitivities || ''}
                    onChange={(e) => updateFormData('foodSensitivities', e.target.value)}
                    className="input-field"
                    rows="3"
                    placeholder="List any food sensitivities or allergies..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Frequency</label>
                  <select
                    value={formData.mealFrequency || ''}
                    onChange={(e) => updateFormData('mealFrequency', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select meal frequency</option>
                    <option value="3-meals">3 meals per day</option>
                    <option value="4-meals">4 meals per day</option>
                    <option value="5-meals">5 meals per day</option>
                    <option value="6-meals">6 meals per day</option>
                    <option value="7-meals">7 meals per day</option>
                    <option value="8-meals">8 meals per day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Snack Frequency</label>
                  <select
                    value={formData.snackFrequency || ''}
                    onChange={(e) => updateFormData('snackFrequency', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select snack frequency</option>
                    <option value="3-snacks">3 snacks per day</option>
                    <option value="4-snacks">4 snacks per day</option>
                    <option value="5-snacks">5 snacks per day</option>
                    <option value="6-snacks">6 snacks per day</option>
                    <option value="7-snacks">7 snacks per day</option>
                    <option value="8-snacks">8 snacks per day</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water Intake (L/day)</label>
                  <input
                    type="number"
                    value={formData.waterIntake || ''}
                    onChange={(e) => updateFormData('waterIntake', e.target.value)}
                    className="input-field"
                    placeholder="e.g., 2.5"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caffeine Intake (cups/day)</label>
                  <input
                    type="number"
                    value={formData.caffeineIntake || ''}
                    onChange={(e) => updateFormData('caffeineIntake', e.target.value)}
                    className="input-field"
                    placeholder="e.g., 2"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
            </>
          )}

          {currentSection.id === 'environment' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exposure to Tobacco Smoke</label>
                  <select
                    value={formData.tobaccoSmoke || ''}
                    onChange={(e) => updateFormData('tobaccoSmoke', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select exposure</option>
                    <option value="never">Never</option>
                    <option value="occasional">Occasional (e.g., occasional social smoking)</option>
                    <option value="daily">Daily</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exposure to Air Pollution</label>
                  <select
                    value={formData.airPollution || ''}
                    onChange={(e) => updateFormData('airPollution', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select exposure</option>
                    <option value="never">Never</option>
                    <option value="occasional">Occasional (e.g., occasional exposure)</option>
                    <option value="daily">Daily</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exposure to Pesticides/Herbicides</label>
                  <select
                    value={formData.pesticidesHerbicides || ''}
                    onChange={(e) => updateFormData('pesticidesHerbicides', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select exposure</option>
                    <option value="never">Never</option>
                    <option value="occasional">Occasional (e.g., occasional exposure)</option>
                    <option value="daily">Daily</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exposure to Mold/Mildew</label>
                  <select
                    value={formData.moldMildew || ''}
                    onChange={(e) => updateFormData('moldMildew', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select exposure</option>
                    <option value="never">Never</option>
                    <option value="occasional">Occasional (e.g., occasional exposure)</option>
                    <option value="daily">Daily</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exposure to Chemicals/Toxins</label>
                  <select
                    value={formData.chemicalsToxins || ''}
                    onChange={(e) => updateFormData('chemicalsToxins', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select exposure</option>
                    <option value="never">Never</option>
                    <option value="occasional">Occasional (e.g., occasional exposure)</option>
                    <option value="daily">Daily</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exposure to Radiation</label>
                  <select
                    value={formData.radiation || ''}
                    onChange={(e) => updateFormData('radiation', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select exposure</option>
                    <option value="never">Never</option>
                    <option value="occasional">Occasional (e.g., occasional exposure)</option>
                    <option value="daily">Daily</option>
                    <option value="rarely">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {currentSection.id === 'goals' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Health Goal *</label>
                <select
                  value={formData.primaryGoal || ''}
                  onChange={(e) => updateFormData('primaryGoal', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select primary goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="energy-increase">Increase Energy</option>
                  <option value="better-sleep">Better Sleep</option>
                  <option value="stress-management">Stress Management</option>
                  <option value="overall-wellness">Overall Wellness</option>
                  <option value="chronic-condition">Manage Chronic Condition</option>
                </select>
                {validationErrors.primaryGoal && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.primaryGoal}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commitment Level *</label>
                <select
                  value={formData.commitmentLevel || ''}
                  onChange={(e) => updateFormData('commitmentLevel', e.target.value)}
                  className="input-field"
                >
                  <option value="">Rate your commitment</option>
                  <option value="very-high">Very High - I'll do whatever it takes</option>
                  <option value="high">High - I'm very motivated</option>
                  <option value="moderate">Moderate - I'll try my best</option>
                  <option value="low">Low - I have some interest</option>
                </select>
                {validationErrors.commitmentLevel && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.commitmentLevel}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Goals or Comments</label>
                <textarea
                  value={formData.additionalGoals || ''}
                  onChange={(e) => updateFormData('additionalGoals', e.target.value)}
                  className="input-field"
                  rows="4"
                  placeholder="Tell us more about what you hope to achieve or any specific concerns..."
                />
              </div>
            </>
          )}

          {currentSection.id === 'review' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800">Ready to Submit</h3>
                </div>
                <p className="text-sm text-yellow-700">
                  Please review your information below and click submit when ready. Kevin Rutherford, FNTP will contact you within 24-48 hours.
                </p>
              </div>

              {/* Review Summary */}
              <div className="grid gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Contact Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Driving Profile</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Experience:</strong> {formData.yearsDriving}</p>
                    <p><strong>Route Type:</strong> {formData.routeType}</p>
                    <p><strong>Truck Type:</strong> {formData.truckType}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Health Summary</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Overall Health:</strong> {formData.overallHealth}</p>
                    <p><strong>Energy Level:</strong> {formData.energyLevel}</p>
                    <p><strong>Sleep Quality:</strong> {formData.sleepQuality}/10</p>
                    <p><strong>Stress Level:</strong> {formData.stressLevel}/10</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Goals</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Primary Goal:</strong> {formData.primaryGoal}</p>
                    <p><strong>Commitment Level:</strong> {formData.commitmentLevel}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('driverHealthAssessment', JSON.stringify({
                  formData,
                  currentStep,
                  completedSections: Array.from(completedSections),
                  timestamp: new Date().toISOString()
                }))
                setAutoSaveStatus('✓ Manually saved')
                setTimeout(() => setAutoSaveStatus(''), 2000)
              }
            }}
            className="btn-secondary"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </button>

          {currentStep < sections.length - 1 ? (
            <button onClick={nextStep} className="btn-primary">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button 
              onClick={submitAssessment} 
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Assessment
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}