import { useEffect, useState, useCallback } from 'react';
import Hero from './components/Hero';
import ShortenForm from './components/ShortenForm';
import ResultCard from './components/ResultCard';
import LinkHistory from './components/LinkHistory';
import Footer from './components/Footer';
import { shortenUrl, fetchRecentUrls } from './api/client';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    try {
      const rows = await fetchRecentUrls();
      setHistory(rows);
    } catch {
      // silently ignore - history is a nice-to-have, not critical
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function handleSubmit(url, customCode) {
    setLoading(true);
    setError('');
    try {
      const data = await shortenUrl(url, customCode);
      setResult(data);
      loadHistory();
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <ShortenForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <p className="text-center text-sm text-red-400 mt-4 font-mono px-4">{error}</p>
        )}

        {result && <ResultCard result={result} />}

        <LinkHistory links={history} />
      </main>
      <Footer />
    </div>
  );
}
