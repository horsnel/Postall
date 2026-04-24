'use client';

import Link from "next/link";

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { cities } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MagicLinkModal from '@/components/layout/magic-link-modal';
import {
  ChevronLeft,
  Truck,
  Package,
  Shield,
  Clock,
  DollarSign,
  CheckCircle2,
  Zap,
  ArrowRight,
  MapPin,
  Weight,
  Ruler,
  AlertTriangle,
  Star,
  Camera,
  Info,
} from 'lucide-react';

interface ShippingQuote {
  courier: string;
  logo: string;
  price: number;
  currency: string;
  estimatedDays: [number, number];
  features: string[];
  rating: number;
}

const generateQuotes = (
  _origin: string,
  _destination: string,
  weight: number,
  _length: number,
  _width: number,
  _height: number
): ShippingQuote[] => {
  const baseFactor = weight * 1.2;
  return [
    {
      courier: 'GIG Logistics',
      logo: 'GIG',
      price: Math.round(baseFactor * 3.2),
      currency: 'NGN',
      estimatedDays: [1, 3],
      features: ['Real-time tracking', 'Door-to-door', 'Insurance available'],
      rating: 4.5,
    },
    {
      courier: 'MAX Delivery',
      logo: 'MAX',
      price: Math.round(baseFactor * 2.8),
      currency: 'NGN',
      estimatedDays: [1, 2],
      features: ['Same-day delivery', 'Motorcycle couriers', 'Cash on delivery'],
      rating: 4.3,
    },
    {
      courier: 'DHL Express',
      logo: 'DHL',
      price: Math.round(baseFactor * 12.5),
      currency: 'NGN',
      estimatedDays: [2, 5],
      features: ['International', 'Express delivery', 'Full insurance', 'Customs handling'],
      rating: 4.7,
    },
    {
      courier: 'FedEx',
      logo: 'FDX',
      price: Math.round(baseFactor * 11.0),
      currency: 'NGN',
      estimatedDays: [3, 7],
      features: ['International', 'Tracking', 'Hold at location', 'FedEx Office drop-off'],
      rating: 4.6,
    },
    {
      courier: 'UPS',
      logo: 'UPS',
      price: Math.round(baseFactor * 10.5),
      currency: 'NGN',
      estimatedDays: [3, 7],
      features: ['International', 'Express Saver', 'Access Point', 'UPS My Choice'],
      rating: 4.5,
    },
  ];
};

const courierColors: Record<string, string> = {
  GIG: 'bg-emerald-100 text-emerald-700',
  MAX: 'bg-amber-100 text-amber-700',
  DHL: 'bg-yellow-100 text-yellow-700',
  FDX: 'bg-slate-100 text-slate-700',
  UPS: 'bg-rose-100 text-rose-700',
};

const courierBorders: Record<string, string> = {
  GIG: 'border-emerald-200 hover:border-emerald-400',
  MAX: 'border-amber-200 hover:border-amber-400',
  DHL: 'border-yellow-200 hover:border-yellow-400',
  FDX: 'border-purple-200 hover:border-purple-400',
  UPS: 'border-rose-200 hover:border-rose-400',
};

const safeShippingTips = [
  {
    icon: Shield,
    title: 'Use Escrow for Valuable Items',
    description: 'Always use PostAll escrow when shipping valuable items to protect both parties.',
  },
  {
    icon: Package,
    title: 'Pack Securely',
    description: 'Use bubble wrap, sturdy boxes, and proper cushioning. Take photos of the packed item before sealing.',
  },
  {
    icon: MapPin,
    title: 'Verify Delivery Address',
    description: 'Confirm the full delivery address with the recipient before shipping. Use a safe, traceable address.',
  },
  {
    icon: Star,
    title: 'Choose Tracked Shipping',
    description: 'Always select a shipping option with tracking. Share the tracking number with the buyer.',
  },
  {
    icon: Camera,
    title: 'Document Everything',
    description: 'Take photos of the item condition, packaging, and handover. Use Proof Cam for timestamped evidence.',
  },
  {
    icon: AlertTriangle,
    title: 'Insure High-Value Items',
    description: 'For items over ₦50,000, always purchase shipping insurance. It\'s a small cost for big protection.',
  },
];

