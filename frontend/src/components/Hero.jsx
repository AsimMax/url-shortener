import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <header className="pt-16 pb-10 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 text-sm font-mono text-teal mb-6 border border-ink-line rounded-full px-4 py-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />
        postgresql + redis powered
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-glow"
      >
        snip<span className="text-amber">/</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        className="mt-4 text-ivory-muted text-lg max-w-md mx-auto"
      >
        Paste a long link. Watch it fold into something you'd actually want to share.
      </motion.p>
    </header>
  );
}
