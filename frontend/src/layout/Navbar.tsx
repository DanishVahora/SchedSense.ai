import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
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
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform transition-transform hover:rotate-12">
            <Volume2 className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            VoiceSched.ai
          </span>
        </motion.div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {['Features', 'How It Works', 'Pricing'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-gray-300 hover:text-white transition-colors relative group"
              whileHover={{ scale: 1.05 }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button 
              variant="outline" 
              className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Login
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button 
              variant="default"
              className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
            >
              Sign Up
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* 3D Glow Effect */}
      <div className="absolute inset-0 opacity-50 blur-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20" />
      </div>
    </motion.nav>
  );
};

export default Navbar;