'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Plus, 
  Trash2,
  CheckCircle,
  Clock,
  Utensils,
  Droplets,
  Moon,
  Activity,
  Heart,
  Brain,
  AlertCircle,
  TrendingUp,
  Save
} from 'lucide-react'

export default function DailyJournal({ date = new Date() }) {
  const [journalData, setJournalData] = useState({
    date: date.toISOString().split('T')[0],
    meals: [],
    waterIntake: 0,
    symptoms: [],
    mood: 5,
    energyLevel: 5,
    stressLevel: 5,
    sleepHours: 0,
    sleepQuality: 5,
    exerciseMinutes: 0,
    exerciseType: '',
    bowelMovements: 0,
    notes: ''
  })

  const [currentMeal, setCurrentMeal] = useState({
    time: '',
    foods: '',
    portion: '',
    location: 'home'
  })

  const [currentSymptom, setCurrentSymptom] = useState({
    symptom: '',
    severity: 5,
    time: ''
  })

  const commonSymptoms = [
    'Headache', 'Fatigue', 'Bloating', 'Gas', 'Constipation', 
    'Diarrhea', 'Joint Pain', 'Brain Fog', 'Anxiety', 'Insomnia'
  ]

  const addMeal = () => {
    if (currentMeal.foods) {
      setJournalData({
        ...journalData,
        meals: [...journalData.meals, { ...currentMeal, id: Date.now() }]
      })
      setCurrentMeal({ time: '', foods: '', portion: '', location: 'home' })
    }
  }

  const removeMeal = (id) => {
    setJournalData({
      ...journalData,
      meals: journalData.meals.filter(meal => meal.id !== id)
    })
  }

  const addSymptom = () => {
    if (currentSymptom.symptom) {
      setJournalData({
        ...journalData,
        symptoms: [...journalData.symptoms, { ...currentSymptom, id: Date.now() }]
      })
      setCurrentSymptom({ symptom: '', severity: 5, time: '' })
    }
  }

  const removeSymptom = (id) => {
    setJournalData({
      ...journalData,
      symptoms: journalData.symptoms.filter(symptom => symptom.id !== id)
    })
  }

  const saveJournal = async () => {
    // Here you would save to database
    console.log('Saving journal:', journalData)
    alert('Journal saved successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">Daily Health Journal</h2>
            </div>
            <input
              type="date"
              value={journalData.date}
              onChange={(e) => setJournalData({ ...journalData, date: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Meals Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-500" />
              Meals & Food
            </h3>
            
            <div className="space-y-3 mb-4">
              {journalData.meals.map(meal => (
                <div key={meal.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{meal.time}</span>
                      <span className="text-sm text-gray-500">• {meal.location}</span>
                    </div>
                    <p className="text-gray-700">{meal.foods}</p>
                    <p className="text-sm text-gray-500">Portion: {meal.portion}</p>
                  </div>
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="time"
                  value={currentMeal.time}
                  onChange={(e) => setCurrentMeal({ ...currentMeal, time: e.target.value })}
                  className="px-3 py-2 border rounded"
                  placeholder="Time"
                />
                <select
                  value={currentMeal.location}
                  onChange={(e) => setCurrentMeal({ ...currentMeal, location: e.target.value })}
                  className="px-3 py-2 border rounded"
                >
                  <option value="home">Home</option>
                  <option value="truck">In Truck</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="truck-stop">Truck Stop</option>
                </select>
              </div>
              <textarea
                value={currentMeal.foods}
                onChange={(e) => setCurrentMeal({ ...currentMeal, foods: e.target.value })}
                className="w-full px-3 py-2 border rounded mb-3"
                rows="2"
                placeholder="What did you eat? Be specific..."
              />
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={currentMeal.portion}
                  onChange={(e) => setCurrentMeal({ ...currentMeal, portion: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Portion size"
                />
                <button
                  onClick={addMeal}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Meal
                </button>
              </div>
            </div>
          </div>

          {/* Water Intake */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Water Intake
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="128"
                value={journalData.waterIntake}
                onChange={(e) => setJournalData({ ...journalData, waterIntake: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{journalData.waterIntake} oz</p>
                <p className="text-sm text-gray-500">{(journalData.waterIntake / 8).toFixed(1)} cups</p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Symptoms
            </h3>
            
            <div className="space-y-3 mb-4">
              {journalData.symptoms.map(symptom => (
                <div key={symptom.id} className="bg-red-50 p-4 rounded-lg flex justify-between items-start">
                  <div>
                    <p className="font-medium">{symptom.symptom}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">Severity: {symptom.severity}/10</span>
                      {symptom.time && <span className="text-sm text-gray-600">• {symptom.time}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeSymptom(symptom.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-3">
                {commonSymptoms.map(s => (
                  <button
                    key={s}
                    onClick={() => setCurrentSymptom({ ...currentSymptom, symptom: s })}
                    className="text-xs bg-white px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={currentSymptom.symptom}
                  onChange={(e) => setCurrentSymptom({ ...currentSymptom, symptom: e.target.value })}
                  className="px-3 py-2 border rounded"
                  placeholder="Symptom"
                />
                <div>
                  <label className="text-sm text-gray-600">Severity (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentSymptom.severity}
                    onChange={(e) => setCurrentSymptom({ ...currentSymptom, severity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <input
                  type="time"
                  value={currentSymptom.time}
                  onChange={(e) => setCurrentSymptom({ ...currentSymptom, time: e.target.value })}
                  className="px-3 py-2 border rounded"
                />
              </div>
              <button
                onClick={addSymptom}
                className="mt-3 btn-secondary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Symptom
              </button>
            </div>
          </div>

          {/* Mood & Energy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                Mood
              </h4>
              <input
                type="range"
                min="1"
                max="10"
                value={journalData.mood}
                onChange={(e) => setJournalData({ ...journalData, mood: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-lg font-medium">{journalData.mood}/10</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Energy Level
              </h4>
              <input
                type="range"
                min="1"
                max="10"
                value={journalData.energyLevel}
                onChange={(e) => setJournalData({ ...journalData, energyLevel: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-lg font-medium">{journalData.energyLevel}/10</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Stress Level
              </h4>
              <input
                type="range"
                min="1"
                max="10"
                value={journalData.stressLevel}
                onChange={(e) => setJournalData({ ...journalData, stressLevel: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-lg font-medium">{journalData.stressLevel}/10</p>
            </div>
          </div>

          {/* Sleep */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Moon className="h-5 w-5 text-indigo-500" />
              Sleep
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours of Sleep
                </label>
                <input
                  type="number"
                  value={journalData.sleepHours}
                  onChange={(e) => setJournalData({ ...journalData, sleepHours: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded"
                  step="0.5"
                  min="0"
                  max="24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sleep Quality (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={journalData.sleepQuality}
                  onChange={(e) => setJournalData({ ...journalData, sleepQuality: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-center">{journalData.sleepQuality}/10</p>
              </div>
            </div>
          </div>

          {/* Exercise */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Exercise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minutes of Exercise
                </label>
                <input
                  type="number"
                  value={journalData.exerciseMinutes}
                  onChange={(e) => setJournalData({ ...journalData, exerciseMinutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Exercise
                </label>
                <input
                  type="text"
                  value={journalData.exerciseType}
                  onChange={(e) => setJournalData({ ...journalData, exerciseType: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., Walking, stretching, weights"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-medium mb-4">Additional Notes</h3>
            <textarea
              value={journalData.notes}
              onChange={(e) => setJournalData({ ...journalData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows="4"
              placeholder="Any other observations about your day, how you felt, triggers noticed, etc."
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveJournal}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              Save Journal Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 