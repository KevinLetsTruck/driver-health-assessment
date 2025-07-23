'use client'

import { useState } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Clock,
  CheckSquare,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye
} from 'lucide-react'

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState([
    {
      id: 1,
      name: 'Gut Health Recovery Protocol',
      description: 'Comprehensive gut healing program for drivers',
      category: 'Digestive Health',
      duration: 12,
      phases: 3,
      activeClients: 23,
      successRate: 87
    },
    {
      id: 2,
      name: 'Energy Optimization Protocol',
      description: 'Restore energy and combat fatigue',
      category: 'Energy & Fatigue',
      duration: 8,
      phases: 2,
      activeClients: 15,
      successRate: 92
    }
  ])

  const [showBuilder, setShowBuilder] = useState(false)
  const [editingProtocol, setEditingProtocol] = useState(null)
  const [newProtocol, setNewProtocol] = useState({
    name: '',
    description: '',
    category: '',
    duration: 4,
    phases: []
  })

  const categories = [
    'Digestive Health',
    'Energy & Fatigue',
    'Sleep Optimization',
    'Metabolic Health',
    'Inflammation',
    'Hormone Balance',
    'Detoxification',
    'Immune Support'
  ]

  const addPhase = () => {
    setNewProtocol({
      ...newProtocol,
      phases: [...newProtocol.phases, {
        id: Date.now(),
        name: `Phase ${newProtocol.phases.length + 1}`,
        duration: 4,
        goals: [],
        supplements: [],
        lifestyle: [],
        diet: [],
        tracking: []
      }]
    })
  }

  const updatePhase = (phaseId, field, value) => {
    setNewProtocol({
      ...newProtocol,
      phases: newProtocol.phases.map(phase => 
        phase.id === phaseId ? { ...phase, [field]: value } : phase
      )
    })
  }

  const PhaseBuilder = ({ phase, index }) => {
    const [expanded, setExpanded] = useState(true)

    return (
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Phase {index + 1}
            </span>
            <input
              type="text"
              value={phase.name}
              onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
              className="font-medium text-lg border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Phase Name"
            />
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {expanded && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (weeks)
                </label>
                <input
                  type="number"
                  value={phase.duration}
                  onChange={(e) => updatePhase(phase.id, 'duration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Focus
                </label>
                <input
                  type="text"
                  value={phase.focus || ''}
                  onChange={(e) => updatePhase(phase.id, 'focus', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Eliminate triggers"
                />
              </div>
            </div>

            {/* Goals Section */}
            <div>
              <h4 className="font-medium mb-2">Goals</h4>
              <div className="space-y-2">
                {(phase.goals || []).map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => {
                        const newGoals = [...(phase.goals || [])]
                        newGoals[idx] = e.target.value
                        updatePhase(phase.id, 'goals', newGoals)
                      }}
                      className="flex-1 px-2 py-1 border rounded"
                    />
                  </div>
                ))}
                <button
                  onClick={() => updatePhase(phase.id, 'goals', [...(phase.goals || []), ''])}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Goal
                </button>
              </div>
            </div>

            {/* Supplements Section */}
            <div>
              <h4 className="font-medium mb-2">Supplements</h4>
              <div className="space-y-2">
                {(phase.supplements || []).map((supp, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={supp.name || ''}
                      onChange={(e) => {
                        const newSupps = [...(phase.supplements || [])]
                        newSupps[idx] = { ...supp, name: e.target.value }
                        updatePhase(phase.id, 'supplements', newSupps)
                      }}
                      className="px-2 py-1 border rounded"
                      placeholder="Supplement name"
                    />
                    <input
                      type="text"
                      value={supp.dosage || ''}
                      onChange={(e) => {
                        const newSupps = [...(phase.supplements || [])]
                        newSupps[idx] = { ...supp, dosage: e.target.value }
                        updatePhase(phase.id, 'supplements', newSupps)
                      }}
                      className="px-2 py-1 border rounded"
                      placeholder="Dosage"
                    />
                    <input
                      type="text"
                      value={supp.timing || ''}
                      onChange={(e) => {
                        const newSupps = [...(phase.supplements || [])]
                        newSupps[idx] = { ...supp, timing: e.target.value }
                        updatePhase(phase.id, 'supplements', newSupps)
                      }}
                      className="px-2 py-1 border rounded"
                      placeholder="Timing"
                    />
                  </div>
                ))}
                <button
                  onClick={() => updatePhase(phase.id, 'supplements', [...(phase.supplements || []), { name: '', dosage: '', timing: '' }])}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Supplement
                </button>
              </div>
            </div>

            {/* Lifestyle Recommendations */}
            <div>
              <h4 className="font-medium mb-2">Lifestyle Recommendations</h4>
              <textarea
                value={phase.lifestyle || ''}
                onChange={(e) => updatePhase(phase.id, 'lifestyle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                placeholder="Exercise, sleep, stress management recommendations..."
              />
            </div>

            {/* Diet Guidelines */}
            <div>
              <h4 className="font-medium mb-2">Diet Guidelines</h4>
              <textarea
                value={phase.diet || ''}
                onChange={(e) => updatePhase(phase.id, 'diet', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                placeholder="Foods to include, foods to avoid, meal timing..."
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Protocol Management</h1>
            <p className="text-gray-600 mt-1">Create and manage treatment protocols</p>
          </div>
          <button
            onClick={() => setShowBuilder(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Protocol
          </button>
        </div>

        {/* Protocol List */}
        {!showBuilder ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocols.map(protocol => (
              <div key={protocol.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{protocol.name}</h3>
                      <span className="text-sm text-gray-500">{protocol.category}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Copy className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{protocol.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">{protocol.duration} weeks</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phases</p>
                      <p className="font-medium">{protocol.phases} phases</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Active Clients</p>
                      <p className="font-medium">{protocol.activeClients}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Success Rate</p>
                      <p className="font-medium text-green-600">{protocol.successRate}%</p>
                    </div>
                  </div>
                  
                  <button className="w-full btn-secondary text-sm">
                    Assign to Client
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Protocol Builder */
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Create New Protocol</h2>
              <button
                onClick={() => setShowBuilder(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protocol Name
                  </label>
                  <input
                    type="text"
                    value={newProtocol.name}
                    onChange={(e) => setNewProtocol({ ...newProtocol, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Metabolic Reset Protocol"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newProtocol.category}
                    onChange={(e) => setNewProtocol({ ...newProtocol, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProtocol.description}
                  onChange={(e) => setNewProtocol({ ...newProtocol, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Describe the protocol and its goals..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Protocol Phases</h3>
                  <button
                    onClick={addPhase}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Phase
                  </button>
                </div>

                {newProtocol.phases.map((phase, index) => (
                  <PhaseBuilder key={phase.id} phase={phase} index={index} />
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowBuilder(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Protocol
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 