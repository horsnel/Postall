import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Globe,
  Lightbulb,
  Users,
  Target,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Heart,
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            The All-in-One Marketplace
            <br />
            <span className="text-emerald-200">Built for Everyone</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            PostAll is a peer-to-peer marketplace platform that connects people who need things done
            with people who can do them. With 24 powerful tools, built-in escrow protection, and a
            presence across 25+ cities, we&apos;re making local commerce safer, simpler, and more
            accessible for communities across Africa and beyond.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
                <Target className="h-3.5 w-3.5 mr-1.5" />
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Empowering Communities Through Trust
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our mission is to create a marketplace where every transaction is protected, every
                connection is meaningful, and every community has access to the tools they need to
                thrive. We believe that local commerce should be as safe as it is convenient, and
                that technology can bridge the gap between trust and opportunity in emerging markets.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                PostAll was built from the ground up to serve the unique needs of markets where
                traditional e-commerce platforms fall short. Whether you&apos;re posting a task,
                offering a service, selling items, or looking for your next opportunity, our platform
                provides the infrastructure to make it happen securely and efficiently.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With our integrated escrow system, AI-powered tools, and community-driven approach,
                we&apos;re not just building a marketplace — we&apos;re building the future of
                peer-to-peer commerce in Africa and around the world.
              </p>
            </div>
            <div className="space-y-4">
              <Card className="border-l-4 border-l-emerald-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Escrow Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Every transaction is secured through our built-in escrow system. Your money is
                      held safely until both parties confirm the job is done, giving you complete
                      peace of mind with every interaction.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-teal-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                    <Lightbulb className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">24 Powerful Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      From AI assistants and price checkers to safe spots finders and proof cameras,
                      our suite of 24 tools gives you everything you need to buy, sell, and
                      transact with confidence on our platform.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-cyan-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                    <Globe className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Multi-City Presence</h3>
                    <p className="text-sm text-muted-foreground">
                      Available across 25+ cities spanning Nigeria and
                      beyond, PostAll brings the power of local commerce to communities throughout
                      Africa and across the globe.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How It Started */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Our Journey
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Started</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            PostAll was born in 2023 from a simple observation: people in Lagos, Nigeria needed a
            better way to connect for everyday transactions. Whether it was finding someone to fix a
            leaky faucet, selling a used laptop, or getting help with a move, the existing options
            were fragmented, unreliable, and often unsafe.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            Our founders experienced these pain points firsthand. After a bad experience hiring a
            contractor through a social media group — where there was no accountability, no
            protection, and no way to verify the person&apos;s credibility — they set out to build a
            platform that would solve these problems once and for all. The goal was to create
            something that combined the convenience of online marketplaces with the trust that comes
            from community-driven, locally-relevant commerce.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            Starting with just a handful of categories and a few hundred users in Lagos, PostAll
            quickly gained traction as word spread about the platform&apos;s unique combination of
            escrow protection, AI-powered tools, and community-focused design. Within months, users
            across Nigeria were posting tasks, finding work, and trading goods with a level of safety
            and convenience they had never experienced before.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Today, PostAll has expanded to over 25 cities across Nigeria,
            with more than 8,200 active users and over 12,500 completed tasks. Our vision
            remains the same: to build the most trusted and accessible peer-to-peer marketplace in
            Africa and beyond, one community at a time. We&apos;re just getting started.
          </p>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Heart className="h-3.5 w-3.5 mr-1.5" />
              What We Stand For
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide every decision we make, every feature we build, and every
              interaction we facilitate on the PostAll platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust &amp; Safety</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that trust is the foundation of every great marketplace. That&apos;s why
                  we&apos;ve invested heavily in building robust safety features including escrow
                  protection, verified profiles, safe spots, proof cameras, and a comprehensive
                  dispute resolution system. Every feature on our platform is designed with your
                  safety as the top priority, ensuring that you can transact with complete confidence
                  every single time.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-teal-500">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Great marketplaces should be available to everyone, regardless of their technical
                  expertise, financial situation, or geographic location. We&apos;ve designed
                  PostAll to work seamlessly on any device, with no signup required to browse, and
                  we support bank transfers and card payments via Paystack to ensure maximum financial
                  inclusion for all users across our growing network of cities.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-cyan-500">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We&apos;re constantly pushing the boundaries of what a marketplace can be. Our 24
                  integrated tools — from AI assistants and price checkers to escrow calculators and
                  proof cameras — represent our commitment to using technology to solve real problems.
                  We listen to our community, iterate rapidly, and are never satisfied with the
                  status quo when it comes to improving the user experience.
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  At its heart, PostAll is about people helping people. We foster a community where
                  skills are shared, opportunities are created, and local economies are strengthened.
                  Every task completed, every item sold, and every service delivered on our platform
                  contributes to building stronger, more connected communities across Africa and
                  beyond, one transaction at a time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* By the Numbers */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Growing Fast
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">By the Numbers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is growing every day, driven by the trust and enthusiasm of our incredible
              community of users across multiple countries and cities.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">12,500+</p>
                <p className="text-sm text-muted-foreground font-medium">Tasks Completed</p>
                <p className="text-xs text-muted-foreground mt-1">
                  And counting every single day
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">8,200+</p>
                <p className="text-sm text-muted-foreground font-medium">Active Users</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Buyers, sellers, and workers
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">25+</p>
                <p className="text-sm text-muted-foreground font-medium">Cities</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across 4 African countries
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">24</p>
                <p className="text-sm text-muted-foreground font-medium">Tools</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Built-in marketplace tools
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Meet the Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The People Behind PostAll</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;re a passionate team of builders, designers, and problem-solvers dedicated to
              making local commerce work better for everyone in our communities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Adebayo Okonkwo",
                role: "Co-Founder & CEO",
                bio: "Visionary leader with a passion for building products that solve real African market challenges and bridge trust gaps in peer-to-peer commerce.",
              },
              {
                name: "Chioma Eze",
                role: "Co-Founder & CTO",
                bio: "Full-stack engineer and systems architect who leads the technical team building the secure, scalable infrastructure behind the PostAll platform.",
              },
              {
                name: "Kwame Mensah",
                role: "Head of Product",
                bio: "Product strategist focused on user experience, accessibility, and ensuring that every feature on PostAll serves the real needs of our diverse community.",
              },
              {
                name: "Fatima Abdi",
                role: "Head of Safety",
                bio: "Community trust and safety expert dedicated to creating the most secure marketplace environment through innovative tools and robust dispute resolution.",
              },
            ].map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="p-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-emerald-600 font-medium mb-3">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the PostAll Community</h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether you&apos;re looking to get things done, offer your skills, or find great deals,
            PostAll has everything you need. Join thousands of users who trust our platform for safe,
            simple, and rewarding transactions every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/browse">
              <Button size="lg" variant="secondary" className="gap-2">
                Explore the Marketplace
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/post-task">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                Post Your First Task
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
