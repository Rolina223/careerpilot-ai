import { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { getCurrentUsage, startRazorpayCheckout } from '../services/paymentService';

export default function UpgradeButton({ onUpgraded }) {
  const { user } = useAuth();
  const [usage, setUsage] = useState(null);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) loadUsage();
  }, [user]);

  async function loadUsage() {
    const data = await getCurrentUsage();
    setUsage(data);
  }

  function handleUpgrade() {
    if (!user) return;
    setPaying(true);
    setMessage('');

    startRazorpayCheckout({
      userEmail: user.email,
      userName: user.user_metadata?.full_name || '',
      onSuccess: async () => {
        setPaying(false);
        setMessage('🎉 Premium activated! Unlimited access unlocked.');
        await loadUsage();
        if (onUpgraded) onUpgraded();
      },
      onFailure: (reason) => {
        setPaying(false);
        if (reason !== 'Payment cancelled.') {
          setMessage(`⚠️ ${reason}`);
        }
      },
    });
  }

  if (!usage) return null;

  if (usage.isPremium) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px', borderRadius: '100px',
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.3)',
        fontSize: '13px', color: '#818cf8', fontWeight: '600',
      }}>
        ⭐ Premium — Unlimited
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          padding: '8px 16px', borderRadius: '100px',
          background: usage.remaining === 0
            ? 'rgba(244,63,94,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${usage.remaining === 0
            ? 'rgba(244,63,94,0.3)' : 'rgba(255,255,255,0.12)'}`,
          fontSize: '13px',
          color: usage.remaining === 0 ? '#fb7185' : 'var(--text-secondary)',
          fontWeight: '600',
        }}>
          {usage.remaining === 0
            ? '⚠️ Free limit reached'
            : `${usage.remaining} free AI use${usage.remaining === 1 ? '' : 's'} left`}
        </div>

        <button
          onClick={handleUpgrade}
          disabled={paying}
          style={{
            padding: '8px 20px', borderRadius: '100px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', cursor: paying ? 'wait' : 'pointer',
            fontSize: '13px', color: '#fff', fontWeight: '700',
            opacity: paying ? 0.7 : 1, transition: 'opacity 0.2s',
          }}
        >
          {paying ? 'Opening...' : '⭐ Upgrade ₹21/month'}
        </button>
      </div>

      {message && (
        <p style={{
          fontSize: '13px', margin: 0,
          color: message.startsWith('🎉') ? '#4ade80' : '#fb7185',
        }}>
          {message}
        </p>
      )}
    </div>
  );
}