"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Armchair,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Compass,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Phone,
  Plus,
  Route,
  ShieldCheck,
  Smartphone,
  Truck,
  Tv,
  User,
  Warehouse,
  Zap
} from 'lucide-react';


// ─── Types ────────────────────────────────────────────────────
interface TimelineStep {
  label: string;
  status: "completed" | "current" | "pending";
  time?: string;
}

interface ActiveDelivery {
  id: string;
  trackingId: string;
  itemName: string;
  itemIcon: string;
  status: "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "delayed";
  sender: { name: string; city: string };
  receiver: { name: string; city: string };
  courier: { company: string; phone: string; vehicle: string };
  estimatedDate: string;
  progress: number;
  timeline: TimelineStep[];
}

// ─── Sample Data ──────────────────────────────────────────────
const statusConfig: Record<string, { label: string; class: string; icon: typeof CheckCircle2 }> = {
  picked_up: { label: "Picked Up", class: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  in_transit: { label: "In Transit", class: "bg-amber-100 text-amber-700", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", class: "bg-cyan-100 text-cyan-700", icon: Package },
  delivered: { label: "Delivered", class: "bg-teal-100 text-teal-700", icon: CheckCircle2 },
  delayed: { label: "Delayed", class: "bg-rose-100 text-rose-700", icon: AlertTriangle },
};

const activeDeliveries: ActiveDelivery[] = [
  {
    id: "d1",
    trackingId: "PA-2024-DEL-001",
    itemName: "iPhone 14 Pro Max - 256GB",
    itemIcon: "smartphone",
    status: "in_transit",
    sender: { name: "Tunde Enterprises", city: "Lagos" },
    receiver: { name: "Amina K.", city: "Abuja" },
    courier: { company: "GIG Logistics", phone: "+234 801 234 5678", vehicle: "Motorcycle" },
    estimatedDate: "Dec 18, 2024 - 2:00 PM",
    progress: 60,
    timeline: [
      { label: "Order Placed", status: "completed", time: "Dec 15, 10:30 AM" },
      { label: "Picked Up", status: "completed", time: "Dec 15, 3:45 PM" },
      { label: "In Transit", status: "current", time: "Dec 16, 8:00 AM" },
      { label: "Delivered", status: "pending" },
    ],
  },
  {
    id: "d2",
    trackingId: "PA-2024-DEL-002",
    itemName: "Samsung 55\" Smart TV",
    itemIcon: "tv",
    status: "out_for_delivery",
    sender: { name: "TechDeals Store", city: "Lagos" },
    receiver: { name: "John Bello", city: "Lagos, Ikeja" },
    courier: { company: "GIG Logistics", phone: "+234 802 345 6789", vehicle: "Van" },
    estimatedDate: "Dec 16, 2024 - 4:00 PM",
    progress: 85,
    timeline: [
      { label: "Order Placed", status: "completed", time: "Dec 14, 11:00 AM" },
      { label: "Picked Up", status: "completed", time: "Dec 14, 5:00 PM" },
      { label: "In Transit", status: "completed", time: "Dec 15, 9:00 AM" },
      { label: "Out for Delivery", status: "current", time: "Dec 16, 1:30 PM" },
    ],
  },
  {
    id: "d3",
    trackingId: "PA-2024-DEL-003",
    itemName: "Living Room Sofa Set (3-Seater)",
    itemIcon: "furniture",
    status: "picked_up",
    sender: { name: "FurnitureHub", city: "Port Harcourt" },
    receiver: { name: "Grace Wanjiku", city: "Lagos, Lekki" },
    courier: { company: "GIG Logistics", phone: "+234 803 456 7890", vehicle: "Truck" },
    estimatedDate: "Dec 19, 2024 - 12:00 PM",
    progress: 25,
    timeline: [
      { label: "Order Placed", status: "completed", time: "Dec 16, 8:00 AM" },
      { label: "Picked Up", status: "current", time: "Dec 16, 2:00 PM" },
      { label: "In Transit", status: "pending" },
      { label: "Delivered", status: "pending" },
    ],
  },
];

const deliveryHistory = [
  { id: "h1", trackingId: "PA-2024-DEL-098", item: "MacBook Air M2", from: "Lagos", to: "Abuja", courier: "GIG Logistics", status: "delivered", date: "Dec 10, 2024", amount: "₦4,500" },
  { id: "h2", trackingId: "PA-2024-DEL-095", item: "Office Desk Chair", from: "Lagos", to: "Ibadan", courier: "GIG Logistics", status: "delivered", date: "Dec 7, 2024", amount: "₦2,500" },
  { id: "h3", trackingId: "PA-2024-DEL-090", item: "Dell Monitor 27\"", from: "Lagos", to: "Port Harcourt", courier: "GIG Logistics", status: "delivered", date: "Dec 3, 2024", amount: "₦3,800" },
  { id: "h4", trackingId: "PA-2024-DEL-085", item: "Wardrobe (6-Door)", from: "Abuja", to: "Lagos", courier: "GIG Logistics", status: "delivered", date: "Nov 28, 2024", amount: "₦8,000" },
  { id: "h5", trackingId: "PA-2024-DEL-080", item: "PlayStation 5 Bundle", from: "Lagos", to: "Kano", courier: "GIG Logistics", status: "delivered", date: "Nov 22, 2024", amount: "₦5,500" },
];

const itemIconMap: Record<string, typeof Smartphone> = {
  smartphone: Smartphone,
  tv: Tv,
  furniture: Armchair,
};

// ─── Components ───────────────────────────────────────────────
function TimelineVertical({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex gap-3 ml-1">
      {/* Vertical Line */}
      <div className="flex flex-col items-center">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                step.status === "completed"
                  ? "bg-emerald-500"
                  : step.status === "current"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-gray-300"
              }`}
            >
              {step.status === "completed" && (
                <CheckCircle2 className="h-4 w-4 text-white" />
              )}
              {step.status === "current" && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-0.5 flex-1 min-h-[28px] ${
                  step.status === "completed" ? "bg-emerald-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      {/* Labels */}
      <div className="flex flex-col justify-between py-0.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 min-h-[36px]">
            <div>
              <p
                className={`text-xs font-medium ${
                  step.status === "pending"
                    ? "text-muted-foreground"
                    : step.status === "current"
                    ? "text-amber-700"
                    : "text-emerald-700"
                }`}
              >
                {step.label}
              </p>
              {step.time && (
                <p className="text-[10px] text-muted-foreground">{step.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function DeliveryTrackingPage() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [packageWeight, setPackageWeight] = useState("");
  const [packageType, setPackageType] = useState("");
  const [deliverySpeed, setDeliverySpeed] = useState("");
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const speedOptions = [
    { value: "standard", label: "Standard", duration: "3-5 days", price: "₦2,000" },
    { value: "express", label: "Express", duration: "1-2 days", price: "₦4,500" },
    { value: "sameday", label: "Same Day", duration: "Today", price: "₦8,000" },
  ];

  const selectedSpeed = speedOptions.find((s) => s.value === deliverySpeed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery Tracking</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your packages and manage deliveries
          </p>
        </div>
        <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              Schedule New Delivery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                Schedule New Delivery
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              {/* Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    Pickup Address
                  </Label>
                  <Input
                    placeholder="Enter pickup address"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" />
                    Delivery Address
                  </Label>
                  <Input
                    placeholder="Enter delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Package Weight</Label>
                  <Select value={packageWeight} onValueChange={setPackageWeight}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under1">Under 1kg</SelectItem>
                      <SelectItem value="1to5">1-5kg</SelectItem>
                      <SelectItem value="5to10">5-10kg</SelectItem>
                      <SelectItem value="10to25">10-25kg</SelectItem>
                      <SelectItem value="over25">Over 25kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Package Type</Label>
                  <Select value={packageType} onValueChange={setPackageType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="small_box">Small Box</SelectItem>
                      <SelectItem value="medium_box">Medium Box</SelectItem>
                      <SelectItem value="large_box">Large Box</SelectItem>
                      <SelectItem value="fragile">Fragile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Delivery Speed */}
              <div className="space-y-2">
                <Label className="text-xs">Delivery Speed</Label>
                <div className="grid grid-cols-3 gap-2">
                  {speedOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDeliverySpeed(opt.value)}
                      className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all text-center ${
                        deliverySpeed === opt.value
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {opt.value === "standard" && <Clock className="h-4 w-4" />}
                      {opt.value === "express" && <Zap className="h-4 w-4" />}
                      {opt.value === "sameday" && <Truck className="h-4 w-4" />}
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className="text-[10px] text-muted-foreground">{opt.duration}</p>
                      <p className="text-xs font-bold">{opt.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Insurance Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Shipping Insurance</p>
                    <p className="text-xs text-muted-foreground">
                      Coverage up to ₦500,000 &bull; Additional ₦500
                    </p>
                  </div>
                </div>
                <Switch
                  checked={insuranceEnabled}
                  onCheckedChange={setInsuranceEnabled}
                />
              </div>

              {/* Summary */}
              {deliverySpeed && (
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-xs font-semibold">Delivery Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold">{selectedSpeed?.price}</span>
                  </div>
                  {insuranceEnabled && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Insurance</span>
                      <span className="font-semibold">₦500</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">
                      ₦{Number(selectedSpeed?.price.replace(/[₦,]/g, "") || 0) + (insuranceEnabled ? 500 : 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                className="w-full gap-2"
                size="lg"
                disabled={
                  !pickupAddress ||
                  !deliveryAddress ||
                  !packageWeight ||
                  !packageType ||
                  !deliverySpeed ||
                  isScheduling
                }
                onClick={() => {
                  setIsScheduling(true);
                  setTimeout(() => {
                    setIsScheduling(false);
                    setScheduleOpen(false);
                  }, 2000);
                }}
              >
                {isScheduling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scheduling Pickup...
                  </>
                ) : (
                  <>
                    <CalendarDays className="h-4 w-4" />
                    Schedule Pickup
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delivery Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Deliveries", value: "3", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "In Transit", value: "2", icon: Route, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Delivered This Month", value: "12", icon: CheckCircle2, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Avg Delivery Time", value: "2.3 days", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Deliveries */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-emerald-600" />
          Active Deliveries
          <Badge variant="secondary" className="text-xs">{activeDeliveries.length}</Badge>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeDeliveries.map((delivery) => {
            const cfg = statusConfig[delivery.status];
            const StatusIcon = cfg.icon;
            return (
              <Card key={delivery.id} className="flex flex-col">
                <CardContent className="p-5 flex flex-col flex-1 gap-4">
                  {/* Header: Item + Tracking ID + Status */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl shrink-0">
                          {(() => {
                            const ItemIcon = itemIconMap[delivery.itemIcon] || Package;
                            return <ItemIcon className="h-6 w-6 text-gray-500" />;
                          })()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{delivery.itemName}</p>
                          <code className="text-[10px] text-muted-foreground font-mono">{delivery.trackingId}</code>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] gap-1 shrink-0 ${cfg.class}`}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-emerald-600">{delivery.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          delivery.status === "delayed"
                            ? "bg-rose-500"
                            : "bg-gradient-to-r from-emerald-500 to-teal-400"
                        }`}
                        style={{ width: `${delivery.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <TimelineVertical steps={delivery.timeline} />

                  {/* Sender / Receiver */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Warehouse className="h-3 w-3 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground">From:</span>{" "}
                        <span className="font-medium">{delivery.sender.name}</span>
                        <span className="text-muted-foreground"> &bull; {delivery.sender.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <User className="h-3 w-3 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground">To:</span>{" "}
                        <span className="font-medium">{delivery.receiver.name}</span>
                        <span className="text-muted-foreground"> &bull; {delivery.receiver.city}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Courier Info */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{delivery.courier.company}</p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {delivery.courier.phone}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] bg-muted">
                      {delivery.courier.vehicle}
                    </Badge>
                  </div>

                  {/* Estimated Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Est. delivery: <span className="font-semibold text-foreground">{delivery.estimatedDate}</span></span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto pt-1">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs h-9">
                      <Navigation className="h-3.5 w-3.5" />
                      Track on Map
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs h-9">
                      <Phone className="h-3.5 w-3.5" />
                      Contact Courier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Delivery History */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Delivery History
          </CardTitle>
          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Tracking ID</TableHead>
                  <TableHead className="text-xs">Item</TableHead>
                  <TableHead className="text-xs">From</TableHead>
                  <TableHead className="text-xs">To</TableHead>
                  <TableHead className="text-xs">Courier</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveryHistory.map((d) => {
                  const stCfg = statusConfig[d.status];
                  const StIcon = stCfg.icon;
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="py-3">
                        <code className="text-xs font-mono text-muted-foreground">{d.trackingId}</code>
                      </TableCell>
                      <TableCell className="text-sm py-3 font-medium">{d.item}</TableCell>
                      <TableCell className="text-xs text-muted-foreground py-3">{d.from}</TableCell>
                      <TableCell className="text-xs text-muted-foreground py-3">{d.to}</TableCell>
                      <TableCell className="text-xs py-3">{d.courier}</TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className={`text-[10px] gap-1 ${stCfg.class}`}>
                          <StIcon className="h-3 w-3" />
                          {stCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground py-3">{d.date}</TableCell>
                      <TableCell className="text-right text-sm font-semibold py-3 text-emerald-600">
                        {d.amount}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
