import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { BottomNav } from '@/components/BottomNav';
import { Player } from '@/components/Player';
import { AddToPlaylistModal } from '@/components/AddToPlaylistModal';

export const metadata: Metadata = {
  title: 'Apple Music Clone',
  description: 'Modern Apple Music Clone by SANN404 FORUM',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased pb-24" suppressHydrationWarning>
        {children}
        <Player />
        <BottomNav />
        <AddToPlaylistModal />
      </body>
    </html>
  );
}
