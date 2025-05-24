import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Calendar, 
  Brain,
  ChevronRight,
  Play,
  Star,
  ArrowRight,
  Route,
  CheckCircle,
  type LucideIcon
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

// Update the generateWaveformData function
const generateWaveformData = (length: number) => {
  return Array.from({ length }, () => 
    Math.sin(Math.random() * Math.PI * 2) * 0.9 + 0.1 // Increased amplitude
  );
};

const LandingPage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [waveformData, setWaveformData] = useState(generateWaveformData(50));
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  const animationRef = useRef<number | null>(null);
  
  type Feature = {
    icon: LucideIcon;
    title: string;
    desc: string;
    details: {
      title: string;
      description: string;
      points: string[];
      demoImage?: string;
    };
  };

  const features: Feature[] = [
    {
      icon: Mic,
      title: "Voice-First Booking",
      desc: "Natural voice commands for seamless scheduling",
      details: {
        title: "Revolutionary Voice Booking",
        description: "Schedule appointments as naturally as having a conversation",
        points: [
          "Natural language processing understands context and intent",
          "Multiple language support for global accessibility",
          "Voice confirmation and feedback for clarity",
          "Hands-free booking perfect for multitasking"
        ],
        demoImage: "/voice-booking-demo.png"
      }
    },
    {
      icon: Brain,
      title: "AI Understanding",
      desc: "Smart scheduling powered by advanced AI",
      details: {
        title: "Intelligent Scheduling Assistant",
        description: "Our AI learns your preferences and optimizes schedules",
        points: [
          "Learns from your booking patterns and preferences",
          "Suggests optimal time slots based on history",
          "Handles complex scheduling conflicts automatically",
          "Predictive scheduling for recurring appointments"
        ],
        demoImage: "/ai-scheduling-demo.png"
      }
    },
    {
      icon: Route,
      title: "Smart Travel Planning",
      desc: "Intelligent travel time calculations",
      details: {
        title: "Real-Time Travel Intelligence",
        description: "Never be late with smart travel planning",
        points: [
          "Real-time traffic monitoring and updates",
          "Automatic buffer time calculations",
          "Multi-modal transport options",
          "Weather-aware scheduling adjustments"
        ],
        demoImage: "/travel-planning-demo.png"
      }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      setWaveformData(generateWaveformData(40)); // Reduced number of bars for better performance
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Faster animation frame rate
    const interval = setInterval(() => {
      animate();
    }, 100); // Updates every 100ms
    
    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  

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
                        className="h-full w-[3px] bg-white/50" // Increased width
                        initial={{ scaleY: 0 }}
                        animate={{ 
                          scaleY: height,
                          backgroundColor: `rgba(255, 255, 255, ${height * 0.9})`,
                        }}
                        transition={{
                          duration: 0.2, // Faster animation
                          ease: "easeOut",
                          repeat: Infinity,
                          repeatType: "reverse",
                          repeatDelay: Math.random() * 0.2 // Random delay for more natural look
                        }}
                        style={{
                          transformOrigin: "bottom",
                          margin: "0 1px" // Add small gap between bars
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
              <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white px-8 py-4 text-lg font-semibold transition-all duration-300">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Revolutionary Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Side - Feature List */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                Revolutionary Features
              </h2>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedFeature === index 
                        ? 'bg-white/10 border border-white/20' 
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedFeature(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        selectedFeature === index 
                          ? 'bg-white text-black' 
                          : 'bg-white/10'
                      }`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                    <br /><br /><br /><br />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side - Feature Details */}
            <div className="relative">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-xl"
              >
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {features[selectedFeature].details.title}
                </h3>
                
                <p className="text-lg text-gray-300 mb-6">
                  {features[selectedFeature].details.description}
                </p>

                <div className="space-y-4 mb-8">
                  {features[selectedFeature].details.points.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <p className="text-gray-400">{point}</p>
                    </motion.div>
                  ))}
                </div>

                {features[selectedFeature].details.demoImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl overflow-hidden"
                  >
                    <img
                      src={features[selectedFeature].details.demoImage}
                      alt={features[selectedFeature].title}
                      className="w-full h-auto"
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>
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
      {/* <div className="fixed inset-0 pointer-events-none">
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
      </div> */}
    </div>
  );
};

export default LandingPage;