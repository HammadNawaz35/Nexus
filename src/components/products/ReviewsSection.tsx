import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  helpful_count: number;
  created_at: string;
  user_name?: string;
}

interface ReviewsSectionProps {
  productId: string;
}

function StarRating({ value, onChange, size = 'md' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' }) {
  const [hover, setHover] = useState(0);
  const sz = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(i)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`${sz} transition-colors ${
              i <= (hover || value) ? 'fill-gold text-gold' : 'text-muted'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (data) {
      // Fetch user names for reviews
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);
      
      const nameMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);
      setReviews(data.map(r => ({ ...r, user_name: nameMap.get(r.user_id) || 'Anonymous' })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`reviews-${productId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews', filter: `product_id=eq.${productId}` }, () => {
        fetchReviews();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to leave a review'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      title: title || null,
      content: content || null,
    });
    if (error) {
      if (error.code === '23505') toast.error('You already reviewed this product');
      else toast.error('Failed to submit review');
    } else {
      toast.success('Review submitted!');
      setShowForm(false);
      setTitle('');
      setContent('');
      setRating(5);
    }
    setSubmitting(false);
  };

  const handleHelpful = async (reviewId: string) => {
    await supabase.from('reviews').update({ helpful_count: reviews.find(r => r.id === reviewId)!.helpful_count + 1 }).eq('id', reviewId);
    fetchReviews();
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const userReviewed = reviews.some(r => r.user_id === user?.id);

  return (
    <div className="mt-16">
      <h2 className="font-display text-2xl font-bold">Customer Reviews</h2>

      {/* Summary */}
      <div className="mt-6 grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
          <span className="font-display text-5xl font-bold">{avgRating.toFixed(1)}</span>
          <StarRating value={Math.round(avgRating)} size="md" />
          <p className="mt-1 text-sm text-muted-foreground">{reviews.length} review{reviews.length !== 1 && 's'}</p>

          <div className="mt-4 w-full space-y-1.5">
            {ratingDist.map(d => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-right">{d.star}</span>
                <Star className="h-3 w-3 fill-gold text-gold" />
                <div className="flex-1 overflow-hidden rounded-full bg-muted h-1.5">
                  <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-6 text-right text-muted-foreground">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Write review button */}
          {user && !userReviewed && (
            <Button variant="goldOutline" size="sm" onClick={() => setShowForm(!showForm)} className="mb-4">
              Write a Review
            </Button>
          )}

          {!user && (
            <p className="mb-4 text-sm text-muted-foreground">Sign in to leave a review.</p>
          )}

          {/* Review form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleSubmit}
                className="mb-6 overflow-hidden rounded-xl border border-gold/20 bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Your Rating:</span>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <Input
                  placeholder="Review title (optional)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mt-3"
                />
                <Textarea
                  placeholder="Share your experience..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
                <Button variant="gold" size="sm" type="submit" disabled={submitting} className="mt-3">
                  <Send className="mr-2 h-3.5 w-3.5" /> {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reviews list */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <StarRating value={review.rating} size="sm" />
                        {review.title && (
                          <span className="text-sm font-semibold">{review.title}</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        by <span className="font-medium text-foreground">{review.user_name}</span> • {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {review.content && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
                  )}
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-gold"
                  >
                    <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful_count})
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
