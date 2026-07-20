import { Link } from 'react-router-dom'

function ImpactSection() {
  const highlights = [
    {
      title: 'Resume-fit in seconds',
      text: 'Turn a plain resume into a recruiter-ready story with instant AI guidance.',
      accent: '#38bdf8',
    },
    {
      title: 'Built for first-job seekers',
      text: 'Everything you need to prepare, apply, and follow up without switching tools.',
      accent: '#818cf8',
    },
    {
      title: 'Momentum that compounds',
      text: 'Track every application, improve your profile, and keep interviews moving.',
      accent: '#34d399',
    },
  ]

  return (
    <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px 56px' }}>
      <div style={{
        padding: '32px',
        borderRadius: '28px',
        background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(15,23,42,0.8))',
        border: '1px solid rgba(56,189,248,0.2)',
        boxShadow: '0 24px 80px rgba(2, 8, 23, 0.22)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#7dd3fc', fontSize: '12px', fontWeight: '700', marginBottom: '12px' }}>
              ✦ Why students choose CareerPilot
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              A premium launchpad for your first job search
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', lineHeight: '1.7' }}>
              Stop juggling scattered notes, random templates, and guesswork. One polished workspace helps you prepare smarter and apply faster.
            </p>
          </div>
          <Link to="/analyze" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '999px' }}>
              Start Free →
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
          {highlights.map((item, index) => (
            <div key={item.title} style={{ padding: '18px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px', background: `${item.accent}18`, color: item.accent }}>
                {index + 1}
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{item.title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImpactSection
