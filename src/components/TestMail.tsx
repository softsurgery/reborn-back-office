// components/TestEmailForm.tsx
import { useState } from 'react';

export default function TestEmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`✅ Success: ${data.message}`);
      } else {
        setStatus(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setStatus(`❌ Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <label htmlFor="email">Target Email Address:</label>
      <input
        type="email"
        id="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginTop: 8, marginBottom: 12 }}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </form>
  );
}