export default function ShipHelperPage() {
  const { user } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  const handleGetQuotes = async () => {
    if (!origin || !destination || !weight) return;
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);
    setShowResults(false);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const w = parseFloat(weight) || 1;
    const l = parseFloat(length) || 10;
    const wi = parseFloat(width) || 10;
    const h = parseFloat(height) || 10;

    const results = generateQuotes(origin, destination, w, l, wi, h);
    setQuotes(results);
    setShowResults(true);
    setLoading(false);
  };

  const handleSelect = (courier: string) => {
    setSelectedQuote(courier);
  };

  const isValid = origin && destination && weight && origin !== destination;

  return (
    <div className="min-h-[60vh]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Shipping Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <Truck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ship Helper
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl">
            Compare shipping rates from top couriers across Africa and the world.
            Find the best price and delivery speed for your packages.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              <span>5+ Courier Partners</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              <span>African & International</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              <span>Real-time Rate Comparison</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              <span>Escrow Protected</span>
            </div>
          </div>
          <Link href="/browse#tools" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mt-6">
            <ChevronLeft className="h-4 w-4" />Back to All Tools
          </Link>
        </div>
      </div>

      {/* Shipping Quote Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5 text-emerald-600" />
              Get Shipping Quotes
            </CardTitle>
            <CardDescription>
              Enter your package details to compare rates from multiple couriers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  Origin City
                </Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger id="origin">
                    <SelectValue placeholder="Select origin city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  Destination City
                </Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger id="destination">
                    <SelectValue placeholder="Select destination city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-emerald-600" />
                Package Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g. 2.5"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Ruler className="h-4 w-4 text-emerald-600" />
                Dimensions (cm) — Optional
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="length" className="text-xs text-muted-foreground">Length</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="L"
                    min="1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="width" className="text-xs text-muted-foreground">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="W"
                    min="1"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="height" className="text-xs text-muted-foreground">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="H"
                    min="1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {origin && destination && origin === destination && (
              <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Origin and destination cannot be the same city.
              </div>
            )}

            <Button
              onClick={handleGetQuotes}
              disabled={!isValid || loading}
              className="w-full h-12 text-base"
              size="lg"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Comparing Rates...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Get Quotes
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Results Section */}
      {showResults && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Shipping Quotes
            </h2>
            <p className="text-gray-500">
              {origin} → {destination} &middot; {weight} kg
              {length && width && height && ` · ${length}×${width}×${height} cm`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {quotes.map((quote, index) => (
              <Card
                key={quote.courier}
                className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer border-2 ${courierBorders[quote.logo]} ${
                  selectedQuote === quote.courier ? 'ring-2 ring-emerald-500 shadow-lg scale-[1.02]' : ''
                }`}
                onClick={() => handleSelect(quote.courier)}
              >
                {/* Best Value Badge */}
                {index === 0 && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Best Value
                    </div>
                  </div>
                )}

                <CardContent className="p-5">
                  {/* Courier Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${courierColors[quote.logo]}`}>
                      {quote.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{quote.courier}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-500">{quote.rating}</span>
                      </div>
                    </div>

                  </div>

                  {/* Price & Time */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Price</p>
                      <p className="text-2xl font-bold text-emerald-700">
                        ₦
                        {quote.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Delivery Time</p>
                      <div className="flex items-center gap-1 text-gray-700 font-medium">
                        <Clock className="h-4 w-4" />
                        <span>{quote.estimatedDays[0]}-{quote.estimatedDays[1]} days</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {quote.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Select Button */}
                  <Button
                    className={`w-full ${
                      selectedQuote === quote.courier
                        ? 'bg-emerald-600 text-white'
                        : ''
                    }`}
                    variant={selectedQuote === quote.courier ? 'default' : 'outline'}
                  >
                    {selectedQuote === quote.courier ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Select {quote.courier}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedQuote && (
            <div className="mt-6 text-center">
              <Card className="inline-block border-emerald-200 bg-emerald-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">
                    You selected {selectedQuote}. In production, you&apos;d proceed to book and pay via escrow.
                  </span>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      )}

      {/* Safe Shipping Tips */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Safe Shipping Tips
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Follow these best practices to ensure your items arrive safely and securely
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {safeShippingTips.map((tip) => (
            <Card key={tip.title} className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg shrink-0">
                    <tip.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-500">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How Ship Helper Works */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How Ship Helper Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Enter Details', desc: 'Provide origin, destination, weight, and dimensions', icon: Package },
              { step: '2', title: 'Compare Rates', desc: 'See quotes from multiple couriers side by side', icon: DollarSign },
              { step: '3', title: 'Select Courier', desc: 'Choose the best option for your needs and budget', icon: CheckCircle2 },
              { step: '4', title: 'Ship Securely', desc: 'Pay via escrow, track your package, get protected delivery', icon: Shield },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <div className="p-2 bg-white rounded-lg inline-block mb-2">
                  <item.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Note */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 text-sm text-gray-500 justify-center">
          <Info className="h-4 w-4" />
          <span>Shipping quotes are estimates based on package details. Actual rates may vary at checkout.</span>
        </div>
      </section>

      <MagicLinkModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
