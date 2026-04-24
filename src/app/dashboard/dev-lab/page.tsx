'use client';

import { useState, useRef, useEffect } from 'react';
import { FlaskConical, Bot, Lock, Eye, EyeOff, Terminal, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExperimentsContent } from '@/app/dashboard/experiments/page';
import { AIAgentsContent } from '@/app/dashboard/ai-agents/page';
import { AdminContent } from '@/app/dashboard/admin/page';
import { ModerationContent } from '@/app/dashboard/moderation/page';

const DEV_LAB_PASSWORD = 'postall2024';
const SESSION_KEY = 'devlab_unlocked';

export default function DevLabPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [unlocked]);

  const handleSubmit = () => {
    if (password === DEV_LAB_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setPassword('');
      setTimeout(() => {
        setShake(false);
        setError(false);
        inputRef.current?.focus();
      }, 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleLock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
    setPassword('');
  };

  if (!unlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className={`w-full max-w-sm ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Terminal className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold tracking-tight">Dev Lab</span>
              <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700">
                O.L.H.M.E.S
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Internal tools. Restricted access.
            </p>
          </div>

          <Card className={`border-2 transition-colors ${error ? 'border-red-400' : 'border-border'}`}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Lock className="h-3.5 w-3.5" />
                <span>Enter access password</span>
              </div>
              <div className="relative">
                <Input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Password"
                  className={`pr-10 font-mono tracking-widest ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Incorrect password
                </p>
              )}
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#0D8A5C] hover:bg-[#0D8A5C]/90"
              >
                Unlock
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Access via O.L.H.M.E.S in the footer
          </p>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Terminal className="h-6 w-6 text-emerald-600" />
            Dev Lab
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Internal tooling — admin, moderation, experiments &amp; AI agents
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">
            O.L.H.M.E.S Internal
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLock}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Lock className="h-3.5 w-3.5" />
            Lock
          </Button>
        </div>
      </div>

      <Tabs defaultValue="admin">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="admin" className="gap-1.5 text-xs sm:text-sm">
            <ShieldAlert className="h-3.5 w-3.5" />
            Admin
          </TabsTrigger>
          <TabsTrigger value="moderation" className="gap-1.5 text-xs sm:text-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="experiments" className="gap-1.5 text-xs sm:text-sm">
            <FlaskConical className="h-3.5 w-3.5" />
            Experiments
          </TabsTrigger>
          <TabsTrigger value="ai-agents" className="gap-1.5 text-xs sm:text-sm">
            <Bot className="h-3.5 w-3.5" />
            AI Agents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-6">
          <AdminContent />
        </TabsContent>

        <TabsContent value="moderation" className="mt-6">
          <ModerationContent />
        </TabsContent>

        <TabsContent value="experiments" className="mt-6">
          <ExperimentsContent />
        </TabsContent>

        <TabsContent value="ai-agents" className="mt-6">
          <AIAgentsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
