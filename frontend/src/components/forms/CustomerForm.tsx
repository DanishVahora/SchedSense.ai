import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const CustomerForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    inApp: true,
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [serviceType, setServiceType] = useState('');

  const timeZones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'America/Anchorage',
    'Pacific/Honolulu',
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
  ];

  const serviceTypes = [
    'Hair & Beauty',
    'Healthcare',
    'Legal Services',
    'Consulting',
    'Fitness & Wellness',
    'Home Services',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    console.log({
      fullName,
      email,
      password,
      phone,
      timeZone,
      notifications,
      profilePhoto,
      defaultLanguage,
      serviceType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
      <div>
        <Label htmlFor="timeZone">Time Zone</Label>
        <Select
          id="timeZone"
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
        >
          <option value="" disabled>Select your time zone</option>
          {timeZones.map((zone) => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Notification Preferences</Label>
        <Checkbox
          checked={notifications.sms}
          onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })}
          label="SMS"
        />
        <Checkbox
          checked={notifications.email}
          onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
          label="Email"
        />
        <Checkbox
          checked={notifications.inApp}
          onChange={() => setNotifications({ ...notifications, inApp: !notifications.inApp })}
          label="In-App"
        />
      </div>
      <div>
        <Label htmlFor="profilePhoto">Profile Photo</Label>
        <Input
          id="profilePhoto"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setProfilePhoto(file);
          }}
        />
      </div>
      <div>
        <Label htmlFor="defaultLanguage">Default Language</Label>
        <Select
          id="defaultLanguage"
          value={defaultLanguage}
          onChange={(e) => setDefaultLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="serviceType">Service Type</Label>
        <Select
          id="serviceType"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          <option value="" disabled>Select your service type</option>
          {serviceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
};

export default CustomerForm;