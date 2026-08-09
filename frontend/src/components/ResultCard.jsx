import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="max-w-2xl mx-auto mt-6 px-4"
    >
      <div className="bg-ink-surface border border-ink-line rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="min-w-0">
          <p className="text-xs text-ivory-muted font-mono truncate">{result.originalUrl}</p>
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xl text-teal hover:text-teal-soft transition-colors break-all"
          >
            {result.shortUrl}
          </a>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="bg-ink-alt border border-ink-line hover:border-teal text-sm px-4 py-2 rounded-lg transition-colors font-body"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
          <button
            onClick={() => setShowQr((s) => !s)}
            className="bg-ink-alt border border-ink-line hover:border-amber text-sm px-4 py-2 rounded-lg transition-colors font-body"
          >
            QR
          </button>
        </div>
      </div>

      {showQr && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex justify-center mt-4 bg-ivory rounded-2xl p-5 w-fit mx-auto"
        >
          <QRCodeCanvas value={result.shortUrl} size={160} />
        </motion.div>
      )}
    </motion.div>
  );
}
