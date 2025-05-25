import React, { useState } from 'react';
import { 
  Bell, 
  User,
  Plus,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  Package,
  Grid,
  List,
  MoreVertical,
  Star,
  TrendingUp,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

type Service = {
  id: number;
  name: string;
  description: string;
  duration: number;
  durationUnit: 'minutes' | 'hours';
  price: number;
  category: string;
  status: 'active' | 'inactive';
  bookings: number;
  revenue: number;
  rating: number;
};

type ServiceFormData = {
  name: string;
  description: string;
  duration: number;
  durationUnit: 'minutes' | 'hours';
  price: number;
  category: string;
  status: 'active' | 'inactive';
};

const ManageServices = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'Dental Checkup',
      description: 'Comprehensive dental examination and cleaning',
      duration: 60,
      durationUnit: 'minutes',
      price: 150,
      category: 'Examination',
      status: 'active',
      bookings: 45,
      revenue: 6750,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Teeth Cleaning',
      description: 'Professional dental cleaning and polishing',
      duration: 45,
      durationUnit: 'minutes',
      price: 100,
      category: 'Cleaning',
      status: 'active',
      bookings: 62,
      revenue: 6200,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Root Canal Treatment',
      description: 'Complete root canal therapy',
      duration: 2,
      durationUnit: 'hours',
      price: 800,
      category: 'Treatment',
      status: 'active',
      bookings: 12,
      revenue: 9600,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Teeth Whitening',
      description: 'Professional teeth whitening service',
      duration: 90,
      durationUnit: 'minutes',
      price: 300,
      category: 'Cosmetic',
      status: 'inactive',
      bookings: 28,
      revenue: 8400,
      rating: 4.6
    },
    {
      id: 5,
      name: 'Dental Filling',
      description: 'Composite or amalgam dental fillings',
      duration: 45,
      durationUnit: 'minutes',
      price: 200,
      category: 'Treatment',
      status: 'active',
      bookings: 35,
      revenue: 7000,
      rating: 4.8
    }
  ]);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: 30,
    durationUnit: 'minutes',
    price: 0,
    category: 'Examination',
    status: 'active'
  });

  const categories = ['Examination', 'Cleaning', 'Treatment', 'Cosmetic', 'Surgery', 'Emergency'];
  
  const serviceTemplates = [
    { name: 'Basic Dental Package', services: ['Dental Checkup', 'Teeth Cleaning'], price: 220 },
    { name: 'Cosmetic Package', services: ['Teeth Whitening', 'Dental Checkup'], price: 420 },
    { name: 'Complete Care Package', services: ['Dental Checkup', 'Teeth Cleaning', 'Dental Filling'], price: 400 }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    inactive: services.filter(s => s.status === 'inactive').length,
    totalRevenue: services.reduce((sum, s) => sum + s.revenue, 0)
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...serviceForm, bookings: service.bookings, revenue: service.revenue, rating: service.rating }
          : service
      ));
    } else {
      const newService: Service = {
        id: Date.now(),
        ...serviceForm,
        bookings: 0,
        revenue: 0,
        rating: 0
      };
      setServices([...services, newService]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setServiceForm({
      name: '',
      description: '',
      duration: 30,
      durationUnit: 'minutes',
      price: 0,
      category: 'Examination',
      status: 'active'
    });
    setEditingService(null);
    setShowServiceModal(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      duration: service.duration,
      durationUnit: service.durationUnit,
      price: service.price,
      category: service.category,
      status: service.status
    });
    setShowServiceModal(true);
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(service => service.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (action === 'delete') {
      setServices(services.filter(service => !selectedServices.includes(service.id)));
    } else {
      const newStatus = action === 'activate' ? 'active' : 'inactive';
      setServices(services.map(service => 
        selectedServices.includes(service.id) 
          ? { ...service, status: newStatus }
          : service
      ));
    }
    setSelectedServices([]);
  };

  const toggleServiceStatus = (id: number) => {
    setServices(services.map(service => 
      service.id === id 
        ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
        : service
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.03) 50%, transparent 51%)
          `,
          backgroundSize: '100px 100px, 100px 100px, 50px 50px'
        }} />
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SchedSense AI
              </div>
              <div className="text-gray-300 font-medium hidden md:block">
                <span className="text-white font-semibold">Manage Services</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="relative p-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black">
                    3
                  </div>
                </button>
              </div>

              <div className="relative">
                <button
                  className="flex items-center space-x-2 p-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl backdrop-blur-sm transition-all duration-300"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 flex items-center space-x-2 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Services', value: stats.total, icon: Package, trend: '+5' },
              { title: 'Active Services', value: stats.active, icon: Eye, trend: '+3' },
              { title: 'Inactive Services', value: stats.inactive, icon: EyeOff, trend: '-2' },
              { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12%' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 cursor-pointer hover:scale-105 hover:border-white/20"
                  style={{
                    animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400">
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{stat.title}</p>
                </div>
              );
            })}
          </div>

          {/* Controls Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex bg-white/10 rounded-lg p-1 border border-white/20">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Add Service Button */}
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedServices.length > 0 && (
              <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-white">{selectedServices.length} service(s) selected</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleBulkAction('deactivate')}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Services Grid/List */}
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service, index) => (
                    <div
                      key={service.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105 hover:border-white/20 backdrop-blur-xl"
                      style={{
                        animation: `slideUp 0.4s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices([...selectedServices, service.id]);
                              } else {
                                setSelectedServices(selectedServices.filter(id => id !== service.id));
                              }
                            }}
                            className="rounded border-white/20 bg-white/10 text-white"
                          />
                          <div className={`w-3 h-3 rounded-full ${service.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleServiceStatus(service.id)}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            {service.status === 'active' ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                          </button>
                          <div className="relative">
                            <button className="p-1 hover:bg-white/20 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{service.description}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{service.duration} {service.durationUnit}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-semibold">${service.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded border border-white/20">
                          {service.category}
                        </div>
                        {service.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-300">{service.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-400">Bookings</span>
                          <p className="text-white font-semibold">{service.bookings}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Revenue</span>
                          <p className="text-white font-semibold">${service.revenue.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(service.id)}
                          className="px-3 py-2 bg-red-600/20 border border-red-600/40 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="text-left p-4 text-gray-300 font-medium">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedServices(filteredServices.map(s => s.id));
                                } else {
                                  setSelectedServices([]);
                                }
                              }}
                              className="rounded border-white/20 bg-white/10"
                            />
                          </th>
                          <th className="text-left p-4 text-gray-300 font-medium">Service Name</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Duration</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Price</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Category</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Bookings</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredServices.map((service) => (
                          <tr key={service.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedServices.includes(service.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedServices([...selectedServices, service.id]);
                                  } else {
                                    setSelectedServices(selectedServices.filter(id => id !== service.id));
                                  }
                                }}
                                className="rounded border-white/20 bg-white/10"
                              />
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="text-white font-medium">{service.name}</p>
                                <p className="text-sm text-gray-400 truncate max-w-xs">{service.description}</p>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300">{service.duration} {service.durationUnit}</td>
                            <td className="p-4 text-white font-semibold">${service.price}</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded border border-white/20">
                                {service.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${service.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                <span className={`text-sm ${service.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                                  {service.status}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300">{service.bookings}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEdit(service)}
                                  className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(service.id)}
                                  className="p-1 hover:bg-red-600/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleServiceStatus(service.id)}
                                  className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white transition-colors"
                                >
                                  {service.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Service Templates Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <Package className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-semibold text-white">Service Templates</h3>
                </div>
                
                <div className="space-y-4">
                  {serviceTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    >
                      <h4 className="font-semibold text-white mb-2">{template.name}</h4>
                      <div className="space-y-1 mb-3">
                        {template.services.map((serviceName, i) => (
                          <div key={i} className="text-sm text-gray-300 flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            <span>{serviceName}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">${template.price}</span>
                        <button className="px-3 py-1 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                          Import
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-semibold text-white">Performance</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Most Popular</span>
                      <span className="text-white font-semibold text-sm">Teeth Cleaning</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: '78%', animation: 'fillBar 1.5s ease-out 0.5s both' }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Highest Revenue</span>
                      <span className="text-white font-semibold text-sm">Root Canal</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: '92%', animation: 'fillBar 1.5s ease-out 0.7s both' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Best Rated</span>
                      <span className="text-white font-semibold text-sm">Teeth Cleaning</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: '98%', animation: 'fillBar 1.5s ease-out 0.9s both' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Modal */}
        {showServiceModal && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => resetForm()}
          >
            <div
              className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'modalSlide 0.3s ease-out' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button 
                  onClick={() => resetForm()}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="Enter service name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors resize-none"
                      placeholder="Describe your service"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        required
                        min="1"
                        value={serviceForm.duration}
                        onChange={(e) => setServiceForm({...serviceForm, duration: parseInt(e.target.value)})}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                        placeholder="30"
                      />
                      <select
                        value={serviceForm.durationUnit}
                        onChange={(e) => setServiceForm({...serviceForm, durationUnit: e.target.value as 'minutes' | 'hours'})}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({...serviceForm, price: parseFloat(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-4 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={serviceForm.status === 'active'}
                          onChange={(e) => setServiceForm({...serviceForm, status: e.target.value as 'active' | 'inactive'})}
                          className="text-white"
                        />
                        <span className="text-gray-300">Active</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={serviceForm.status === 'inactive'}
                          onChange={(e) => setServiceForm({...serviceForm, status: e.target.value as 'active' | 'inactive'})}
                          className="text-white"
                        />
                        <span className="text-gray-300">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => resetForm()}
                    className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <div
              className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'modalSlide 0.3s ease-out' }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-600/20 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Service</h3>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this service? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fillBar {
          from {
            width: 0;
          }
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50px);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        input[type="checkbox"], input[type="radio"] {
          accent-color: white;
        }

        select option {
          background-color: #1a1a1a;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ManageServices;