import { Button } from '@/components/ui/button';
import { Volume2, Calendar, User, Clock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const CustomerNavbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');

    // Redirect to login page
    window.location.href = '/';
  };

  const token = localStorage.getItem('token');
  if (token) {
      const decodedToken = jwtDecode<{ userId: string; role: string }>(token);
      console.log('Decoded Token:', decodedToken);

      if (decodedToken.role === 'customer') {
          window.location.href = '/CustomerDashboard';
      } else if (decodedToken.role === 'provider') {
          window.location.href = '/ProviderDashboard';
      }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 backdrop-blur-xl border-b border-white/10"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.7))'
      }}
    >
      <div className="relative z-50 flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform transition-transform hover:rotate-12">
            <Volume2 className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            SchedSense.ai
          </span>
        </motion.div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {[
            { title: 'Dashboard', icon: <Calendar className="w-4 h-4 mr-1" />, path: '/CustomerDashboard' },
            // { title: 'Service Providers', icon: <User className="w-4 h-4 mr-1" />, path: '/service-providers' },
            { title: 'Book Appointment', icon: <Calendar className="w-4 h-4 mr-1" />, path: '/book-appointment' },
            { title: 'My Appointments', icon: <Clock className="w-4 h-4 mr-1" />, path: '/my-appointments' },
          ].map((item) => (
            <motion.div
              key={item.title}
              onClick={() => navigate(item.path)}
              className="text-gray-300 hover:text-white transition-colors relative group flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              {item.icon}
              {item.title}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button onClick={handleLogout} className="text-white">
            Logout
          </Button>
        </motion.div>
      </div>
      
      {/* Mobile Menu (can be expanded in the future) */}
      <div className="md:hidden">
        {/* Mobile menu implementation here */}
      </div>
      
      {/* 3D Glow Effect */}
      <div className="absolute inset-0 opacity-50 blur-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
      </div>
    </motion.nav>
  );
};

export default CustomerNavbar;