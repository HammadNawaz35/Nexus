import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from '@/components/chat/ChatWidget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
