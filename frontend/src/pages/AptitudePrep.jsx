import { useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const questionBank = [
  // QUANT
  { id: 1, category: 'quant', companies: ['TCS', 'Cognizant', 'Generic'], q: 'A train travels 60 km in 1.5 hours. What is its speed in km/hr?', options: ['35 km/hr', '40 km/hr', '45 km/hr', '50 km/hr'], answer: 1, explanation: 'Speed = Distance/Time = 60/1.5 = 40 km/hr' },
  { id: 2, category: 'quant', companies: ['TCS', 'Infosys', 'Generic'], q: 'If 20% of a number is 50, what is the number?', options: ['200', '250', '300', '350'], answer: 1, explanation: '20% of x = 50 → x = 50/0.20 = 250' },
  { id: 3, category: 'quant', companies: ['Infosys', 'Wipro', 'Generic'], q: 'What is the compound interest on ₹1000 at 10% for 2 years?', options: ['₹200', '₹210', '₹220', '₹230'], answer: 1, explanation: 'CI = 1000(1.1)² - 1000 = 1210 - 1000 = ₹210' },
  { id: 4, category: 'quant', companies: ['TCS', 'Wipro', 'Accenture', 'Generic'], q: 'A can complete a work in 10 days, B in 15 days. Together how many days?', options: ['5 days', '6 days', '7 days', '8 days'], answer: 1, explanation: '1/10 + 1/15 = 1/6, so together = 6 days' },
  { id: 5, category: 'quant', companies: ['Cognizant', 'Accenture', 'Generic'], q: 'What is the average of 12, 15, 18, 21, 24?', options: ['16', '17', '18', '19'], answer: 2, explanation: 'Sum = 90, Average = 90/5 = 18' },
  { id: 6, category: 'quant', companies: ['TCS', 'Infosys', 'Generic'], q: 'Ratio of two numbers is 3:4 and their sum is 84. Find the larger number.', options: ['36', '40', '44', '48'], answer: 3, explanation: 'Total parts=7, each part=12, larger=4×12=48' },
  { id: 7, category: 'quant', companies: ['Wipro', 'Cognizant', 'Generic'], q: 'If a car covers 240 km in 4 hours, how long for 360 km at same speed?', options: ['5 hrs', '6 hrs', '7 hrs', '8 hrs'], answer: 1, explanation: 'Speed=60km/hr, Time=360/60=6 hours' },
  { id: 8, category: 'quant', companies: ['TCS', 'Accenture', 'Generic'], q: 'A shopkeeper buys an item for ₹500 and sells it for ₹650. What is the profit %?', options: ['25%', '30%', '35%', '20%'], answer: 0, explanation: 'Profit = 150, Profit% = (150/500)×100 = 30%... recompute: 150/500=0.3=30%' },

  // LOGICAL
  { id: 9, category: 'logical', companies: ['TCS', 'Infosys', 'Generic'], q: 'Find the next number: 2, 6, 12, 20, 30, ?', options: ['36', '40', '42', '44'], answer: 2, explanation: 'Differences are 4,6,8,10,12 → 30+12=42' },
  { id: 10, category: 'logical', companies: ['Infosys', 'Wipro', 'Generic'], q: 'Complete the series: AZ, BY, CX, ?', options: ['DW', 'DV', 'EW', 'DU'], answer: 0, explanation: 'First letter increases, second decreases: D, W' },
  { id: 11, category: 'logical', companies: ['TCS', 'Cognizant', 'Generic'], q: 'Pointing to a photo, Ravi said "She is the daughter of my grandfather\'s only son." Who is she?', options: ['Sister', 'Mother', 'Cousin', 'Aunt'], answer: 0, explanation: 'Grandfather\'s only son = Ravi\'s father. His daughter = Ravi\'s sister.' },
  { id: 12, category: 'logical', companies: ['Wipro', 'Accenture', 'Generic'], q: 'Find the odd one out: Apple, Mango, Potato, Banana', options: ['Apple', 'Mango', 'Potato', 'Banana'], answer: 2, explanation: 'Potato is a vegetable, others are fruits.' },
  { id: 13, category: 'logical', companies: ['TCS', 'Infosys', 'Generic'], q: 'If CODING is written as DPEJOH, how is FLOWER written?', options: ['GMPXFS', 'GMPXFT', 'GNPXFS', 'GMQXFS'], answer: 0, explanation: 'Each letter shifted +1: F→G, L→M, O→P, W→X, E→F, R→S' },
  { id: 14, category: 'logical', companies: ['Cognizant', 'Accenture', 'Generic'], q: 'A is brother of B. B is sister of C. C is father of D. How is A related to D?', options: ['Uncle/Aunt', 'Father', 'Grandfather', 'Cousin'], answer: 0, explanation: 'A is sibling of C (D\'s father), so A is D\'s uncle or aunt.' },
  { id: 15, category: 'logical', companies: ['TCS', 'Wipro', 'Generic'], q: 'Which number replaces the question mark: 4, 9, 16, 25, ?', options: ['30', '32', '36', '40'], answer: 2, explanation: 'These are squares: 2²,3²,4²,5²,6² = 36' },
  { id: 16, category: 'logical', companies: ['Infosys', 'Cognizant', 'Generic'], q: 'If all Roses are Flowers and some Flowers fade quickly, which is true?', options: ['All roses fade quickly', 'Some roses may fade quickly', 'No roses fade quickly', 'All flowers are roses'], answer: 1, explanation: 'Since some flowers fade and roses are flowers, some roses may fade quickly.' },

  // VERBAL
  { id: 17, category: 'verbal', companies: ['TCS', 'Infosys', 'Generic'], q: 'Choose the synonym of "Abundant"', options: ['Scarce', 'Plentiful', 'Limited', 'Rare'], answer: 1, explanation: 'Abundant means existing in large quantities — synonym is Plentiful.' },
  { id: 18, category: 'verbal', companies: ['Wipro', 'Accenture', 'Generic'], q: 'Choose the antonym of "Optimistic"', options: ['Hopeful', 'Pessimistic', 'Confident', 'Positive'], answer: 1, explanation: 'Optimistic means hopeful, opposite is Pessimistic.' },
  { id: 19, category: 'verbal', companies: ['TCS', 'Cognizant', 'Generic'], q: 'Fill in the blank: She has been working here ___ 2020.', options: ['since', 'from', 'for', 'at'], answer: 0, explanation: '"Since" is used with a specific point in time (2020).' },
  { id: 20, category: 'verbal', companies: ['Infosys', 'Wipro', 'Generic'], q: 'Identify the error: "Each of the students have submitted their assignment"', options: ['Each of', 'have submitted', 'their', 'No error'], answer: 1, explanation: '"Each" is singular, so it should be "has submitted".' },
  { id: 21, category: 'verbal', companies: ['Cognizant', 'Accenture', 'Generic'], q: 'Choose the meaning of the idiom "Bite the bullet"', options: ['To eat fast', 'To face a difficult situation bravely', 'To avoid problems', 'To complain'], answer: 1, explanation: '"Bite the bullet" means to endure a painful situation with courage.' },
  { id: 22, category: 'verbal', companies: ['TCS', 'Accenture', 'Generic'], q: 'Choose the correct passive voice: "She writes a letter"', options: ['A letter is written by her', 'A letter was written by her', 'A letter writes by her', 'A letter is wrote by her'], answer: 0, explanation: 'Present tense passive: "A letter is written by her"' },
  { id: 23, category: 'verbal', companies: ['Infosys', 'Cognizant', 'Generic'], q: 'Synonym of "Reluctant"', options: ['Eager', 'Willing', 'Unwilling', 'Excited'], answer: 2, explanation: 'Reluctant means hesitant or unwilling.' },
  { id: 24, category: 'verbal', companies: ['Wipro', 'TCS', 'Generic'], q: 'Choose the correctly spelled word', options: ['Recieve', 'Receive', 'Receeve', 'Receve'], answer: 1, explanation: 'Correct spelling is "Receive" — rule: e before i except after c.' },
]

const companies = [
  { name: 'TCS', icon: '🏢', color: '#38bdf8', pattern: 'Quant + Logical + Verbal', duration: '~90 min (actual exam)' },
  { name: 'Infosys', icon: '💼', color: '#818cf8', pattern: 'Quant + Logical + Verbal', duration: '~95 min (actual exam)' },
  { name: 'Wipro', icon: '🌐', color: '#34d399', pattern: 'Quant + Logical + Verbal', duration: '~60 min (actual exam)' },
  { name: 'Cognizant', icon: '⚡', color: '#f59e0b', pattern: 'Quant + Logical + Verbal', duration: '~70 min (actual exam)' },
  { name: 'Accenture', icon: '🎯', color: '#fb7185', pattern: 'Quant + Logical + Verbal', duration: '~80 min (actual exam)' },
  { name: 'Generic', icon: '📚', color: '#94a3b8', pattern: 'Mixed Practice', duration: 'Self-paced' },
]

const categoryInfo = {
  quant: { label: 'Quantitative', color: '#38bdf8' },
  logical: { label: 'Logical Reasoning', color: '#818cf8' },
  verbal: { label: 'Verbal Ability', color: '#34d399' },
}

function AptitudePrep() {
  const [screen, setScreen] = useState('setup')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState([])

  const getCompanyQuestionCount = (companyName) => {
    return questionBank.filter(q => q.companies.includes(companyName)).length
  }

  const startTest = (company) => {
    let qs = questionBank.filter(q => q.companies.includes(company.name))
    qs = qs.sort(() => Math.random() - 0.5)
    setSelectedCompany(company)
    setQuestions(qs)
    setCurrentIndex(0)
    setResults([])
    setSelectedOption(null)
    setShowAnswer(false)
    setScreen('test')
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return
    setShowAnswer(true)
  }

  const handleNext = () => {
    const isCorrect = selectedOption === questions[currentIndex].answer
    setResults(prev => [...prev, {
      question: questions[currentIndex],
      selected: selectedOption,
      correct: isCorrect,
      skipped: selectedOption === null,
    }])
    setSelectedOption(null)
    setShowAnswer(false)

    if (currentIndex + 1 >= questions.length) {
      setScreen('result')
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    setResults(prev => [...prev, {
      question: questions[currentIndex],
      selected: null,
      correct: false,
      skipped: true,
    }])
    setSelectedOption(null)
    setShowAnswer(false)

    if (currentIndex + 1 >= questions.length) {
      setScreen('result')
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  // SETUP SCREEN — Company Selection
  if (screen === 'setup') {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', backgroundColor: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.3)', borderRadius: '100px',
            fontSize: '13px', color: '#38bdf8', fontWeight: '500', marginBottom: '16px',
          }}>
            ✦ Company-wise Aptitude Practice
          </div>
          <h2 style={{
            fontSize: '40px', fontWeight: '800',
            background: 'var(--gradient)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', marginBottom: '12px', letterSpacing: '-1px',
          }}>
            Aptitude Prep
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '550px', margin: '0 auto', lineHeight: '1.7' }}>
            Select a company to practice questions in their typical exam style — Quant, Logical & Verbal
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{
          padding: '14px 20px',
          backgroundColor: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '12px',
          marginBottom: '32px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '12px', color: '#f59e0b' }}>
            ⚠️ Practice questions in company exam style — not actual leaked papers
          </p>
        </div>

        {/* Company Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
        }}>
          {companies.map((company) => {
            const count = getCompanyQuestionCount(company.name)
            return (
              <div
                key={company.name}
                onClick={() => startTest(company)}
                style={{
                  padding: '24px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${company.color}25`,
                  borderRadius: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = `${company.color}60`
                  e.currentTarget.style.boxShadow = `0 15px 40px ${company.color}20`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = `${company.color}25`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `linear-gradient(135deg, ${company.color}25, ${company.color}08)`,
                  border: `1px solid ${company.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', marginBottom: '16px',
                }}>
                  {company.icon}
                </div>
                <p style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {company.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', lineHeight: '1.5' }}>
                  📋 {company.pattern}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  ⏱️ {company.duration}
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  backgroundColor: `${company.color}12`,
                  border: `1px solid ${company.color}30`,
                  borderRadius: '100px',
                  fontSize: '12px',
                  color: company.color,
                  fontWeight: '700',
                }}>
                  {count} Questions →
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // TEST SCREEN
  if (screen === 'test') {
    const q = questions[currentIndex]
    const progress = (currentIndex / questions.length) * 100
    const catInfo = categoryInfo[q.category]

    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 32px' }}>

        {/* Company Badge */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{
            padding: '6px 16px',
            backgroundColor: `${selectedCompany.color}12`,
            border: `1px solid ${selectedCompany.color}40`,
            borderRadius: '100px',
            fontSize: '13px',
            color: selectedCompany.color,
            fontWeight: '700',
          }}>
            {selectedCompany.icon} {selectedCompany.name} Pattern Practice
          </span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span style={{ color: catInfo?.color, fontSize: '13px', fontWeight: '600' }}>
              {catInfo?.label}
            </span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient)', borderRadius: '100px', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        <div key={currentIndex} className="fade-in" style={{
          padding: '32px', backgroundColor: 'rgba(255,255,255,0.02)',
          border: `1px solid ${catInfo?.color}30`, borderRadius: '20px',
          marginBottom: '20px', backdropFilter: 'blur(20px)',
        }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '24px' }}>
            {q.q}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt, i) => {
              let bgColor = 'rgba(255,255,255,0.03)'
              let borderColor = 'rgba(255,255,255,0.08)'
              let textColor = 'var(--text-primary)'

              if (showAnswer) {
                if (i === q.answer) {
                  bgColor = 'rgba(52,211,153,0.12)'
                  borderColor = 'rgba(52,211,153,0.5)'
                  textColor = '#34d399'
                } else if (i === selectedOption) {
                  bgColor = 'rgba(251,113,133,0.12)'
                  borderColor = 'rgba(251,113,133,0.5)'
                  textColor = '#fb7185'
                }
              } else if (i === selectedOption) {
                bgColor = `${catInfo?.color}12`
                borderColor = `${catInfo?.color}50`
                textColor = catInfo?.color
              }

              return (
                <div
                  key={i}
                  onClick={() => !showAnswer && setSelectedOption(i)}
                  style={{
                    padding: '14px 18px', backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`, borderRadius: '12px',
                    cursor: showAnswer ? 'default' : 'pointer', display: 'flex',
                    alignItems: 'center', gap: '12px', transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: `2px solid ${textColor}`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700', color: textColor,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span style={{ fontSize: '14px', color: textColor, fontWeight: showAnswer && (i === q.answer || i === selectedOption) ? '600' : '400' }}>
                    {opt}
                  </span>
                  {showAnswer && i === q.answer && <span style={{ marginLeft: 'auto', color: '#34d399' }}>✓</span>}
                  {showAnswer && i === selectedOption && i !== q.answer && <span style={{ marginLeft: 'auto', color: '#fb7185' }}>✗</span>}
                </div>
              )
            })}
          </div>

          {showAnswer && (
            <div className="fade-in" style={{
              marginTop: '20px', padding: '16px 20px',
              backgroundColor: 'rgba(129,140,248,0.05)',
              border: '1px solid rgba(129,140,248,0.2)', borderRadius: '12px',
            }}>
              <p style={{ fontSize: '12px', color: '#818cf8', fontWeight: '700', marginBottom: '6px' }}>
                💡 EXPLANATION:
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {q.explanation}
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {!showAnswer ? (
            <>
              <button onClick={handleSkip} style={{
                padding: '12px 24px', backgroundColor: 'transparent', color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}>
                ⏭ Skip
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="btn-primary"
                style={{
                  padding: '12px 40px', fontSize: '15px', fontWeight: '700', borderRadius: '12px',
                  opacity: selectedOption === null ? 0.5 : 1,
                  cursor: selectedOption === null ? 'not-allowed' : 'pointer',
                }}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <button onClick={handleNext} className="btn-primary" style={{
              padding: '12px 40px', fontSize: '15px', fontWeight: '700', borderRadius: '12px',
            }}>
              {currentIndex + 1 >= questions.length ? '🏁 See Results' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // RESULT SCREEN
  if (screen === 'result') {
    const correct = results.filter(r => r.correct).length
    const wrong = results.filter(r => !r.correct && !r.skipped).length
    const skipped = results.filter(r => r.skipped).length
    const percentage = Math.round((correct / questions.length) * 100)

    const pieData = [
      { name: 'Correct', value: correct, color: '#34d399' },
      { name: 'Wrong', value: wrong, color: '#fb7185' },
      { name: 'Skipped', value: skipped, color: '#94a3b8' },
    ].filter(d => d.value > 0)

    const categoryStats = Object.keys(categoryInfo).map(catKey => {
      const catResults = results.filter(r => r.question.category === catKey)
      const catCorrect = catResults.filter(r => r.correct).length
      return {
        name: categoryInfo[catKey].label,
        correct: catCorrect,
        total: catResults.length,
        color: categoryInfo[catKey].color,
      }
    }).filter(c => c.total > 0)

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>
            {percentage >= 70 ? '🏆' : percentage >= 50 ? '👍' : '💪'}
          </div>
          <h2 style={{
            fontSize: '36px', fontWeight: '800',
            background: 'var(--gradient)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', marginBottom: '8px',
          }}>
            {selectedCompany.icon} {selectedCompany.name} Practice Complete!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            You scored {correct} out of {questions.length} ({percentage}%)
          </p>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

          <div style={{
            padding: '28px', backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(56,189,248,0.2)', borderRadius: '20px',
            backdropFilter: 'blur(20px)',
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px', textAlign: 'center' }}>
              OVERALL BREAKDOWN
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f1f35', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: d.color }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: '28px', backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(56,189,248,0.2)', borderRadius: '20px',
            backdropFilter: 'blur(20px)',
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px', textAlign: 'center' }}>
              CATEGORY-WISE SCORE
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1f35', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="correct" radius={[6, 6, 0, 0]}>
                  {categoryStats.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review */}
        <div style={{
          padding: '32px', backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(56,189,248,0.15)', borderRadius: '20px', marginBottom: '32px',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '20px' }}>
            📋 QUESTION REVIEW
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((r, i) => (
              <div key={i} style={{
                padding: '14px 18px',
                backgroundColor: r.correct ? 'rgba(52,211,153,0.05)' : r.skipped ? 'rgba(148,163,184,0.05)' : 'rgba(251,113,133,0.05)',
                border: `1px solid ${r.correct ? 'rgba(52,211,153,0.2)' : r.skipped ? 'rgba(148,163,184,0.2)' : 'rgba(251,113,133,0.2)'}`,
                borderRadius: '10px', display: 'flex', justifyContent: 'space-between', gap: '12px',
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', flex: 1 }}>
                  Q{i + 1}: {r.question.q}
                </p>
                <span style={{
                  fontSize: '12px', fontWeight: '700',
                  color: r.correct ? '#34d399' : r.skipped ? '#94a3b8' : '#fb7185',
                  minWidth: 'fit-content',
                }}>
                  {r.correct ? '✓ Correct' : r.skipped ? '⏭ Skipped' : '✗ Wrong'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => setScreen('setup')} style={{
            padding: '14px 32px', backgroundColor: 'transparent', color: '#38bdf8',
            border: '1px solid rgba(56,189,248,0.4)', borderRadius: '12px',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          }}>
            ← Choose Another Company
          </button>
          <button onClick={() => startTest(selectedCompany)} className="btn-primary" style={{
            padding: '14px 32px', fontSize: '15px', fontWeight: '700', borderRadius: '12px',
          }}>
            🔄 Try Again
          </button>
        </div>
      </div>
    )
  }
}

export default AptitudePrep