import { motion } from 'framer-motion';

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [label, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value}${label[0]} ago`;
  }
  return 'just now';
}

export default function LinkHistory({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto mt-16 px-4 pb-20">
      <h2 className="font-display text-sm uppercase tracking-widest text-ivory-muted mb-4">
        Recently shortened
      </h2>
      <div className="border border-ink-line rounded-2xl divide-y divide-ink-line overflow-hidden bg-ink-surface/50">
        {links.map((link, i) => (
          <motion.a
            key={link.shortCode}
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-ink-alt transition-colors group"
          >
            <div className="min-w-0">
              <p className="font-mono text-teal text-sm truncate group-hover:text-teal-soft">
                /{link.shortCode}
              </p>
              <p className="text-xs text-ivory-muted truncate">{link.originalUrl}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-xs text-ivory-muted font-mono">
              <span>{link.clicks} clicks</span>
              <span className="text-ink-line">•</span>
              <span>{timeAgo(link.createdAt)}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
