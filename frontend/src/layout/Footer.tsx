import { Volume2, Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-20 px-6 border-t border-white/10 overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-t from-white/5 to-transparent blur-3xl opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Logo & About */}
          <div className="space-y-6">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform">
                <Volume2 className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                SchedSense.ai
              </span>
            </motion.div>
            <p className="text-gray-400">
              Revolutionizing appointment scheduling with AI voice technology. Making booking simple, smart, and seamless.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Navigation</h4>
            <ul className="space-y-3">
              {['Home', 'Features', 'How It Works', 'Pricing', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <motion.a
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <span className="absolute left-0 w-0 h-0.5 bg-white/70 transition-all duration-300 group-hover:w-4" />
                    <span className="ml-0 group-hover:ml-6 transition-all duration-300">{item}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Support & Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Compliance', 'Support Center', 'FAQ'].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors relative group flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <span className="absolute left-0 w-0 h-0.5 bg-white/70 transition-all duration-300 group-hover:w-4" />
                    <span className="ml-0 group-hover:ml-6 transition-all duration-300">{item}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to receive the latest updates and news
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white" 
              />
              <Button className="bg-white text-black hover:bg-gray-200">
                Subscribe
              </Button>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-white/70 mt-0.5" />
                <span>123 AI Plaza, Tech District, CA 94107</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-white/70" />
                <a href="mailto:hello@SchedSense.ai" className="hover:text-white">hello@SchedSense.ai</a>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-white/70" />
                <a href="tel:+12345678900" className="hover:text-white">+1 (234) 567-8900</a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Copyright & Bottom Links */}
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {currentYear} SchedSense.ai. All rights reserved. Built for Holboxathon.
          </motion.p>
          
          <div className="flex flex-wrap justify-center space-x-6 mt-4 md:mt-0">
            {['Help Center', 'Accessibility', 'Cookie Settings', 'Contact Us'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Highlight */}
      <motion.div 
        className="absolute top-0 left-[5%] w-[90%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          width: ["80%", "95%", "80%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ left: '5%' }}
      />
    </footer>
  );
};

export default Footer;