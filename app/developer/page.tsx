'use client';

import Image from 'next/image';
import { Download, MessageCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export default function DeveloperPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-12 pb-24 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Developer</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto"
      >
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
          <Image 
            src="https://f.top4top.io/p_3733w0g4e0.jpg" 
            alt="Developer Profile" 
            fill 
            className="object-cover"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Music App</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Platform streaming musik modern yang dirancang untuk memberikan pengalaman mendengarkan terbaik. 
            Nikmati jutaan lagu, buat daftar putar Anda sendiri, dan temukan musik baru setiap hari dengan kualitas audio premium.
          </p>
        </div>

        <div className="w-full space-y-4 pt-6 border-t border-white/10">
          <a 
            href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-[#25D366]/20"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Join Saluran WhatsApp</span>
            <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
          </a>

          <button 
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all border border-white/5"
            onClick={() => alert('Fitur download APK akan segera tersedia!')}
          >
            <Download className="w-6 h-6" />
            <span>Download APK</span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
