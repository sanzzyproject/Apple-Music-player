export default function Developer() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-12 px-4 pb-32 flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
        <div className="relative w-full h-full bg-[#1C1C1E] border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
          <span className="text-4xl font-bold text-white tracking-tighter">S4</span>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-white tracking-tight mb-3">SANN404 FORUM</h1>
      <p className="text-white/50 text-center max-w-sm mb-10 leading-relaxed">
        A modern, seamless music streaming experience built with Next.js, Tailwind CSS, and YTMusic API.
      </p>
      
      <div className="flex gap-4 w-full max-w-xs">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-white text-black rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-[#1C1C1E] text-white border border-white/10 rounded-xl font-semibold text-center hover:bg-white/5 transition-colors"
        >
          Twitter
        </a>
      </div>
    </main>
  );
}
