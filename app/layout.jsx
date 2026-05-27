import { Inter, Playfair_Display } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import CookieConsent from '@/components/cookie/CookieConsent';
import NewsletterModal from '@/components/newsletter/NewsletterModal';
import CartDrawer from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: { default: 'Olubukola Couture', template: '%s | Olubukola Couture' },
  description: 'Curated women\'s fashion. Timeless elegance, contemporary design.',
  keywords: ['women\'s fashion', 'clothing', 'couture', 'luxury', 'British', 'Nigerian'],
  openGraph: {
    title: 'Olubukola Couture',
    description: 'Curated women\'s fashion. Timeless elegance.',
    url: 'https://olubukola-couture.com',
    siteName: 'Olubukola Couture',
    type: 'website',
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-ivory text-ebony antialiased">
        <Providers session={session}>
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsent />
          <NewsletterModal />
          <WhatsAppButton />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#555D50',
                color: '#FFFFF0',
                fontSize: '13px',
                letterSpacing: '0.5px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
