import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'; // Adjust import based on shadcn/ui setup

// Hero Section
const HeroSection = () => {
  return (
    <section className="py-20 text-center bg-black text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold mb-4"
      >
        Voice-Powered Scheduling, Reimagined
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl mb-8 text-gray-300"
      >
        Book appointments with just your voice. No more hassle.
      </motion.p>
      <div className="space-x-4">
        <Button className="bg-white text-black shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
          Get Started
        </Button>
        <Button variant="outline" className="text-white border-white shadow-lg hover:bg-white hover:text-black transition-transform transform hover:scale-105">
          Learn More
        </Button>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(255, 255, 255, 0.2)' }}
    >
      <Card className="bg-black border-white border shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      title: 'Voice-Powered Scheduling',
      description: 'Speak naturally to book appointments. Our AI understands your requests and handles the rest.',
    },
    {
      title: 'Automatic Conflict Resolution',
      description: 'Never worry about double-booking. Our system finds the best alternative times.',
    },
    {
      title: 'Real-Time Notifications',
      description: 'Stay updated with instant confirmations and reminders via voice, text, or email.',
    },
    {
      title: 'Travel & Delay Manager',
      description: 'Proactive rescheduling if traffic or delays might make you late.',
    },
  ];

  return (
    <section className="py-20 bg-black text-white">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose VoiceSched.ai?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  );
};

// Travel & Delay Manager Section
const TravelDelaySection = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="flex flex-col md:flex-row items-center px-4">
        <div className="md:w-1/2">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-4"
          >
            Never Be Late Again
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8 text-gray-300"
          >
            Our Travel & Delay Manager monitors traffic and reschedules appointments if you're running late.
          </motion.p>
          <Button className="bg-white text-black shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
            Learn More
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mt-8 md:mt-0"
        >
          <div className="bg-gray-800 h-64 rounded-lg flex items-center justify-center border border-white shadow-lg">
            <span className="text-4xl">🗺️</span> {/* Replace with an icon or image */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Call-to-Action Section
const CTASection = () => {
  return (
    <section className="py-20 text-center bg-black text-white">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold mb-4"
      >
        Ready to Simplify Your Scheduling?
      </motion.h2>
      <Button className="bg-white text-black shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
        Sign Up Now
      </Button>
    </section>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <nav className="p-4 flex justify-between items-center bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-bold"
        >
          VoiceSched.ai
        </motion.div>
        <div>
          <Button variant="outline" className="text-white border-white shadow-lg hover:bg-white hover:text-black transition-transform transform hover:scale-105">
            Sign In
          </Button>
        </div>
      </nav>
      <HeroSection />
      <FeaturesSection />
      <TravelDelaySection />
      <CTASection />
    </div>
  );
};

export default LandingPage;