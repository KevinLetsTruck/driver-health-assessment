'use client'

import { useState } from 'react'
import { 
  Video, 
  Calendar, 
  Users, 
  Plus,
  Clock,
  MessageSquare,
  FileText,
  Download,
  Play,
  Settings,
  ChevronRight,
  Send,
  Mic,
  MicOff,
  VideoOff
} from 'lucide-react'

export default function GroupSessionsPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [inSession, setInSession] = useState(false)

  const upcomingSessions = [
    {
      id: 1,
      title: 'Weekly Driver Health Coaching',
      date: 'Today',
      time: '2:00 PM - 4:00 PM',
      participants: 15,
      maxParticipants: 20,
      topics: ['Sleep Optimization', 'Nutrition Q&A', 'Exercise Strategies'],
      status: 'ready'
    },
    {
      id: 2,
      title: 'Gut Health Workshop',
      date: 'Thursday',
      time: '6:00 PM - 7:30 PM',
      participants: 8,
      maxParticipants: 12,
      topics: ['Understanding Microbiome', 'Fermented Foods', 'Supplement Protocol'],
      status: 'scheduled'
    }
  ]

  const SessionView = () => {
    const [messages, setMessages] = useState([
      { id: 1, user: 'John D.', message: 'How long should I wait after eating before sleeping?', time: '2:15 PM' },
      { id: 2, user: 'You', message: 'Great question John! Ideally, you want to wait at least 3 hours after a meal before going to bed.', time: '2:16 PM', isHost: true }
    ])
    const [newMessage, setNewMessage] = useState('')

    const participants = [
      { id: 1, name: 'John Driver', status: 'active', muted: false },
      { id: 2, name: 'Mary Smith', status: 'active', muted: true },
      { id: 3, name: 'Bob Johnson', status: 'active', muted: true },
      { id: 4, name: 'Sarah Williams', status: 'active', muted: false },
      { id: 5, name: 'Mike Davis', status: 'away', muted: true }
    ]

    const sendMessage = () => {
      if (newMessage.trim()) {
        setMessages([...messages, {
          id: messages.length + 1,
          user: 'You',
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isHost: true
        }])
        setNewMessage('')
      }
    }

    return (
      <div className="h-screen bg-gray-900 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-gray-800 p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-white text-lg font-semibold">Weekly Driver Health Coaching</h2>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">LIVE</span>
              <span className="text-gray-400">15 participants</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-gray-700 rounded hover:bg-gray-600">
                <Mic className="h-5 w-5 text-white" />
              </button>
              <button className="p-2 bg-gray-700 rounded hover:bg-gray-600">
                <Video className="h-5 w-5 text-white" />
              </button>
              <button className="p-2 bg-gray-700 rounded hover:bg-gray-600">
                <Settings className="h-5 w-5 text-white" />
              </button>
              <button 
                onClick={() => setInSession(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                End Session
              </button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 bg-gray-900 p-4">
            <div className="h-full bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Your camera is on</p>
                <p className="text-2xl text-white mt-2">Kevin Rutherford</p>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="bg-gray-800 p-4">
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Session Time</p>
                <p className="text-white text-lg font-mono">45:23</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Recording</p>
                <p className="text-red-400 text-lg">● Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-gray-800 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button className="flex-1 py-3 text-white bg-gray-700">
              <MessageSquare className="h-5 w-5 mx-auto" />
            </button>
            <button className="flex-1 py-3 text-gray-400 hover:text-white">
              <Users className="h-5 w-5 mx-auto" />
            </button>
            <button className="flex-1 py-3 text-gray-400 hover:text-white">
              <FileText className="h-5 w-5 mx-auto" />
            </button>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={msg.isHost ? 'text-right' : ''}>
                  <p className="text-xs text-gray-400">{msg.user} • {msg.time}</p>
                  <div className={`mt-1 inline-block px-3 py-2 rounded-lg ${
                    msg.isHost ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                />
                <button 
                  onClick={sendMessage}
                  className="p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (inSession) {
    return <SessionView />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Group Coaching Sessions</h1>
            <p className="text-gray-600 mt-1">Manage and conduct group coaching sessions</p>
          </div>
          <button
            onClick={() => setShowSessionModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Schedule Session
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'past' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Past Sessions
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'templates' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Templates
          </button>
        </div>

        {/* Upcoming Sessions */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingSessions.map(session => (
              <div key={session.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{session.title}</h3>
                      {session.status === 'ready' && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Ready to Start
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {session.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.participants}/{session.maxParticipants} registered
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {session.topics.map((topic, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {session.status === 'ready' && (
                        <button 
                          onClick={() => setInSession(true)}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Start Session
                        </button>
                      )}
                      <button className="btn-secondary">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Reminder
                      </button>
                      <button className="btn-secondary">
                        <Users className="h-4 w-4 mr-2" />
                        View Participants
                      </button>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Zoom Meeting</p>
                      <p className="text-xs text-gray-500 mt-1">ID: 123-456-789</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Session Resources */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Session Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <FileText className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-medium mb-1">Session Outline Template</h3>
              <p className="text-sm text-gray-600 mb-3">Standard 2-hour coaching format</p>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                Download <Download className="h-3 w-3 ml-1" />
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <FileText className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-medium mb-1">Participant Workbook</h3>
              <p className="text-sm text-gray-600 mb-3">Interactive exercises and notes</p>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                Download <Download className="h-3 w-3 ml-1" />
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <FileText className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="font-medium mb-1">Follow-up Email Template</h3>
              <p className="text-sm text-gray-600 mb-3">Post-session action items</p>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                Download <Download className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 