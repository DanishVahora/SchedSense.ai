import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, LogIn, Store } from 'lucide-react';
import Navbar from '@/layout/Navbar';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer' // Default role
  });

  const [isLoading, setIsLoading] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<Array<{ x: number; y: number; size: number }>>([]);

  useEffect(() => {
    // Generate random floating particles
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setFloatingParticles(particles);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare form data
    const { email, password, role } = formData;
    const loginData = { email, password, role };

    try {
        const response = await fetch('http://localhost:3004/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);
        // Handle successful login (e.g., store token, redirect)
    } catch (error) {
        console.error('Error during login:', error);
    } finally {
        setIsLoading(false);
    }
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
        
        {/* Animated Floating Particles */}
        {floatingParticles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-6 py-20">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  🔒 Secure Login
                </Badge>
                
                <h1 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Welcome Back
                  </span>
                </h1>
                
                <TypeAnimation
                  sequence={[
                    'Login to manage your appointments',
                    2000,
                    'Access your schedule anytime',
                    2000
                  ]}
                  wrapper="p"
                  speed={50}
                  className="text-lg text-gray-400"
                  repeat={Infinity}
                />
              </motion.div>
            </div>

            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'customer' })}
                        className={`${
                          formData.role === 'customer' 
                            ? 'bg-white text-black' 
                            : 'bg-white/10 text-white'
                        } transition-all duration-300`}
                      >
                        <User className="w-5 h-5 mr-2" />
                        Customer
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'provider' })}
                        className={`${
                          formData.role === 'provider' 
                            ? 'bg-white text-black' 
                            : 'bg-white/10 text-white'
                        } transition-all duration-300`}
                      >
                        <Store className="w-5 h-5 mr-2" />
                        Provider
                      </Button>
                    </div>

                    {/* Email & Password Fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-white/10 border-white/20 text-white pl-12 placeholder:text-gray-500"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-white/10 border-white/20 text-white pl-12 placeholder:text-gray-500"
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-gray-100 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <LogIn className="w-5 h-5 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-400">
                      Don't have an account?{' '}
                      <a href="/register" className="text-white hover:underline">
                        Sign up now
                      </a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;