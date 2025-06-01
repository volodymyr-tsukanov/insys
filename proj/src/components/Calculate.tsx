'use client';
import { useState } from 'react';
import type { IDatasetProcessed } from '@/lib/data/proc';


export default function CalculateClient() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IDatasetProcessed | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/calculate', { next: { revalidate: 60 } });
      if (!res.ok) throw new Error('Failed to fetch');
      const json: IDatasetProcessed = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message ?? 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Calculating...' : 'Calculate Metrics'}
      </button>

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      {data && (
        <div className="mt-6">
          <pre className="bg-gray-900 text-[beige] font-mono text-sm p-4 rounded overflow-auto max-h-[600px]">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
