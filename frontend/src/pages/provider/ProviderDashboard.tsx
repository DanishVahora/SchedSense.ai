import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock,
  User,
  Plus,
  Settings,
  LogOut,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Timer,
  Phone,
  Eye,
  MoreVertical,
  TrendingUp,
  CalendarCheck,
  AlertCircle,
  Activity,
  Zap,
  Users,
  Target
} from 'lucide-react';

type Slot = {
  id: number;
  time: string;
  client: string | null;
  service: string | null;
  status: string;
  duration: number;
  phone?: string;
  delay?: string;
};

const ProviderDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking', message: 'New appointment booked for 3:00 PM', time: '2 min ago', unread: true },
    { id: 2, type: 'delay', message: 'Traffic delay alert for John Smith', time: '5 min ago', unread: true },
    { id: 3, type: 'cancellation', message: 'Appointment cancelled - Sarah Johnson', time: '15 min ago', unread: false },
    { id: 4, type: 'reminder', message: 'Upcoming appointment in 30 minutes', time: '30 min ago', unread: false },
  ]);

  const todaySchedule = [
    { id: 1, time: '09:00', client: 'John Smith', service: 'Dental Checkup', status: 'confirmed', duration: 60, phone: '+1 234-567-8900' },
    { id: 2, time: '10:30', client: 'Sarah Johnson', service: 'Teeth Cleaning', status: 'pending', duration: 45, phone: '+1 234-567-8901' },
    { id: 3, time: '11:30', client: null, service: null, status: 'available', duration: 30 },
    { id: 4, time: '12:00', client: 'Mike Wilson', service: 'Root Canal', status: 'confirmed', duration: 90, phone: '+1 234-567-8902' },
    { id: 5, time: '14:00', client: 'Emily Davis', service: 'Consultation', status: 'delay', duration: 30, phone: '+1 234-567-8903', delay: '15 min traffic delay' },
    { id: 6, time: '15:00', client: 'Tom Brown', service: 'Filling', status: 'confirmed', duration: 60, phone: '+1 234-567-8904' },
    { id: 7, time: '16:30', client: null, service: null, status: 'available', duration: 30 },
    { id: 8, time: '17:00', client: 'Lisa White', service: 'Checkup', status: 'pending', duration: 45, phone: '+1 234-567-8905' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

interface StatusColors {
    confirmed: string;
    pending: string;
    delay: string;
    available: string;
    [key: string]: string;
}

const getStatusColor = (status: string): string => {
    const statusColors: StatusColors = {
        confirmed: 'bg-white/20 border-white/40 text-white',
        pending: 'bg-gray-500/20 border-gray-400/40 text-gray-200',
        delay: 'bg-black/40 border-gray-600/60 text-gray-300',
        available: 'bg-gray-800/40 border-gray-600/40 text-gray-400',
    };
    return statusColors[status] || 'bg-gray-500/20 border-gray-400/40 text-gray-200';
};

interface StatusIconProps {
    status: string;
}

const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
        case 'confirmed': return <CheckCircle className="w-4 h-4 text-white" />;
        case 'pending': return <Timer className="w-4 h-4 text-gray-300" />;
        case 'delay': return <AlertTriangle className="w-4 h-4 text-gray-300" />;
        case 'available': return <Plus className="w-4 h-4 text-gray-500" />;
        default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
};

  const unreadCount = notifications.filter(n => n.unread).length;
  const todayStats = {
    total: todaySchedule.filter(slot => slot.client).length,
    pending: todaySchedule.filter(slot => slot.status === 'pending').length,
    delays: todaySchedule.filter(slot => slot.status === 'delay').length,
    confirmed: todaySchedule.filter(slot => slot.status === 'confirmed').length
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Geometric patterns */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.03) 50%, transparent 51%)
          `,
          backgroundSize: '100px 100px, 100px 100px, 50px 50px'
        }} />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Moving grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SchedSense AI
              </div>
              <div className="text-gray-300 font-medium hidden md:block">
                Welcome back, <span className="text-white font-semibold">Dr. Sarah Chen</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Display */}
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Clock className="w-4 h-4 text-white" />
                <span className="font-mono text-white font-medium">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="relative p-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black">
                      {unreadCount}
                    </div>
                  )}
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 p-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl backdrop-blur-sm transition-all duration-300"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 flex items-center space-x-2 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Appointments', value: todayStats.total, icon: CalendarCheck, trend: '+12%' },
              { title: 'Pending Requests', value: todayStats.pending, icon: Timer, trend: '+5%' },
              { title: 'Delay Alerts', value: todayStats.delays, icon: AlertTriangle, trend: '-8%' },
              { title: 'Confirmed Today', value: todayStats.confirmed, icon: CheckCircle, trend: '+15%' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 cursor-pointer hover:scale-105 hover:border-white/20"
                  style={{
                    animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400">
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{stat.title}</p>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Schedule */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Schedule */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Today's Schedule</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="px-3 py-1 bg-white/10 text-white text-sm rounded-lg border border-white/20">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Block Time</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {todaySchedule.map((slot, index) => (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getStatusColor(slot.status)} backdrop-blur-sm`}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        animation: `slideUp 0.4s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(slot.status)}
                            <span className="font-mono text-sm font-medium">{slot.time}</span>
                          </div>
                          <div>
                            {slot.client ? (
                              <>
                                <p className="font-semibold text-white">{slot.client}</p>
                                <p className="text-sm text-gray-300">{slot.service}</p>
                                {slot.delay && (
                                  <p className="text-xs text-gray-400 mt-1 bg-black/30 px-2 py-1 rounded">
                                    ⚠️ {slot.delay}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-gray-400 italic">Available Slot</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs bg-white/20 text-white px-2 py-1 rounded border border-white/30">
                            {slot.duration}min
                          </div>
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium flex items-center justify-center space-x-2 hover:scale-105">
                    <Plus className="w-4 h-4" />
                    <span>Add Unavailable</span>
                  </button>
                  <button className="p-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-medium flex items-center justify-center space-x-2 hover:scale-105">
                    <Eye className="w-4 h-4" />
                    <span>View All</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Activity Feed */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <Activity className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-xl border transition-all duration-300 hover:bg-white/10 cursor-pointer backdrop-blur-sm ${
                        notification.unread 
                          ? 'bg-white/10 border-white/20' 
                          : 'bg-white/5 border-white/10'
                      }`}
                      style={{
                        animation: `slideUp 0.4s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-white/10 rounded-full">
                          {notification.type === 'booking' && <CalendarCheck className="w-3 h-3 text-white" />}
                          {notification.type === 'delay' && <AlertTriangle className="w-3 h-3 text-white" />}
                          {notification.type === 'cancellation' && <AlertCircle className="w-3 h-3 text-white" />}
                          {notification.type === 'reminder' && <Clock className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 p-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors font-medium">
                  View All Notifications
                </button>
              </div>

              {/* Performance */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-semibold text-white">Performance</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Completion Rate</span>
                      <span className="text-white font-semibold">85%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: '85%', animation: 'fillBar 1.5s ease-out 0.5s both' }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">On-Time Rate</span>
                      <span className="text-white font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: '92%', animation: 'fillBar 1.5s ease-out 0.7s both' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Client Satisfaction</span>
                      <span className="text-white font-semibold">4.8/5</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: '96%', animation: 'fillBar 1.5s ease-out 0.9s both' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedSlot && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSlot(null)}
          >
            <div
              className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'modalSlide 0.3s ease-out' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Appointment Details</h3>
                <button 
                  onClick={() => setSelectedSlot(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  ×
                </button>
              </div>

              {selectedSlot.client ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{selectedSlot.client}</p>
                      <p className="text-gray-300">{selectedSlot.service}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg">
                      <Clock className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{selectedSlot.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg">
                      <Timer className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{selectedSlot.duration} min</span>
                    </div>
                  </div>

                  {selectedSlot.phone && (
                    <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg">
                      <Phone className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{selectedSlot.phone}</span>
                    </div>
                  )}

                  {selectedSlot.delay && (
                    <div className="p-3 bg-white/10 border border-white/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">{selectedSlot.delay}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Edit Appointment
                    </button>
                    <button className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors">
                      Contact Client
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Plus className="w-12 h-12 text-white mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">Available Time Slot</p>
                  <p className="text-gray-300 mb-6">{selectedSlot.time} - {selectedSlot.duration} minutes</p>
                  <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Book Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fillBar {
          from {
            width: 0;
          }
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50px);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ProviderDashboard;