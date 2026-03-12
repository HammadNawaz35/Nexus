import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully!');
      navigate('/');
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="nexus-container flex flex-col items-center justify-center py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Invalid Link</h1>
        <p className="mt-2 text-muted-foreground">This password reset link is invalid or has expired.</p>
        <Button variant="gold" className="mt-8" onClick={() => navigate('/auth')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h1 className="font-display text-3xl font-bold text-center">New Password</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label>New Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required minLength={6} />
            </div>
          </div>
          <Button variant="gold" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
