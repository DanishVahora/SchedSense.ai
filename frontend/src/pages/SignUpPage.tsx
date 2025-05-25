import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Store, CheckCircle, Building, Users, Clock, Upload } from 'lucide-react';
import Navbar from '@/layout/Navbar';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [userType, setUserType] = useState<'customer' | 'provider'>('customer');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    businessName: '',
    contactPersonName: '',
    physicalAddress: '',
    workingHours: '',
    servicesOffered: [{ name: '', duration: '', price: '' }],
    bufferTime: '',
    minimumNoticeTime: '',
    businessLicense: null as File | null,
    paymentDetails: '',
    phoneNumber: '',
    timeZone: '',
    notificationChannels: [] as string[],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        navigate('/CustomerDashboard');
    }
}, [navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleNotificationChange = (channel: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        notificationChannels: [...prev.notificationChannels, channel]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        notificationChannels: prev.notificationChannels.filter(c => c !== channel)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password, firstName, lastName } = formData;

    // Ensure all required fields are present
    if (!username || !email || !password || !firstName || !lastName) {
        console.error('All fields are required');
        return;
    }

    console.log('Form data:', formData);

    try {
        const response = await fetch('http://localhost:3004/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                firstName,
                lastName,
                role: userType
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Registration failed:', errorData);
            throw new Error('Registration failed');
        }

        const data = await response.json();
        console.log('Registration successful:', data);

        // Save the JWT token in local storage
        localStorage.setItem('token', data.token);

        // Redirect to CustomerDashboard
        window.location.href = '/CustomerDashboard';
    } catch (error) {
        console.error('Error during registration:', error);
    }
};

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: [...prev.servicesOffered, { name: '', duration: '', price: '' }]
    }));
  };

  const updateService = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative z-10">

        <div className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300">
                🚀 Join VoiceSched.ai
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Create Your Account
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join thousands of users revolutionizing appointment scheduling with AI
              </p>
            </div>

            {/* User Type Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={() => setUserType('customer')}
                    className={`px-8 py-3 rounded-lg transition-all duration-300 ${
                      userType === 'customer'
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Customer
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setUserType('provider')}
                    className={`px-8 py-3 rounded-lg transition-all duration-300 ${
                      userType === 'provider'
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    <Store className="w-5 h-5 mr-2" />
                    Service Provider
                  </Button>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  {userType === 'customer' ? (
                    <>
                      <Users className="w-6 h-6 mr-3" />
                      Customer Registration
                    </>
                  ) : (
                    <>
                      <Building className="w-6 h-6 mr-3" />
                      Service Provider Registration
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {userType === 'customer'
                    ? 'Create your account to start booking appointments with voice commands'
                    : 'Register your business to offer voice-powered appointment scheduling'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {userType === 'customer' ? (
                    // Customer Registration Fields
                    <>
                      {/* Basic Information */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <User className="w-5 h-5 mr-2" />
                          Basic Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="username" className="text-white">Username *</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) => handleInputChange('username', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="Enter your username"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Password *</Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="Create a strong password"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="first_name" className="text-white">First Name *</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="Enter your first name"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    // Service Provider Registration Fields
                    <>
{/* Business Information */}
<div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Building className="w-5 h-5 mr-2" />
                          Business Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="businessName" className="text-white">Business Name *</Label>
                            <Input
                              id="businessName"
                              value={formData.businessName}
                              onChange={(e) => handleInputChange('businessName', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="Your Business Name"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contactPersonName" className="text-white">Contact Person Name *</Label>
                            <Input
                              id="contactPersonName"
                              value={formData.contactPersonName}
                              onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="Primary contact name"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="business@example.com"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Password *</Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="Create a strong password"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-white">Phone Number *</Label>
                            <Input
                              id="phoneNumber"
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="+1 (555) 123-4567"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="timeZone" className="text-white">Time Zone *</Label>
                            <Select onValueChange={(value) => handleInputChange('timeZone', value)}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select your time zone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                                <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
                                <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
                                <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="physicalAddress" className="text-white">Physical Address *</Label>
                          <Textarea
                            id="physicalAddress"
                            value={formData.physicalAddress}
                            onChange={(e) => handleInputChange('physicalAddress', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            placeholder="Street, City, State, ZIP"
                            rows={3}
                            required
                          />
                        </div>
                      </div>

                      {/* Business Hours & Services */}
                      <div className="space-y-6 border-t border-white/10 pt-8">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Clock className="w-5 h-5 mr-2" />
                          Business Hours & Services
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="workingHours" className="text-white">Working Hours *</Label>
                          <Input
                            id="workingHours"
                            value={formData.workingHours}
                            onChange={(e) => handleInputChange('workingHours', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            placeholder="e.g. Mon-Fri 9AM-6PM, Sat 10AM-4PM"
                            required
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-white">Services Offered *</Label>
                            <Button
                              type="button"
                              onClick={addService}
                              className="bg-white/10 text-white hover:bg-white/20"
                            >
                              Add Service
                            </Button>
                          </div>

                          {formData.servicesOffered.map((service, index) => (
                            <Card key={index} className="bg-white/5 border-white/10">
                              <CardContent className="p-4">
                                <div className="grid md:grid-cols-4 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-white text-sm">Service Name</Label>
                                    <Input
                                      value={service.name}
                                      onChange={(e) => updateService(index, 'name', e.target.value)}
                                      className="bg-white/10 border-white/20 text-white"
                                      placeholder="Haircut"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-white text-sm">Duration (mins)</Label>
                                    <Input
                                      value={service.duration}
                                      onChange={(e) => updateService(index, 'duration', e.target.value)}
                                      className="bg-white/10 border-white/20 text-white"
                                      placeholder="30"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-white text-sm">Price ($)</Label>
                                    <Input
                                      value={service.price}
                                      onChange={(e) => updateService(index, 'price', e.target.value)}
                                      className="bg-white/10 border-white/20 text-white"
                                      placeholder="50"
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <Button
                                      type="button"
                                      onClick={() => removeService(index)}
                                      variant="outline"
                                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 w-full"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="bufferTime" className="text-white">Buffer Time (minutes) *</Label>
                            <Input
                              id="bufferTime"
                              type="number"
                              value={formData.bufferTime}
                              onChange={(e) => handleInputChange('bufferTime', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="15"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="minimumNoticeTime" className="text-white">Minimum Notice Time *</Label>
                            <Input
                              id="minimumNoticeTime"
                              value={formData.minimumNoticeTime}
                              onChange={(e) => handleInputChange('minimumNoticeTime', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="e.g. 2 hours, 1 day"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Optional Information */}
                      <div className="space-y-6 border-t border-white/10 pt-8">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Upload className="w-5 h-5 mr-2" />
                          Optional Information
                        </h3>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="businessLicense" className="text-white">Business License/ID Upload</Label>
                            <div className="border border-white/20 border-dashed rounded-lg p-6 text-center bg-white/5">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-gray-400 mb-2">Upload business license or ID</p>
                              <Input
                                id="businessLicense"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload('businessLicense', e.target.files?.[0] || null)}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => document.getElementById('businessLicense')?.click()}
                              >
                                Choose File
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-white">Notification Preferences</Label>
                            <div className="grid grid-cols-3 gap-4">
                              {['SMS', 'Email', 'In-App'].map((channel) => (
                                <div key={channel} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`provider-${channel}`}
                                    checked={formData.notificationChannels.includes(channel)}
                                    onCheckedChange={(checked) => handleNotificationChange(channel, checked as boolean)}
                                    className="border-white/20"
                                  />
                                  <Label htmlFor={`provider-${channel}`} className="text-white text-sm">{channel}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="paymentDetails" className="text-white">Payment Details</Label>
                            <Input
                              id="paymentDetails"
                              value={formData.paymentDetails}
                              onChange={(e) => handleInputChange('paymentDetails', e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                              placeholder="Stripe account ID or payment method"
                            />
                          </div>
                        </div>
                      </div>
                      </>
                  )}

                  {/* Submit Button */}
                  <div className="border-t border-white/10 pt-8">
                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-gray-100 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Create Account
                    </Button>

                    <p className="text-center text-gray-400 mt-4">
                      Already have an account?{' '}
                      <a href="/login" className="text-white hover:underline">
                        Sign in here
                      </a>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
