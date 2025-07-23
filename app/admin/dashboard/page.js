'use client'

import { useState } from 'react'
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  MessageSquare,
  Video,
  ChartBar,
  Upload,
  Search,
  Filter,
  Bell,
  Settings
} from 'lucide-react'

export default function PractitionerDashboard() {
  const [activeView, setActiveView] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = {
    totalClients: 127,
    activeProtocols: 89,
    pendingReviews: 12,
    upcomingAppointments: 8,
    groupSessionToday: true
  }

  const recentAlerts = [
    { id: 1, client: 'John Driver', alert: 'HRV dropped below threshold', time: '2 hours ago', severity: 'high' },
    { id: 2, client: 'Mary Smith', alert: 'Lab results ready for review', time: '5 hours ago', severity: 'medium' },
    { id: 3, client: 'Bob Johnson', alert: 'Missed 3 daily journals', time: '1 day ago', severity: 'low' }
  ]

  const upcomingAppointments = [
    { id: 1, client: 'Sarah Williams', time: '10:00 AM', type: 'Initial Consultation' },
    { id: 2, client: 'Mike Davis', time: '11:30 AM', type: 'Follow-up' },
    { id: 3, client: 'Group Session', time: '2:00 PM', type: 'Weekly Coaching', participants: 15 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Practitioner Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Protocols</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeProtocols}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingReviews}</p>
              </div>
              <FileText className="h-10 w-10 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Group Session</p>
                <p className="text-lg font-bold text-gray-900">Today 2PM</p>
              </div>
              <Video className="h-10 w-10 text-red-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Active Clients</h2>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Filter className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <ChartBar className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="divide-y">
                {/* Client rows */}
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">John Driver</h3>
                      <p className="text-sm text-gray-500">Protocol: Gut Health Recovery • Week 3/12</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">HRV Improving</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Compliant</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last check-in: 2h ago</p>
                      <p className="text-sm font-medium text-green-600">Health Score: 82</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Mary Smith</h3>
                      <p className="text-sm text-gray-500">Protocol: Energy Optimization • Week 6/8</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Lab Review Pending</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last check-in: 1d ago</p>
                      <p className="text-sm font-medium text-yellow-600">Health Score: 68</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Bob Johnson</h3>
                      <p className="text-sm text-gray-500">Protocol: Sleep Restoration • Week 2/6</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Low Engagement</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last check-in: 3d ago</p>
                      <p className="text-sm font-medium text-red-600">Health Score: 54</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
                <div className="space-y-3">
                  {recentAlerts.map(alert => (
                    <div key={alert.id} className={`p-3 rounded-lg ${
                      alert.severity === 'high' ? 'bg-red-50' : 
                      alert.severity === 'medium' ? 'bg-yellow-50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-start">
                        <AlertCircle className={`h-5 w-5 mt-0.5 mr-2 ${
                          alert.severity === 'high' ? 'text-red-500' : 
                          alert.severity === 'medium' ? 'text-yellow-500' : 'text-gray-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.client}</p>
                          <p className="text-sm text-gray-600">{alert.alert}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
                <div className="space-y-3">
                  {upcomingAppointments.map(apt => (
                    <div key={apt.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{apt.client}</p>
                        <p className="text-sm text-gray-600">{apt.type}</p>
                        {apt.participants && (
                          <p className="text-xs text-gray-500">{apt.participants} participants</p>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{apt.time}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 btn-primary text-sm">
                  Start Group Session
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full p-2 text-left hover:bg-gray-50 rounded-lg flex items-center">
                  <Upload className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-sm">Upload Lab Results</span>
                </button>
                <button className="w-full p-2 text-left hover:bg-gray-50 rounded-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-sm">Send Group Message</span>
                </button>
                <button className="w-full p-2 text-left hover:bg-gray-50 rounded-lg flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-sm">Create Protocol</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 