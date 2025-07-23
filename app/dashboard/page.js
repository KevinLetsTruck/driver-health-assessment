'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Calendar, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Users,
  Upload,
  Heart,
  Brain,
  Pill,
  Clock,
  BarChart
} from 'lucide-react'
import DailyJournal from '../components/DailyJournal'

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [clientData, setClientData] = useState({
    name: 'John Driver',
    lastCheckIn: '2 days ago',
    nextAppointment: 'Thursday, 2:00 PM',
    protocolProgress: 65,
    healthScore: 78
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'journal', label: 'Daily Journal', icon: FileText },
    { id: 'labs', label: 'Lab Results', icon: Activity },
    { id: 'protocols', label: 'My Protocols', icon: Heart },
    { id: 'supplements', label: 'Supplements', icon: Pill },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'group', label: 'Group Sessions', icon: Users }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {clientData.name}!</h1>
              <p className="text-blue-100 mt-1">Your personalized health dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-200">Health Score</p>
              <p className="text-3xl font-bold">{clientData.healthScore}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 bg-white rounded-t-lg mt-6">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-lg shadow p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Protocol Progress</p>
                      <p className="text-2xl font-bold text-blue-900">{clientData.protocolProgress}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Last Check-in</p>
                      <p className="text-2xl font-bold text-green-900">{clientData.lastCheckIn}</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Next Appointment</p>
                      <p className="text-lg font-bold text-purple-900">{clientData.nextAppointment}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Active Protocols</p>
                      <p className="text-2xl font-bold text-orange-900">3</p>
                    </div>
                    <Heart className="h-8 w-8 text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Daily journal completed</p>
                      <p className="text-sm text-gray-500">Today, 8:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Activity className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Lab results uploaded</p>
                      <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New message from Kevin</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Log Today's Journal</span>
                  </button>
                  <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Upload className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Upload Lab Results</span>
                  </button>
                  <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Message Provider</span>
                  </button>
                  <button className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Schedule Appointment</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Daily Journal Tab */}
          {activeTab === 'journal' && (
            <DailyJournal />
          )}

          {/* Lab Results Tab */}
          {activeTab === 'labs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Lab Results</h2>
                <button className="btn-primary flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload New Results
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Comprehensive Metabolic Panel</h3>
                      <p className="text-sm text-gray-500">Quest Diagnostics • March 15, 2024</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Reviewed</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Key findings: All markers within normal range</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Hormone Panel</h3>
                      <p className="text-sm text-gray-500">LabCorp • March 10, 2024</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending Review</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Awaiting practitioner review</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab !== 'overview' && activeTab !== 'journal' && activeTab !== 'labs' && (
            <div className="text-center py-12">
              <p className="text-gray-500">This section is coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 