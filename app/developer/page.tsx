export default function Developer() {
  return (
    <main className="min-h-screen bg-black pt-12 px-4 pb-24 flex flex-col items-center justify-center">
      <div className="w-32 h-32 bg-gradient-to-br from-[#FA243C] to-purple-600 rounded-full mb-8 shadow-2xl shadow-[#FA243C]/20 flex items-center justify-center">
        <span className="text-4xl font-bold text-white">S4</span>
      </div>
      <h1 className="text-4xl font-bold text-white tracking-tight mb-2">SANN404 FORUM</h1>
      <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
        Modern Apple Music Clone built with Next.js, Tailwind CSS, and YTMusic API.
      </p>
      <div className="flex gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform"
        >
          GitHub
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#1C1C1E] text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
        >
          Twitter
        </a>
      </div>
    </main>
  );
}
