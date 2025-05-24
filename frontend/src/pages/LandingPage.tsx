import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Zap, 
  Shield, 
  Brain,
  ChevronRight,
  Play,
  Star,
  ArrowRight,
  Volume2,
  Bot,
  Route,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const generateWaveformData = (length: number) => {
  return Array.from({ length }, () => 
    Math.sin(Math.random() * Math.PI * 2) * 0.5 + 0.5
  );
};

const LandingPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [waveformData, setWaveformData] = useState(generateWaveformData(50));
  const animationRef = useRef<number | null>(null);
  
  const features = [
    { icon: Mic, title: "Voice-First Booking", desc: "Just speak naturally - 'Book me a 3pm haircut tomorrow'" },
    { icon: Brain, title: "AI Understanding", desc: "Smart agents parse your intent and handle the details" },
    { icon: Route, title: "Travel Intelligence", desc: "Monitors traffic and proactively reschedules delays" },
    { icon: Zap, title: "Instant Confirmation", desc: "Get voice, text, and notification confirmations" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      setWaveformData(generateWaveformData(50));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleVoiceDemo = () => {
    setIsListening(!isListening);
    setTimeout(() => setIsListening(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 3D Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <Navbar></Navbar>

        {/* Hero Content */}
        <div className="relative px-6 py-20 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300">
              🚀 Powered by Advanced AI Agents
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Schedule by
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Voice, {' '}
                <TypeAnimation
                  sequence={[
                    'Powered by AI',
                    1000,
                    'Enhanced by AI',
                    1000,
                    'Perfected by AI',
                    1000,
                    'Powered by AI',
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-red inline-block"
                  repeat={Infinity}
                  cursor={true}
                  style={{
                    backgroundImage: 'linear-gradient(to right, #ff4d4d, #f9f9f9)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(255,77,77,0.3)'
                  }}
                />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The world's first voice-first appointment scheduler with intelligent travel management. 
              Just speak naturally, and let our AI agents handle the rest.
            </p>

            {/* Voice Demo Button */}
            <div className="relative w-full max-w-2xl mx-auto mb-16">
              <motion.div 
                className="glass-card p-8 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-6">
                  <motion.h3 
                    className="text-2xl font-medium text-white/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    We are here to listen You !!
                  </motion.h3>
                </div>

                <div className="h-24 relative overflow-hidden rounded-lg bg-black/30">
                  <motion.div 
                    className="flex items-center justify-center h-full gap-[2px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {waveformData.map((height, index) => (
                      <motion.div
                        key={index}
                        className="h-full w-[2px] bg-white/50"
                        initial={{ scaleY: 0 }}
                        animate={{ 
                          scaleY: height,
                          backgroundColor: `rgba(255, 255, 255, ${height * 0.8})`
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
                </div>

                <motion.p 
                  className="text-center mt-6 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Simplifying appointment scheduling with artificial intelligence
                </motion.p>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="group bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of appointment scheduling with AI-powered automation and intelligence
            </p>
          </div>

          {/* Dynamic Feature Showcase */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index}
                    className={`bg-white/5 border-white/10 transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                      currentFeature === index ? 'bg-white/10 border-white/20 shadow-2xl' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg transition-all duration-300 ${
                          currentFeature === index ? 'bg-white text-black' : 'bg-white/10 text-white'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-400">{feature.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center">
                    {React.createElement(features[currentFeature].icon, { className: "w-10 h-10 text-black" })}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{features[currentFeature].title}</h3>
                  <p className="text-gray-300 text-lg">{features[currentFeature].desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and privacy protection" },
              { icon: Users, title: "Multi-Business Support", desc: "Manage multiple locations and service types" },
              { icon: Bot, title: "Smart Conflict Resolution", desc: "AI automatically handles scheduling conflicts" },
              { icon: Clock, title: "Real-Time Updates", desc: "Instant notifications for all changes" },
              { icon: MapPin, title: "Location Intelligence", desc: "GPS-aware scheduling with travel optimization" },
              { icon: CheckCircle, title: "99.9% Uptime", desc: "Reliable service you can count on" }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI agent ecosystem works seamlessly to handle every aspect of your appointment scheduling
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Speak Naturally", desc: "Just say what you want: 'Book me a 3pm haircut tomorrow'", icon: Mic },
              { step: "02", title: "AI Understanding", desc: "Our Coordinator Agent processes your request using advanced NLP", icon: Brain },
              { step: "03", title: "Smart Scheduling", desc: "Scheduler Agent checks availability and handles conflicts automatically", icon: Calendar },
              { step: "04", title: "Confirmation", desc: "Get instant voice, SMS, and email confirmations", icon: CheckCircle }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-white/20 mb-4">{step.step}</div>
                      <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                      <p className="text-gray-400">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Loved by Businesses
          </h2>
          
          <Card className="bg-white/5 border-white/10 p-8 md:p-12">
            <CardContent>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-white fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl text-white mb-8 leading-relaxed">
                "VoiceSched.ai transformed our salon booking process. Clients love the voice booking, 
                and the travel delay management has reduced no-shows by 80%."
              </blockquote>
              <div className="text-gray-400">
                <p className="font-semibold">Sarah Chen</p>
                <p>Owner, Elite Hair Studio</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of businesses already using VoiceSched.ai to streamline their appointment scheduling
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button className="group bg-white text-black hover:bg-gray-100 px-12 py-6 text-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Start Your Free Trial
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 px-12 py-6 text-xl font-semibold transition-all duration-300">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-gray-500 mt-8">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      <Footer />
      
      {/* 3D Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;