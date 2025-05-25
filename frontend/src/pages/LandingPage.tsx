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
  MessageSquare,
  Clock,
  MapPin,
  User,
  Phone,
  type LucideIcon
} from 'lucide-react';
import Navbar from '@/layout/Navbar';
import Footer from '@/layout/Footer';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import SiriWave from 'react-siriwave';

const LandingPage = () => {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  const [isListening, setIsListening] = useState(false);
  const [waveAmplitude, setWaveAmplitude] = useState(1);
  const [demoStep, setDemoStep] = useState(0);
  const [currentDemo, setCurrentDemo] = useState('voice');
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0.5)); // 32 bars, initial height 0.5

  // Simulate waveform data for the hero section
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformData(Array.from({ length: 32 }, () => Math.random() * 0.7 + 0.3));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  type Feature = {
    icon: LucideIcon;
    title: string;
    desc: string;
    demoType: string;
    details: {
      title: string;
      description: string;
      points: string[];
      demo: any;
    };
  };

  const features: Feature[] = [
    {
      icon: Mic,
      title: "Voice-First Booking",
      desc: "Natural voice commands for seamless scheduling",
      demoType: "voice",
      details: {
        title: "Revolutionary Voice Booking",
        description: "Schedule appointments as naturally as having a conversation",
        points: [
          "Natural language processing understands context and intent",
          "Multiple language support for global accessibility", 
          "Voice confirmation and feedback for clarity",
          "Hands-free booking perfect for multitasking"
        ],
        demo: {
          conversation: [
            { type: 'user', text: '"Book me a dentist appointment next Tuesday at 2 PM"' },
            { type: 'ai', text: 'I found Dr. Smith available at 2 PM next Tuesday. Shall I book this for you?' },
            { type: 'user', text: '"Yes, please confirm"' },
            { type: 'ai', text: 'Perfect! Your appointment is confirmed. I\'ll send you a reminder.' }
          ]
        }
      }
    },
    {
      icon: Brain,
      title: "AI Understanding", 
      desc: "Smart scheduling powered by advanced AI",
      demoType: "ai",
      details: {
        title: "Intelligent Scheduling Assistant",
        description: "Our AI learns your preferences and optimizes schedules",
        points: [
          "Learns from your booking patterns and preferences",
          "Suggests optimal time slots based on history",
          "Handles complex scheduling conflicts automatically",
          "Predictive scheduling for recurring appointments"
        ],
        demo: {
          analysis: [
            { label: "Intent Recognition", value: "Book Appointment", confidence: 98 },
            { label: "Time Extraction", value: "Next Tuesday 2PM", confidence: 95 },
            { label: "Service Type", value: "Dental Checkup", confidence: 92 },
            { label: "Location Preference", value: "Downtown Clinic", confidence: 88 }
          ]
        }
      }
    },
    {
      icon: Route,
      title: "Smart Travel Planning",
      desc: "Intelligent travel time calculations", 
      demoType: "travel",
      details: {
        title: "Real-Time Travel Intelligence",
        description: "Never be late with smart travel planning",
        points: [
          "Real-time traffic monitoring and updates",
          "Automatic buffer time calculations",
          "Multi-modal transport options", 
          "Weather-aware scheduling adjustments"
        ],
        demo: {
          route: {
            from: "Your Location",
            to: "Downtown Dental Clinic",
            distance: "12.5 km",
            normalTime: "18 min",
            currentTime: "25 min", 
            delay: "Heavy traffic detected",
            suggestion: "Leave 10 minutes earlier"
          }
        }
      }
    }
  ];

  // Enhanced wave amplitude simulation for dramatic effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate much higher amplitude values for dramatic waves
      const baseAmplitude = isListening ? 4 : 1;
      const randomMultiplier = Math.random() * 5 + 3; // Range: 3-8
      setWaveAmplitude(baseAmplitude * randomMultiplier);
    }, 120); // Even faster updates
    
    return () => clearInterval(interval);
  }, [isListening]);

  // More dramatic listening state toggle
  useEffect(() => {
    const interval = setInterval(() => {
      setIsListening(prev => !prev);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  // Demo step progression
  useEffect(() => {
    if (selectedFeature === 0) { // Voice demo
      const interval = setInterval(() => {
        setDemoStep(prev => (prev + 1) % features[0].details.demo.conversation.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedFeature]);

  const renderFeatureDemo = () => {
    const feature = features[selectedFeature];
    
    switch (feature.demoType) {
      case 'voice':
        return (
          <div className="space-y-4">
            {/* Voice Conversation Demo */}
            <div className="bg-black/40 rounded-lg p-6 h-64 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-400 mb-4">Live Voice Conversation</h4>
              <div className="space-y-3">
                {feature.details.demo.conversation.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: index <= demoStep ? 1 : 0.3,
                      y: index <= demoStep ? 0 : 20
                    }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-100'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {msg.type === 'user' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Brain className="w-3 h-3" />
                        )}
                        <span className="text-xs font-medium">
                          {msg.type === 'user' ? 'You' : 'SchedSense AI'}
                        </span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Voice Waveform Display */}
            <div className="bg-black/40 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Voice Input Analysis</span>
                <Badge className={`text-xs ${isListening ? 'bg-green-500' : 'bg-gray-500'}`}>
                  {isListening ? 'Listening' : 'Idle'}
                </Badge>
              </div>
              <div className="h-12 bg-black/60 rounded flex items-center justify-center">
                <div className="flex items-center space-x-1">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-green-400 rounded-full"
                      animate={{
                        height: isListening 
                          ? [4, Math.random() * 24 + 8, 4]
                          : [4, 6, 4]
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-4">
            {/* AI Analysis Dashboard */}
            <div className="bg-black/40 rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-400 mb-4">AI Processing Dashboard</h4>
              <div className="space-y-3">
                {feature.details.demo.analysis.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-black/60 rounded"
                  >
                    <div>
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Confidence</div>
                      <div className="text-green-400 font-bold">{item.confidence}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Processing Animation */}
            <div className="bg-black/40 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Neural Processing</span>
              </div>
              <div className="space-y-2">
                {['Natural Language Processing', 'Intent Classification', 'Entity Extraction', 'Response Generation'].map((process, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <span className="text-xs text-gray-300">{process}</span>
                    <CheckCircle className="w-3 h-3 text-green-400 ml-auto" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'travel':
        return (
          <div className="space-y-4">
            {/* Travel Route Display */}
            <div className="bg-black/40 rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-400 mb-4">Smart Route Planning</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-300">From</p>
                    <p className="text-white font-medium">{feature.details.demo.route.from}</p>
                  </div>
                </div>
                
                <div className="border-l-2 border-dashed border-gray-600 ml-1.5 h-8"></div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-300">To</p>
                    <p className="text-white font-medium">{feature.details.demo.route.to}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Analytics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Travel Time</span>
                </div>
                <p className="text-white font-bold">{feature.details.demo.route.currentTime}</p>
                <p className="text-xs text-gray-500">Usually {feature.details.demo.route.normalTime}</p>
              </div>
              
              <div className="bg-black/40 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Distance</span>
                </div>
                <p className="text-white font-bold">{feature.details.demo.route.distance}</p>
              </div>
            </div>

            {/* Traffic Alert */}
            <motion.div
              className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-4"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-300 font-medium text-sm">Traffic Alert</span>
              </div>
              <p className="text-orange-100 text-sm">{feature.details.demo.route.delay}</p>
              <p className="text-orange-200 text-xs mt-1">💡 {feature.details.demo.route.suggestion}</p>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <div className="relative px-6 py-20 text-center">
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

            {/* Interactive Voice Demo */}
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
                    We are here to listens You !!
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
                        className="h-full w-[6px] bg-white/50" // Increased width
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
              <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300">
                <Play className="mr-2 w-5 h-5" />
                Watch Full Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Features Demo Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              🚀 Live Feature Demonstrations
            </h2>
            <p className="text-gray-400 text-lg">Experience our AI capabilities in real-time</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Feature Selection */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedFeature === index 
                      ? 'bg-white/10 border-white/30 shadow-lg' 
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                  onClick={() => setSelectedFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg transition-all ${
                      selectedFeature === index 
                        ? 'bg-white text-black shadow-lg' 
                        : 'bg-white/10 text-white'
                    }`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2 flex items-center">
                        {feature.title}
                        {selectedFeature === index && (
                          <Badge className="ml-2 bg-green-500 text-white text-xs">LIVE DEMO</Badge>
                        )}
                      </h4>
                      <p className="text-gray-400 mb-3">{feature.desc}</p>
                      <div className="space-y-2">
                        {feature.details.points.slice(0, 2).map((point, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-sm text-gray-300">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Demo Display */}
            <div className="lg:sticky lg:top-6">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {features[selectedFeature].details.title}
                  </h3>
                  <Badge className="bg-blue-500 text-white">
                    LIVE DEMO
                  </Badge>
                </div>
                
                <p className="text-gray-300 mb-6">
                  {features[selectedFeature].details.description}
                </p>

                {/* Dynamic Demo Content */}
                {renderFeatureDemo()}
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
                "SchedSense.ai transformed our salon booking process. Clients love the voice booking, 
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
            Join thousands of businesses already using SchedSense.ai to streamline their appointment scheduling
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
    </div>
  );
};

export default LandingPage;