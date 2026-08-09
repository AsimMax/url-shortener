import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShortenForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [folding, setFolding] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setFolding(true);
    onSubmit(url.trim(), customCode.trim() || undefined).finally(() => {
      setTimeout(() => setFolding(false), 500);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-4">
      <div className="relative">
        <AnimatePresence mode="wait">
          {!folding ? (
            <motion.div
              key="input"
              initial={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.4, transition: { duration: 0.35, ease: 'easeIn' } }}
              style={{ transformOrigin: 'right center' }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-really-long-url.example.com/goes/here"
                className="flex-1 bg-ink-surface border border-ink-line rounded-xl px-5 py-4 font-mono text-sm placeholder:text-ivory-muted/60 focus:border-teal transition-colors"
                aria-label="Long URL to shorten"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amber text-ink font-display font-semibold px-6 py-4 rounded-xl hover:bg-amber-soft active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Folding…' : 'Shorten it'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="folding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[60px] flex items-center justify-center font-mono text-sm text-teal"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.1 }}
              >
                compressing link…
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => setShowCustom((s) => !s)}
          className="text-xs text-ivory-muted hover:text-teal transition-colors font-mono"
        >
          {showCustom ? 'hide custom code' : '+ use a custom code'}
        </button>
      </div>

      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="my-custom-code"
              maxLength={12}
              pattern="[a-zA-Z0-9\-_]+"
              className="mt-3 w-full bg-ink-surface border border-ink-line rounded-xl px-5 py-3 font-mono text-sm placeholder:text-ivory-muted/60 focus:border-teal transition-colors"
              aria-label="Custom short code"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
