import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProviderForm = () => {
  const [providerData, setProviderData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    timeZone: '',
    workingHours: {
      start: '09:00',
      end: '17:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    services: [{ name: '', duration: 60, price: 0 }],
    bufferTime: 15,
    minNoticeTime: '24',
    businessLicense: null,
    notifications: {
      sms: true,
      email: true,
      inApp: true
    },
    paymentDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });

  const handleChange = (field: string, value: any) => {
    setProviderData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setProviderData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const addService = () => {
    setProviderData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', duration: 60, price: 0 }]
    }));
  };

  const updateService = (index: number, field: string, value: any) => {
    setProviderData(prev => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Provider Data:', providerData);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={providerData.businessName}
              onChange={e => handleChange('businessName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              value={providerData.contactName}
              onChange={e => handleChange('contactName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={providerData.email}
              onChange={e => handleChange('email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={providerData.password}
              onChange={e => handleChange('password', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={providerData.phone}
              onChange={e => handleChange('phone', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={providerData.address.street}
              onChange={e => handleAddressChange('street', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={providerData.address.city}
              onChange={e => handleAddressChange('city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={providerData.address.state}
              onChange={e => handleAddressChange('state', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={providerData.address.zip}
              onChange={e => handleAddressChange('zip', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="timeZone">Time Zone</Label>
            <Select
              id="timeZone"
              value={providerData.timeZone}
              onValueChange={value => handleChange('timeZone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your time zone" />
              </SelectTrigger>
              <SelectContent>
                {['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'].map(zone => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Working Hours</Label>
            <div>
              <Label htmlFor="workingHours.start">Start Time</Label>
              <Input
                id="workingHours.start"
                type="time"
                value={providerData.workingHours.start}
                onChange={e => handleChange('workingHours.start', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="workingHours.end">End Time</Label>
              <Input
                id="workingHours.end"
                type="time"
                value={providerData.workingHours.end}
                onChange={e => handleChange('workingHours.end', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Services Offered</Label>
            {providerData.services.map((service, index) => (
              <div key={index}>
                <Input
                  value={service.name}
                  onChange={e => updateService(index, 'name', e.target.value)}
                  placeholder="Service Name"
                />
                <Input
                  type="number"
                  value={service.price}
                  onChange={e => updateService(index, 'price', Number(e.target.value))}
                  placeholder="Price"
                />
                <Button onClick={() => updateService(index, 'duration', service.duration + 15)}>Increase Duration</Button>
              </div>
            ))}
            <Button onClick={addService}>Add Another Service</Button>
          </div>
          <div>
            <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
            <Input
              id="bufferTime"
              type="number"
              value={providerData.bufferTime}
              onChange={e => handleChange('bufferTime', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="minNoticeTime">Minimum Notice Time (hours)</Label>
            <Input
              id="minNoticeTime"
              type="number"
              value={providerData.minNoticeTime}
              onChange={e => handleChange('minNoticeTime', e.target.value)}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProviderForm;