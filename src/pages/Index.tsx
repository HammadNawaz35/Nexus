import PageTransition from '@/components/layout/PageTransition';
import HeroSection from '@/components/home/HeroSection';
import BrandsSection from '@/components/home/BrandsSection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import DealsOfTheDay from '@/components/home/DealsOfTheDay';
import TrendingProducts from '@/components/home/TrendingProducts';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

const Index = () => {
  return (
    <PageTransition>
      <HeroSection />
      <BrandsSection />
      <FlashSaleSection />
      <CategoriesSection />
      <DealsOfTheDay />
      <TrendingProducts />
      <FeaturedProducts />
      <StatsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </PageTransition>
  );
};

export default Index;
