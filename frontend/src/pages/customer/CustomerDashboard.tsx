import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  Calendar, 
  Clock, 
  Heart,
  Phone,
  Share2,
  ChevronDown, 
  ChevronRight,
  Mic,
  X,
  Grid,
  List,
  Map,
  MessageSquare,
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Enhanced service provider type with more details
type ServiceProvider = {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance: string;
  imageUrl: string;
  openNow: boolean;
  services: {
    name: string;
    duration: string;
    price: number;
  }[];
  availableTimes: string[];
};

const CustomerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'distance'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
  
  // Enhanced service providers data
  const serviceProviders: ServiceProvider[] = [
    { 
      id: 1, 
      name: 'Dental Care Plus', 
      category: 'Health', 
      description: 'Comprehensive dental services with state-of-the-art technology and experienced professionals.', 
      rating: 4.8,
      reviewCount: 156,
      address: '123 Main St, Downtown',
      distance: '1.2 miles away',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      openNow: true,
      services: [
        { name: 'Regular Checkup', duration: '30 mins', price: 100 },
        { name: 'Teeth Cleaning', duration: '45 mins', price: 150 },
        { name: 'Teeth Whitening', duration: '60 mins', price: 250 }
      ],
      availableTimes: ['10:00 AM', '1:30 PM', '4:00 PM']
    },
    { 
      id: 2, 
      name: 'Serene Day Spa', 
      category: 'Beauty', 
      description: 'Luxurious spa treatments and massage services for ultimate relaxation and rejuvenation.', 
      rating: 4.9,
      reviewCount: 203,
      address: '456 Elm St, Westside',
      distance: '0.8 miles away',
      imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
      openNow: true,
      services: [
        { name: 'Swedish Massage', duration: '60 mins', price: 120 },
        { name: 'Facial Treatment', duration: '45 mins', price: 95 },
        { name: 'Full Body Scrub', duration: '90 mins', price: 180 }
      ],
      availableTimes: ['9:00 AM', '11:30 AM', '3:00 PM', '5:30 PM']
    },
    { 
      id: 3, 
      name: 'Elite Fitness Center', 
      category: 'Fitness', 
      description: 'Premium gym facilities with personal trainers and specialized fitness programs.', 
      rating: 4.6,
      reviewCount: 128,
      address: '789 Oak St, Northside',
      distance: '2.1 miles away',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      openNow: false,
      services: [
        { name: 'Personal Training', duration: '60 mins', price: 80 },
        { name: 'Group Fitness Class', duration: '45 mins', price: 30 },
        { name: 'Nutritional Consultation', duration: '30 mins', price: 50 }
      ],
      availableTimes: ['8:00 AM', '10:30 AM', '5:00 PM', '7:30 PM']
    },
    { 
      id: 4, 
      name: 'Therapeutic Massage Center', 
      category: 'Health', 
      description: 'Specialized massage therapies for stress relief, pain management, and overall wellness.', 
      rating: 4.7,
      reviewCount: 92,
      address: '321 Pine St, Eastside',
      distance: '1.5 miles away',
      imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
      openNow: true,
      services: [
        { name: 'Deep Tissue Massage', duration: '60 mins', price: 110 },
        { name: 'Sports Massage', duration: '45 mins', price: 90 },
        { name: 'Hot Stone Therapy', duration: '90 mins', price: 150 }
      ],
      availableTimes: ['11:00 AM', '2:30 PM', '6:00 PM']
    },
    { 
      id: 5, 
      name: 'Hair & Style Studio', 
      category: 'Beauty', 
      description: 'Trendy hair salon offering cuts, colors, and styling by skilled hair artists.', 
      rating: 4.5,
      reviewCount: 176,
      address: '555 Maple Ave, Downtown',
      distance: '0.5 miles away',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      openNow: true,
      services: [
        { name: 'Haircut & Style', duration: '45 mins', price: 70 },
        { name: 'Hair Coloring', duration: '90 mins', price: 120 },
        { name: 'Blowout', duration: '30 mins', price: 50 }
      ],
      availableTimes: ['9:30 AM', '12:00 PM', '3:30 PM', '6:00 PM']
    },
    { 
      id: 6, 
      name: 'CrossFit Zone', 
      category: 'Fitness', 
      description: 'High-intensity functional training with expert coaches and supportive community.', 
      rating: 4.8,
      reviewCount: 142,
      address: '777 Market St, Westside',
      distance: '1.9 miles away',
      imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
      openNow: true,
      services: [
        { name: 'CrossFit Class', duration: '60 mins', price: 25 },
        { name: 'Strength Training', duration: '45 mins', price: 35 },
        { name: 'Intro to CrossFit', duration: '90 mins', price: 60 }
      ],
      availableTimes: ['6:00 AM', '8:30 AM', '5:00 PM', '7:00 PM']
    }
  ];

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         provider.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || provider.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort providers based on selected sort option
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      // Simple distance sorting (assumes distance is in format "X.X miles away")
      const distA = parseFloat(a.distance.split(' ')[0]);
      const distB = parseFloat(b.distance.split(' ')[0]);
      return distA - distB;
    }
  });

  // Handle view provider details
  const handleViewDetails = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const newViewed = prev.filter(id => id !== provider.id);
      return [provider.id, ...newViewed].slice(0, 3);
    });
  };

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
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
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <div className="px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all">
                Find Your Perfect Service Provider
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Browse & Book <br /> Services with Ease
              </h1>
              
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Discover the best service providers in your area and schedule appointments 
                with just a few clicks or using your voice.
              </p>
            </motion.div>

            {/* Enhanced Search */}
            <motion.div 
              className="relative max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for services, providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="relative">
                    <Button 
                      variant="outline"
                      className="border-white/20 bg-white/10 hover:bg-white/20 text-white py-4 px-6"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      Filter
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                    
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl z-20"
                      >
                        <div className="p-4">
                          <h3 className="font-medium text-white mb-3">Categories</h3>
                          <div className="space-y-2">
                            {['all', 'Health', 'Beauty', 'Fitness'].map(category => (
                              <label key={category} className="flex items-center space-x-2 text-sm cursor-pointer">
                                <input
                                  type="radio"
                                  name="category"
                                  checked={filterCategory === category}
                                  onChange={() => setFilterCategory(category)}
                                  className="text-white accent-white"
                                />
                                <span className="text-gray-300">
                                  {category === 'all' ? 'All Categories' : category}
                                </span>
                              </label>
                            ))}
                          </div>
                          
                          <h3 className="font-medium text-white mt-4 mb-3">Sort By</h3>
                          <div className="space-y-2">
                            {[
                              { value: 'rating', label: 'Top Rated' },
                              { value: 'distance', label: 'Distance' }
                            ].map(option => (
                              <label key={option.value} className="flex items-center space-x-2 text-sm cursor-pointer">
                                <input
                                  type="radio"
                                  name="sortBy"
                                  checked={sortBy === option.value}
                                  onChange={() => setSortBy(option.value as 'rating' | 'distance')}
                                  className="text-white accent-white"
                                />
                                <span className="text-gray-300">{option.label}</span>
                              </label>
                            ))}
                          </div>

                          <div className="pt-4">
                            <Button 
                              className="w-full bg-white text-black hover:bg-gray-200"
                              onClick={() => setShowFilters(false)}
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex bg-white/10 rounded-lg border border-white/20 p-1">
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
                </div>
              </div>
              
              {/* Category Quick Filters */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {['All', 'Health', 'Beauty', 'Fitness'].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className={`rounded-full px-4 border-white/20 transition-all ${
                      (category === 'All' && filterCategory === 'all') || category === filterCategory 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 text-white hover:bg-white/20'
                    }`}
                    onClick={() => setFilterCategory(category === 'All' ? 'all' : category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-gray-400">
                Found <span className="text-white font-medium">{sortedProviders.length}</span> providers
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance')}
                  className="bg-white/100 border border-white/20 rounded-lg text-black px-3 py-1"
                >
                  <option value="rating">Top Rated</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
            </div>

            {/* No Results */}
            {sortedProviders.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No providers found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && sortedProviders.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all overflow-hidden rounded-xl backdrop-blur-sm hover:border-white/20 hover:shadow-lg cursor-pointer">
                      <div className="relative h-48">
                        <img 
                          src={provider.imageUrl} 
                          alt={provider.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/60 to-transparent"></div>
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(provider.id);
                            }}
                            className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all"
                          >
                            <Heart 
                              className={`w-4 h-4 ${favorites.has(provider.id) ? 'text-red-400 fill-red-400' : 'text-white'}`}
                            />
                          </button>
                        </div>
                        <Badge 
                          className={`absolute top-3 left-3 ${
                            provider.openNow 
                              ? 'bg-green-600/80 hover:bg-green-600' 
                              : 'bg-gray-600/80 hover:bg-gray-600'
                          } text-white backdrop-blur-sm`}
                        >
                          {provider.openNow ? 'Open Now' : 'Closed'}
                        </Badge>
                      </div>
                      <div className="p-5" onClick={() => handleViewDetails(provider)}>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-white/20 hover:bg-white/30 text-white">
                            {provider.category}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-white font-medium">{provider.rating}</span>
                            <span className="text-gray-400 text-sm ml-1">({provider.reviewCount})</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{provider.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{provider.description}</p>
                        <div className="flex items-center text-gray-400 mb-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{provider.distance}</span>
                        </div>
                        <Button 
                          variant="outline"
                          className="w-full border-white/20 bg-white/5 hover:bg-white/20 text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && sortedProviders.length > 0 && (
              <div className="space-y-4">
                {sortedProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-xl backdrop-blur-sm hover:border-white/20 hover:shadow-lg cursor-pointer"
                      onClick={() => handleViewDetails(provider)}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-60 h-32 md:h-auto relative">
                          <img 
                            src={provider.imageUrl} 
                            alt={provider.name} 
                            className="w-full h-full object-cover md:rounded-l-xl"
                          />
                          <Badge 
                            className={`absolute top-3 left-3 ${
                              provider.openNow 
                                ? 'bg-green-600/80 hover:bg-green-600' 
                                : 'bg-gray-600/80 hover:bg-gray-600'
                            } text-white backdrop-blur-sm`}
                          >
                            {provider.openNow ? 'Open Now' : 'Closed'}
                          </Badge>
                        </div>
                        <div className="p-5 flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white">
                              {provider.category}
                            </Badge>
                            <div className="flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(provider.id);
                                }}
                                className="p-1 hover:bg-white/10 rounded-full transition-all"
                              >
                                <Heart 
                                  className={`w-4 h-4 ${favorites.has(provider.id) ? 'text-red-400 fill-red-400' : 'text-white'}`}
                                />
                              </button>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1">{provider.name}</h3>
                          <div className="flex items-center text-sm mb-2">
                            <div className="flex items-center mr-4">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                              <span className="text-white">{provider.rating}</span>
                              <span className="text-gray-400 ml-1">({provider.reviewCount})</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{provider.distance}</span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{provider.description}</p>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="border-white/20 bg-white/5 hover:bg-white/20 text-white"
                            >
                              View Details
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-white text-black hover:bg-gray-100"
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="mt-16">
                <h3 className="text-xl font-bold text-white mb-6">Recently Viewed</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentlyViewed.map((id) => {
                    const provider = serviceProviders.find(p => p.id === id);
                    if (!provider) return null;
                    
                    return (
                      <Card 
                        key={`recent-${id}`}
                        className="bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-xl overflow-hidden cursor-pointer flex"
                        onClick={() => handleViewDetails(provider)}
                      >
                        <div className="w-24 h-24">
                          <img 
                            src={provider.imageUrl} 
                            alt={provider.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-grow">
                          <h4 className="text-white font-medium line-clamp-1">{provider.name}</h4>
                          <div className="flex items-center text-xs text-gray-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{provider.distance}</span>
                          </div>
                          <div className="flex items-center text-xs mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-white">{provider.rating}</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={() => setSelectedProvider(null)}
        >
          <motion.div 
            className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 p-0 max-w-4xl w-full max-h-[90vh] overflow-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-64">
              <img 
                src={selectedProvider.imageUrl} 
                alt={selectedProvider.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
              
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="absolute bottom-4 left-6">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${
                    selectedProvider.openNow 
                      ? 'bg-green-600/80 hover:bg-green-600' 
                      : 'bg-gray-600/80 hover:bg-gray-600'
                    } text-white`}
                  >
                    {selectedProvider.openNow ? 'Open Now' : 'Closed'}
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    {selectedProvider.category}
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold text-white">{selectedProvider.name}</h2>
              </div>
            </div>
            
            <div className="p-6">
              {/* Rating and Reviews */}
              <div className="flex items-center mb-6">
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-white font-medium">{selectedProvider.rating}</span>
                </div>
                <span className="text-gray-400 ml-2">({selectedProvider.reviewCount} reviews)</span>
              </div>
              
              {/* Description */}
              <p className="text-gray-300 mb-8">{selectedProvider.description}</p>
              
              {/* Services */}
              <h3 className="text-xl font-bold text-white mb-3">Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {selectedProvider.services.map((service, index) => (
                  <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">{service.name}</h4>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-white font-medium">${service.price}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-3 bg-white text-black hover:bg-gray-200 w-full"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Book Now
                    </Button>
                  </Card>
                ))}
              </div>
              
              
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Animations */}
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

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .popup-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          z-index: 1000;
        }

        body.modal-open {
          overflow: hidden;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.8); /* Adjust opacity if needed */
          z-index: 999;
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;