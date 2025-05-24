import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  MapPin,
  Phone,
  Mail,
  Eye,
  MoreVertical,
  TrendingUp,
  Users,
  CalendarCheck,
  AlertCircle,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProviderDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
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
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking', message: 'New appointment booked for 3:00 PM', time: '2 min ago', unread: true },
    { id: 2, type: 'delay', message: 'Traffic delay alert for John Smith', time: '5 min ago', unread: true },
    { id: 3, type: 'cancellation', message: 'Appointment cancelled - Sarah Johnson', time: '15 min ago', unread: false },
    { id: 4, type: 'reminder', message: 'Upcoming appointment in 30 minutes', time: '30 min ago', unread: false },
  ]);

  // Mock schedule data
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

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  interface StatusColorMap {
    [key: string]: string;
  }

  type SlotStatus = 'confirmed' | 'pending' | 'delay' | 'available' | string;

  const getStatusColor = (status: SlotStatus): string => {
    const statusColors: StatusColorMap = {
      confirmed: 'bg-green-500/30 border-green-400/60 text-green-200',
      pending: 'bg-yellow-500/30 border-yellow-400/60 text-yellow-200',
      delay: 'bg-red-500/30 border-red-400/60 text-red-200',
      available: 'bg-gray-500/30 border-gray-400/60 text-gray-200',
    };
    return statusColors[status] ?? 'bg-gray-500/30 border-gray-400/60 text-gray-200';
  };

  interface StatusIconProps {
    status: string;
  }

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Timer className="w-4 h-4 text-yellow-400" />;
      case 'delay': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'available': return <Plus className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,69,233,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Header Bar with Better Contrast */}
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                SchedSense AI
              </motion.div>
              <motion.div 
                className="text-gray-200 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome, <span className="text-blue-300">Dr. Sarah Chen</span>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Current Time with Better Visibility */}
              <motion.div 
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Clock className="w-4 h-4 text-blue-300" />
                <span className="font-mono text-white font-medium">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>

              {/* Enhanced Notifications */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {unreadCount}
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              {/* Enhanced Profile Dropdown */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl rounded-lg border border-white/30 overflow-hidden shadow-2xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20 border-0">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-red-300 hover:bg-red-500/20 border-0">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Enhanced Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Total Appointments', value: todayStats.total, icon: CalendarCheck, gradient: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/25' },
                { title: 'Pending Requests', value: todayStats.pending, icon: Timer, gradient: 'from-yellow-500 to-orange-600', shadow: 'shadow-yellow-500/25' },
                { title: 'Delay Alerts', value: todayStats.delays, icon: AlertTriangle, gradient: 'from-red-500 to-pink-600', shadow: 'shadow-red-500/25' },
                { title: 'Confirmed', value: todayStats.confirmed, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/25' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    style={{ perspective: 1000 }}
                  >
                    <Card className={`bg-white/10 border-white/30 hover:bg-white/15 transition-all duration-300 cursor-pointer backdrop-blur-xl ${stat.shadow} group`}>
                      <CardContent className="p-6 relative overflow-hidden">
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                              <motion.div 
                                className="text-3xl font-bold text-white"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                              >
                                {stat.value}
                              </motion.div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 font-medium">{stat.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Enhanced Schedule View */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar/Schedule with Better Contrast */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-white/10 border-white/30 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="border-b border-white/20">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-white flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                          Today's Schedule
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-500/30 text-blue-200 border border-blue-400/50 backdrop-blur-sm">
                            {new Date().toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Badge>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg">
                            <Plus className="w-4 h-4 mr-1" />
                            Block Time
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {todaySchedule.map((slot, index) => (
                          <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getStatusColor(slot.status)} backdrop-blur-sm`}
                            onClick={() => setSelectedSlot(slot)}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(slot.status)}
                                  <span className="font-mono text-sm text-white font-medium">{slot.time}</span>
                                </div>
                                <div>
                                  {slot.client ? (
                                    <>
                                      <p className="font-semibold text-white">{slot.client}</p>
                                      <p className="text-sm text-gray-200">{slot.service}</p>
                                      {slot.delay && (
                                        <motion.p 
                                          className="text-xs text-red-200 mt-1 bg-red-500/20 px-2 py-1 rounded"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                        >
                                          ⚠️ {slot.delay}
                                        </motion.p>
                                      )}
                                    </>
                                  ) : (
                                    <p className="text-gray-300 italic">Available Slot</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/40">
                                  {slot.duration}min
                                </Badge>
                                <MoreVertical className="w-4 h-4 text-gray-300" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Enhanced Quick Actions */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-white/10 border-white/30 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 justify-start shadow-lg">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Unavailable Slot
                        </Button>
                        <Button variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 justify-start backdrop-blur-sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View All Appointments
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Enhanced Notifications Feed */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-white/10 border-white/30 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="border-b border-white/20">
                      <CardTitle className="text-lg font-semibold text-white flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-purple-400" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg border transition-all duration-300 hover:bg-white/15 cursor-pointer backdrop-blur-sm ${
                              notification.unread 
                                ? 'bg-white/15 border-white/40 shadow-lg' 
                                : 'bg-white/5 border-white/20'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full ${
                                notification.type === 'booking' ? 'bg-green-500/30' :
                                notification.type === 'delay' ? 'bg-red-500/30' :
                                notification.type === 'cancellation' ? 'bg-yellow-500/30' :
                                'bg-blue-500/30'
                              }`}>
                                {notification.type === 'booking' && <CalendarCheck className="w-3 h-3 text-green-300" />}
                                {notification.type === 'delay' && <AlertTriangle className="w-3 h-3 text-red-300" />}
                                {notification.type === 'cancellation' && <AlertCircle className="w-3 h-3 text-yellow-300" />}
                                {notification.type === 'reminder' && <Clock className="w-3 h-3 text-blue-300" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium leading-relaxed">{notification.message}</p>
                                <p className="text-xs text-gray-300 mt-1">{notification.time}</p>
                              </div>
                              {notification.unread && (
                                <motion.div 
                                  className="w-3 h-3 bg-blue-400 rounded-full shadow-lg"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4 border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                        View All Notifications
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Enhanced Performance Widget */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="bg-white/10 border-white/30 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-white flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Completion Rate</span>
                          <span className="text-white font-semibold">85%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ delay: 0.8, duration: 1 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">On-Time Rate</span>
                          <span className="text-white font-semibold">92%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full shadow-lg"
                            initial={{ width: 0 }}
                            animate={{ width: '92%' }}
                            transition={{ delay: 1, duration: 1 }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Selected Slot Modal */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSlot(null)}
            >
              <motion.div
                className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/30 p-6 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Appointment Details</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedSlot(null)}
                    className="text-gray-300 hover:text-white hover:bg-white/20"
                  >
                    ×
                  </Button>
                </div>

                {selectedSlot.client ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{selectedSlot.client}</p>
                        <p className="text-gray-300 text-sm">{selectedSlot.service}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">{selectedSlot.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg">
                        <Timer className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">{selectedSlot.duration} min</span>
                      </div>
                    </div>

                    {selectedSlot.phone && (
                      <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg">
                        <Phone className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">{selectedSlot.phone}</span>
                      </div>
                    )}

                    {selectedSlot.delay && (
                      <div className="p-3 bg-red-500/30 border border-red-400/60 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-300" />
                          <span className="text-red-200 text-sm">{selectedSlot.delay}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4">
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                        Edit Appointment
                      </Button>
                      <Button variant="outline" className="flex-1 border-white/40 bg-white/10 text-white hover:bg-white/20">
                        Contact Client
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">Available Time Slot</p>
                    <p className="text-gray-300 text-sm mb-4">{selectedSlot.time} - {selectedSlot.duration} minutes</p>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700">
                      Book Appointment
                    </Button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProviderDashboard;