import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For building a stronger first version of your profile.',
    features: ['Five AI-assisted generations each month', 'Resume score, templates, and core exports', 'Application tracker and practice tools'],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Pro',
    price: 'INR 21',
    cadence: '/ month',
    description: 'For active candidates who want a faster, more deliberate search.',
    features: ['Unlimited resume, outreach, and email assistance', 'Premium practice sets and interview paths', 'Priority fit insights for target roles', 'Export-ready resume versions for each application'],
    cta: 'Choose Pro',
    featured: true,
  },
]

export default function Pricing() {
  return (
    <main className="pricing-page" aria-labelledby="pricing-title">
      <section className="pricing-hero">
        <span className="cp-eyebrow">Simple pricing</span>
        <h1 id="pricing-title">A serious workspace for a serious search.</h1>
        <p>Start free. Upgrade when speed, focus, and better application quality are worth more than another tab in your browser.</p>
      </section>

      <section className="pricing-grid" aria-label="Plans">
        {plans.map(plan => (
          <article key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`} aria-labelledby={`plan-${plan.name}`}>
            {plan.featured && <span className="plan-badge">Best value</span>}
            <p className="plan-name">{plan.name}</p>
            <h2 id={`plan-${plan.name}`}>{plan.price}<small>{plan.cadence}</small></h2>
            <p className="plan-description">{plan.description}</p>
            <Link className={plan.featured ? 'btn-primary' : 'pricing-secondary'} to="/login">{plan.cta}</Link>
            <ul aria-label={`${plan.name} features`}>
              {plan.features.map(feature => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="pricing-proof" aria-label="Trust notes">
        <p>Built for candidates who want control, not another noisy subscription.</p>
        <div><span>Cancel anytime</span><span>Secure checkout</span><span>Your data stays yours</span></div>
      </section>
    </main>
  )
}
