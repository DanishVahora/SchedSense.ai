import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-white/10 overflow-hidden">
      {/* 3D Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2 mb-6 md:mb-0"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform">
              <Volume2 className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              VoiceSched.ai
            </span>
          </motion.div>

          <div className="flex flex-wrap justify-center space-x-8 text-gray-400">
            {['Privacy', 'Terms', 'Support', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="hover:text-white transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div 
          className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p>© 2025 VoiceSched.ai. All rights reserved. Built for Holboxathon.</p>
        </motion.div>
      </div>

      {/* 3D Glow Effects */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-white/5 to-transparent blur-3xl" />
    </footer>
  );
};

export default Footer;