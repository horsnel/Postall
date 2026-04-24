"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, Eye, EyeOff, AlertTriangle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store admin session
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_token", data.token);
          sessionStorage.setItem("admin_role", "admin");
          sessionStorage.setItem("admin_email", data.email);
        }
        toast.success("Welcome, Admin!");
        router.push("/dashboard/admin");
      } else {
        setError(data.error || "Invalid credentials");
        toast.error(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
      toast.error("Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to PostAll
        </Link>

        <Card className="border-gray-700 bg-gray-900/80 backdrop-blur shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="h-16 w-16 rounded-2xl bg-emerald-600/20 flex items-center justify-center mx-auto mb-4 border border-emerald-600/30">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl text-white">Admin Access</CardTitle>
            <CardDescription className="text-gray-400">
              Restricted area. Authorized personnel only.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-rose-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-gray-300 text-sm">
                  Admin Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@postall.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-gray-300 text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 font-semibold gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Sign In as Admin
                  </>
                )}
              </Button>

              <p className="text-center text-[11px] text-gray-500 mt-4">
                This login is restricted to authorized administrators only.
                <br />
                All access attempts are logged and monitored.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
