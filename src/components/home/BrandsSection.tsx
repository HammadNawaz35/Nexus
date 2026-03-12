import { motion } from 'framer-motion';

const brands = [
  'Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'L\'Oréal', 'Gucci', 'Puma',
  'Philips', 'Dyson', 'Zara', 'H&M',
];

export default function BrandsSection() {
  return (
    <section className="py-12 border-y border-border bg-muted/20">
      <div className="nexus-container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground"
        >
          Trusted by top brands worldwide
        </motion.p>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-12"
            animate={{ x: [0, -600] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={`${brand}-${i}`}
                className="flex flex-shrink-0 items-center justify-center"
              >
                <span className="whitespace-nowrap text-lg font-display font-semibold text-muted-foreground/40 transition-colors hover:text-foreground sm:text-xl">
                  {brand}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
