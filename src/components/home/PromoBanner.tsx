import { motion } from 'framer-motion';
import { Tag, Truck, ShieldCheck, Headphones } from 'lucide-react';

const promos = [
  {
    icon: Tag,
    title: 'Best Prices',
    description: 'Guaranteed best prices on all premium products',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free shipping on all orders over PKR 5,000',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: '100% secure payment with SSL encryption',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round the clock customer support',
  },
];

export default function PromoBanner() {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="nexus-container">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {promos.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <promo.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{promo.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{promo.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
