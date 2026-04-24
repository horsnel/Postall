"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleListings } from "@/lib/constants";
import {
  Columns3,
  X,
  Plus,
  Share2,
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Truck,
  Package,
  Handshake,
  ImageIcon,
  Tag,
  UserCheck,
} from "lucide-react";

// Data for the 3 comparison items
const compareItems = [
  {
    ...sampleListings[0],
    sellerRating: 4.9,
    verified: true,
    deliveryOptions: ["Meetup", "Delivery", "Shipping"],
  },
  {
    ...sampleListings[1],
    sellerRating: 4.7,
    verified: true,
    deliveryOptions: ["Meetup", "Shipping"],
  },
  {
    ...sampleListings[2],
    sellerRating: 4.6,
    verified: false,
    deliveryOptions: ["Meetup", "Delivery"],
  },
];

const overviewFeatures = [
  { key: "price", label: "Price", render: (item: typeof compareItems[0]) => `₦${item.price.toLocaleString()}` },
  { key: "condition", label: "Condition", render: (item: typeof compareItems[0]) => item.condition },
  { key: "city", label: "City", render: (item: typeof compareItems[0]) => item.city },
  { key: "category", label: "Category", render: (item: typeof compareItems[0]) => item.category.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
  { key: "posted", label: "Posted", render: (item: typeof compareItems[0]) => item.postedAgo },
];

const detailsFeatures = [
  { key: "rating", label: "Seller Rating", render: (item: typeof compareItems[0]) => (
    <div className="flex items-center gap-1 justify-center">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      <span>{item.sellerRating}</span>
    </div>
  )},
  { key: "verified", label: "Verified", render: (item: typeof compareItems[0]) => item.verified ? (
    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
  ) : (
    <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
  )},
  { key: "delivery", label: "Delivery", render: (item: typeof compareItems[0]) => item.deliveryOptions.join(", ") },
];

export default function ComparePage() {
  const [items, setItems] = useState(compareItems);

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col">

      <div className="bg-gray-50/50 min-h-screen flex-1">
        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Columns3 className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Compare Items</h1>
                  <p className="text-sm text-muted-foreground">
                    Compare up to 3 items side by side
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Comparison
                </Button>
                <Link href="/browse/for-sale">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Compare More Items
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Columns3 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Items to Compare</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Add up to 3 items to compare them side by side. Browse listings and click the compare button to get started.
              </p>
              <Link href="/browse/for-sale">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Browse Items
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <Tabs defaultValue="overview" className="mb-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  {/* Comparison Table */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="text-left p-4 w-[180px] font-semibold text-sm text-muted-foreground">
                                Feature
                              </th>
                              {items.map((item) => (
                                <th key={item.id} className="p-4 min-w-[250px]">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-sm line-clamp-2 text-left">{item.title}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-rose-600"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {overviewFeatures.map((feature, i) => (
                              <tr key={feature.key} className={i < overviewFeatures.length - 1 ? "border-b" : ""}>
                                <td className="p-4 text-sm font-medium text-muted-foreground">{feature.label}</td>
                                {items.map((item) => (
                                  <td key={item.id} className="p-4 text-center text-sm font-medium">
                                    {feature.render(item)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            {/* View Buttons Row */}
                            <tr>
                              <td className="p-4 text-sm font-medium text-muted-foreground">Action</td>
                              {items.map((item) => (
                                <td key={item.id} className="p-4 text-center">
                                  <Link href={`/item/${item.id}`}>
                                    <Button size="sm" variant="outline" className="gap-1">
                                      <Eye className="h-3.5 w-3.5" />
                                      View
                                    </Button>
                                  </Link>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="text-left p-4 w-[180px] font-semibold text-sm text-muted-foreground">
                                Detail
                              </th>
                              {items.map((item) => (
                                <th key={item.id} className="p-4 min-w-[250px]">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-sm line-clamp-2 text-left">{item.title}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-rose-600"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {detailsFeatures.map((feature, i) => (
                              <tr key={feature.key} className={i < detailsFeatures.length - 1 ? "border-b" : ""}>
                                <td className="p-4 text-sm font-medium text-muted-foreground">{feature.label}</td>
                                {items.map((item) => (
                                  <td key={item.id} className="p-4 text-center text-sm">
                                    {feature.render(item)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            {/* View Buttons Row */}
                            <tr>
                              <td className="p-4 text-sm font-medium text-muted-foreground">Action</td>
                              {items.map((item) => (
                                <td key={item.id} className="p-4 text-center">
                                  <Link href={`/item/${item.id}`}>
                                    <Button size="sm" variant="outline" className="gap-1">
                                      <Eye className="h-3.5 w-3.5" />
                                      View
                                    </Button>
                                  </Link>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Item Preview Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 h-8 w-8 bg-white/90 shadow-sm text-muted-foreground hover:text-rose-600"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-gray-300" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-1 mb-2">{item.title}</h3>
                      <p className="text-lg font-bold text-emerald-700 mb-2">
                        ₦{item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {item.city}
                        <span className="mx-1">|</span>
                        <Tag className="h-3 w-3" />
                        {item.condition}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Link href="/browse/for-sale">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Compare More Items
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Comparison
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
