import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setSubmitted(true);
    toast.success('Welcome to the Nexus family! 🎉');
    setEmail('');
  };

  return (
    <section className="py-16">
      <div className="nexus-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 via-card to-gold/5 p-8 sm:p-12"
        >
          {/* Decorative */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

          <div className="relative mx-auto max-w-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10"
            >
              {submitted ? <Sparkles className="h-6 w-6 text-gold" /> : <Gift className="h-6 w-6 text-gold" />}
            </motion.div>

            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {submitted ? 'You\'re In!' : 'Get 15% Off Your First Order'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {submitted
                ? 'Check your inbox for your exclusive discount code.'
                : 'Subscribe to our newsletter for exclusive deals, new arrivals & insider offers.'}
            </p>

            {!submitted && (
              <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <Button variant="gold" type="submit">
                  Subscribe <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            )}

            <p className="mt-3 text-[11px] text-muted-foreground">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
