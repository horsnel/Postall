'use client';

import Link from "next/link";

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { cities } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import MagicLinkModal from '@/components/layout/magic-link-modal';
import {
  ChevronLeft,
  AlertCircle,
  BookOpen,
  Building2,
  CheckCircle2,
  Compass,
  Eye,
  Landmark,
  Loader2,
  Map,
  MapPin,
  Navigation,
  Plus,
  Search,
  Shield,
  ShoppingCart,
  UtensilsCrossed
} from 'lucide-react';


const typeConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  police_station: {
    label: 'Police Station',
    icon: Shield,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  mall: {
    label: 'Shopping Mall',
    icon: Building2,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  bank: {
    label: 'Bank',
    icon: Landmark,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  restaurant: {
    label: 'Restaurant',
    icon: UtensilsCrossed,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  library: {
    label: 'Library',
    icon: BookOpen,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
};

const typeOptions = Object.entries(typeConfig).map(([value, config]) => ({
  value,
  label: config.label,
}));

// Sample safe spots for fallback
const sampleSafeSpots = [
  {
    id: 's1',
    name: 'Lagos State Police Headquarters',
    type: 'police_station',
    address: 'Ikeja GRA, Lagos',
    city: 'Lagos',
    latitude: 6.5955,
    longitude: 3.342,
    isApproved: true,
  },
  {
    id: 's2',
    name: 'Shoprite Ikeja City Mall',
    type: 'mall',
    address: '1, Alausa Rd, Ikeja, Lagos',
    city: 'Lagos',
    latitude: 6.5942,
    longitude: 3.3419,
    isApproved: true,
  },
  {
    id: 's3',
    name: 'Access Bank Headquarters',
    type: 'bank',
    address: '835 Marina Rd, Lagos',
    city: 'Lagos',
    latitude: 6.4531,
    longitude: 3.3953,
    isApproved: true,
  },
  {
    id: 's4',
    name: 'Lagos Central Police Station',
    type: 'police_station',
    address: 'Marina, Lagos',
    city: 'Lagos',
    latitude: 6.4531,
    longitude: 3.3953,
    isApproved: true,
  },
  {
    id: 's5',
    name: 'Ikeja City Mall',
    type: 'mall',
    address: 'Toyin Roundabout, Ikeja',
    city: 'Lagos',
    latitude: 6.5942,
    longitude: 3.3419,
    isApproved: true,
  },
  {
    id: 's6',
    name: 'Abuja Central Police Station',
    type: 'police_station',
    address: 'Area 11, Abuja',
    city: 'Abuja',
    latitude: 9.0579,
    longitude: 7.4951,
    isApproved: true,
  },
  {
    id: 's7',
    name: 'Jabi Lake Mall',
    type: 'mall',
    address: 'Aminu Kano Crescent, Wuse 2, Abuja',
    city: 'Abuja',
    latitude: 9.0256,
    longitude: 7.4796,
    isApproved: true,
  },
  {
    id: 's8',
    name: 'Genesis Deluxe Cinema',
    type: 'restaurant',
    address: 'GRA Phase 2, Port Harcourt',
    city: 'Port Harcourt',
    latitude: 4.7731,
    longitude: 7.0124,
    isApproved: true,
  },
  {
    id: 's9',
    name: 'Port Harcourt City Mall Library',
    type: 'library',
    address: 'Garrison, Port Harcourt',
    city: 'Port Harcourt',
    latitude: 4.8156,
    longitude: 7.0235,
    isApproved: true,
  },
];

interface SafeSpot {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  isApproved: boolean;
}

export default function SafeSpotsPage() {
  const { user } = useAuthStore();
  const [safeSpots, setSafeSpots] = useState<SafeSpot[]>(sampleSafeSpots);
  const [filteredSpots, setFilteredSpots] = useState<SafeSpot[]>(sampleSafeSpots);
  const [selectedCity, setSelectedCity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [totalSpots, setTotalSpots] = useState(sampleSafeSpots.length);
  const [citiesCovered, setCitiesCovered] = useState(4);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [suggestForm, setSuggestForm] = useState({
    name: '',
    type: '',
    address: '',
    city: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function fetchSafeSpots() {
      try {
        const res = await fetch(
          `/api/safe-spots${selectedCity !== 'all' ? `?city=${selectedCity}` : ''}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.safeSpots && data.safeSpots.length > 0) {
            setSafeSpots(data.safeSpots);
            setFilteredSpots(data.safeSpots);
            setTotalSpots(data.total);
            setCitiesCovered(data.citiesCovered);
          } else {
            setFilteredSpots(
              selectedCity === 'all'
                ? sampleSafeSpots
                : sampleSafeSpots.filter((s) => s.city === selectedCity)
            );
          }
        }
      } catch {
        setFilteredSpots(
          selectedCity === 'all'
            ? sampleSafeSpots
            : sampleSafeSpots.filter((s) => s.city === selectedCity)
        );
      } finally {
        setLoading(false);
      }
    }
    fetchSafeSpots();
  }, [selectedCity]);

  const handleCityChange = useCallback((value: string) => {
    setSelectedCity(value);
    setLoading(true);
  }, []);

  const handleSuggestClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowSuggestModal(true);
  };

  const handleSuggestSubmit = async () => {
    if (!suggestForm.name || !suggestForm.type || !suggestForm.address || !suggestForm.city) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/safe-spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...suggestForm,
          submittedById: user?.id,
        }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowSuggestModal(false);
          setSuggestForm({ name: '', type: '', address: '', city: '', notes: '' });
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch {
      // Error handled silently
    } finally {
      setSubmitting(false);
    }
  };

  const citySpotCounts = sampleSafeSpots.reduce<Record<string, number>>((acc, spot) => {
    acc[spot.city] = (acc[spot.city] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-[60vh]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Safety Tool
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Safe Spots
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto mb-8">
              Find verified safe meeting locations in your city. Every spot is community-reviewed
              and approved for secure transactions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleSuggestClick}
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Suggest a Safe Spot
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10"
              >
                <Map className="h-4 w-4 mr-2" />
                View Map
              </Button>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/browse#tools" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm">
              <ChevronLeft className="h-4 w-4" />Back to All Tools
            </Link>
          </div>
        </div>

      {/* Stats Bar */}
      <section className="bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: MapPin, label: 'Safe Spots', value: totalSpots },
              { icon: Compass, label: 'Cities Covered', value: citiesCovered },
              { icon: Eye, label: 'Community Verified', value: '100%' },
              { icon: Shield, label: 'Safety Rating', value: '4.9/5' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100">
                  <stat.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-900">{stat.value}</p>
                  <p className="text-xs text-emerald-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Find Safe Spots</h2>
            <p className="text-gray-500 text-sm mt-1">
              Browse verified safe meeting locations near you
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger className="w-full sm:w-48">
                <MapPin className="h-4 w-4 text-emerald-500 mr-2" />
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}, {city.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSuggestClick}
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Suggest
            </Button>
          </div>
        </div>

        {/* Type Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {typeOptions.map((type) => {
            const config = typeConfig[type.value];
            return (
              <button
                key={type.value}
                onClick={() => {
                  const filtered = safeSpots.filter((s) => s.type === type.value);
                  setFilteredSpots(filtered.length > 0 ? filtered : []);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 hover:border-gray-300 transition-colors bg-white"
              >
                <config.icon className={`h-3.5 w-3.5 ${config.color}`} />
                {config.label}
              </button>
            );
          })}
          <button
            onClick={() => setFilteredSpots(safeSpots)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            Show All
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSpots.length === 0 ? (
          /* No spots state */
          <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Safe Spots Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                There are no verified safe spots for {selectedCity === 'all' ? 'this filter' : selectedCity} yet.
                Be the first to suggest a safe meeting location!
              </p>
              <Button
                onClick={handleSuggestClick}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Suggest a Safe Spot
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Safe Spots Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {filteredSpots.map((spot) => {
                const config = typeConfig[spot.type] || typeConfig.police_station;
                const Icon = config.icon;
                return (
                  <Card
                    key={spot.id}
                    className={`border-2 ${config.borderColor} hover:shadow-md transition-all duration-200 group cursor-pointer`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`p-2.5 rounded-lg ${config.bgColor} group-hover:scale-110 transition-transform`}
                        >
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <Badge variant="secondary" className={config.bgColor}>
                          {config.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {spot.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">{spot.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Navigation className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{spot.city}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                        {citySpotCounts[spot.city] && (
                          <span className="text-xs text-gray-400">
                            {citySpotCounts[spot.city]} spot{citySpotCounts[spot.city] > 1 ? 's' : ''} in city
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[280px]">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Map className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Interactive Map
                </h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  An interactive map showing all safe spots with directions and distance
                  from your current location is coming soon.
                </p>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  Coming Soon
                </Badge>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* How It Works */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How Safe Spots Work
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our community-driven approach ensures every location is safe and suitable for meetups.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Community Suggests',
                desc: 'Users like you suggest safe meeting locations in their city.',
                color: 'bg-emerald-100 text-emerald-700',
              },
              {
                step: '2',
                title: 'Team Verifies',
                desc: 'Our safety team visits and verifies each suggested location.',
                color: 'bg-teal-100 text-teal-700',
              },
              {
                step: '3',
                title: 'Community Reviews',
                desc: 'Verified spots receive ongoing community ratings and feedback.',
                color: 'bg-cyan-100 text-cyan-700',
              },
              {
                step: '4',
                title: 'Safe Meetups',
                desc: 'Use verified spots for secure in-person transactions and meetings.',
                color: 'bg-amber-100 text-amber-700',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center font-bold text-sm`}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest Safe Spot Modal */}
      <Dialog open={showSuggestModal} onOpenChange={setShowSuggestModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-600" />
              Suggest a Safe Spot
            </DialogTitle>
            <DialogDescription>
              Help your community by suggesting a verified safe meeting location.
              Our team will review and verify it before listing.
            </DialogDescription>
          </DialogHeader>
          {submitSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-500">
                Your suggestion has been submitted. Our safety team will review it within 48 hours.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="spot-name">Location Name *</Label>
                <Input
                  id="spot-name"
                  placeholder="e.g., Ikeja City Mall"
                  value={suggestForm.name}
                  onChange={(e) =>
                    setSuggestForm({ ...suggestForm, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type *</Label>
                  <Select
                    value={suggestForm.type}
                    onValueChange={(val) =>
                      setSuggestForm({ ...suggestForm, type: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>City *</Label>
                  <Select
                    value={suggestForm.city}
                    onValueChange={(val) =>
                      setSuggestForm({ ...suggestForm, city: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="spot-address">Full Address *</Label>
                <Input
                  id="spot-address"
                  placeholder="e.g., 1, Alausa Rd, Ikeja, Lagos"
                  value={suggestForm.address}
                  onChange={(e) =>
                    setSuggestForm({ ...suggestForm, address: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="spot-notes">Additional Notes</Label>
                <Textarea
                  id="spot-notes"
                  placeholder="Why is this a good safe spot? (e.g., well-lit, security guards, CCTV)"
                  value={suggestForm.notes}
                  onChange={(e) =>
                    setSuggestForm({ ...suggestForm, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSuggestModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSuggestSubmit}
                  disabled={
                    submitting ||
                    !suggestForm.name ||
                    !suggestForm.type ||
                    !suggestForm.address ||
                    !suggestForm.city
                  }
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Suggestion'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <MagicLinkModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
