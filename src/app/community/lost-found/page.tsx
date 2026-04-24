'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Search,
  AlertTriangle,
  SearchCheck,
  MapPin,
  Calendar,
  MessageCircle,
  Phone,
  CheckCircle2,
  ImagePlus,
  ChevronDown,
  Shield,
  Eye,
  Info,
  FileText,
} from 'lucide-react';

const lostFoundItems = [
  { id: 'lf1', type: 'lost', title: 'Lost: iPhone 15 Pro - Black', description: 'Lost near Lekki Phase 1 roundabout on April 8. Black iPhone 15 Pro with clear case. Reward offered.', location: 'Lekki, Lagos', date: 'Apr 8, 2026', category: 'Electronics', contact: 'Message', replies: 5, resolved: false },
  { id: 'lf2', type: 'found', title: 'Found: Brown Wallet', description: 'Found a brown leather wallet at Freedom Park containing ID cards and some cash.', location: 'Lagos Island', date: 'Apr 7, 2026', category: 'Personal', contact: 'Message', replies: 3, resolved: true },
  { id: 'lf3', type: 'lost', title: 'Lost: Cat - Orange Tabby', description: 'Our orange tabby cat went missing from Victoria Island area. Very friendly, answers to \'Mango\'.', location: 'Victoria Island, Lagos', date: 'Apr 6, 2026', category: 'Pets', contact: 'Call', replies: 12, resolved: false },
  { id: 'lf4', type: 'found', title: 'Found: Car Keys (Toyota)', description: 'Found Toyota car keys with a small blue keychain near the Palms Shopping Mall.', location: 'Lekki, Lagos', date: 'Apr 5, 2026', category: 'Personal', contact: 'Message', replies: 1, resolved: false },
  { id: 'lf5', type: 'lost', title: 'Lost: Laptop Bag - Targus', description: 'Black Targus laptop bag left in an Uber on April 4. Contains work documents.', location: 'Ikoyi, Lagos', date: 'Apr 4, 2026', category: 'Personal', contact: 'Message', replies: 0, resolved: false },
  { id: 'lf6', type: 'found', title: 'Found: Gold Necklace', description: 'Found a gold chain necklace at the beach near Elegushi. Contact with description to claim.', location: 'Elegushi, Lagos', date: 'Apr 3, 2026', category: 'Personal', contact: 'Message', replies: 4, resolved: false },
  { id: 'lf7', type: 'lost', title: 'Lost: Drone - DJI Mini 3', description: 'Crashed/lost my DJI Mini 3 drone in the Yaba area. May be on a rooftop.', location: 'Yaba, Lagos', date: 'Apr 2, 2026', category: 'Electronics', contact: 'Message', replies: 2, resolved: false },
  { id: 'lf8', type: 'found', title: 'Found: School Bag with Books', description: 'Found a green school bag with textbooks near Murtala Muhammed Airport.', location: 'Ikeja, Lagos', date: 'Apr 1, 2026', category: 'Personal', contact: 'Message', replies: 6, resolved: true },
];

const safetyTips = [
  { icon: Shield, text: 'Always meet in a public place to verify and return items. Never share your home address.' },
  { icon: Eye, text: 'Ask the finder/owner for specific details about the item to verify authenticity before meeting.' },
  { icon: Info, text: 'Use PostAll messaging to communicate. Avoid sharing personal contact details until you\'re sure.' },
  { icon: AlertTriangle, text: 'Never send money upfront to claim a found item. Legitimate finders will not ask for payment.' },
];

const categoryOptions = ['Electronics', 'Personal', 'Pets', 'Documents', 'Vehicles', 'Clothing', 'Other'];

export default function LostFoundPage() {
  const [toggle, setToggle] = useState<'lost' | 'found'>('lost');
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');

  const filteredItems = lostFoundItems.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <div className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
              {toggle === 'lost' ? (
                <Search className="h-4 w-4" />
              ) : (
                <SearchCheck className="h-4 w-4" />
              )}
              {toggle === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Lost & Found</h1>
            <p className="text-rose-100 text-lg mb-6 max-w-md mx-auto">
              Report or find lost items in your community
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => { setToggle('lost'); setFormOpen(true); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  toggle === 'lost'
                    ? 'bg-white text-rose-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Search className="h-4 w-4" />
                I Lost Something
              </button>
              <button
                onClick={() => { setToggle('found'); setFormOpen(true); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  toggle === 'found'
                    ? 'bg-white text-emerald-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <SearchCheck className="h-4 w-4" />
                I Found Something
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Report Form */}
          <Collapsible open={formOpen} onOpenChange={setFormOpen}>
            <Card className="mb-6">
              <CollapsibleTrigger asChild>
                <button className="w-full text-left">
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        {toggle === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
                      </CardTitle>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${formOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <CardDescription>
                      {toggle === 'lost'
                        ? 'Describe the item you lost to help the community find it'
                        : 'Describe the item you found to help return it'}
                    </CardDescription>
                  </CardHeader>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title">Item Description</Label>
                      <Input id="title" placeholder="e.g., Black iPhone 15 Pro with clear case" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        {categoryOptions.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location {toggle === 'lost' ? 'Lost' : 'Found'}</Label>
                      <Input id="location" placeholder="e.g., Lekki Phase 1, Lagos" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date {toggle === 'lost' ? 'Lost' : 'Found'}</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Preference</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <option value="message">Message</option>
                        <option value="call">Phone Call</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="details">Additional Details</Label>
                      <Textarea id="details" placeholder="Provide more details about the item..." rows={3} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Photo (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                        <ImagePlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload a photo</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button className="gap-2">
                      {toggle === 'lost' ? (
                        <Search className="h-4 w-4" />
                      ) : (
                        <SearchCheck className="h-4 w-4" />
                      )}
                      Submit Report
                    </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(['all', 'lost', 'found'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                className="capitalize gap-1.5"
                onClick={() => setFilter(f)}
              >
                {f === 'all' && <Search className="h-3.5 w-3.5" />}
                {f === 'lost' && <AlertTriangle className="h-3.5 w-3.5" />}
                {f === 'found' && <SearchCheck className="h-3.5 w-3.5" />}
                {f === 'all' ? 'All Items' : f === 'lost' ? 'Lost Items' : 'Found Items'}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {f === 'all'
                    ? lostFoundItems.length
                    : lostFoundItems.filter((i) => i.type === f).length}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden group hover:shadow-lg transition-shadow ${
                  item.resolved ? 'opacity-70' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      className={`${
                        item.type === 'lost'
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {item.type === 'lost' ? (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Lost
                        </>
                      ) : (
                        <>
                          <SearchCheck className="h-3 w-3 mr-1" />
                          Found
                        </>
                      )}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      {item.resolved && (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {item.date}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageCircle className="h-3 w-3" />
                        {item.replies}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                      {item.contact === 'Call' ? (
                        <Phone className="h-3 w-3" />
                      ) : (
                        <MessageCircle className="h-3 w-3" />
                      )}
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Safety Tips */}
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-600" />
                Safety Tips
              </CardTitle>
              <CardDescription>Stay safe when reporting or claiming lost & found items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {safetyTips.map((tip, i) => {
                  const Icon = tip.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-amber-600" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
