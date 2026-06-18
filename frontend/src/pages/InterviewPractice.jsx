import { useState, useEffect, useRef, useCallback } from 'react'

// --- STRUCTURED QUESTION BANK (Exactly 5 Questions per Level) ---
const questionBank = {
  dotnet: {
    beginner: [
      {
        q: 'What is the difference between abstract class and interface in C#?',
        keywords: [['abstract', 'class'], ['interface'], ['inherit', 'multiple'], ['implementation', 'body'], ['constructor']],
        ideal: 'Abstract classes can provide default implementation and hold state/constructors; interfaces define a pure contract (though C# 8 allows default methods). A class can implement multiple interfaces but inherit only one class.'
      },
      {
        q: 'What is the difference between value types and reference types in C#?',
        keywords: [['value', 'struct', 'int'], ['reference', 'class', 'object'], ['stack'], ['heap'], ['pointer', 'memory']],
        ideal: 'Value types hold data directly and are allocated on the Stack. Reference types store references to data and are allocated on the Heap.'
      },
      {
        q: 'What is Boxing and Unboxing in C#?',
        keywords: [['boxing'], ['unboxing'], ['value', 'reference'], ['implicit', 'explicit'], ['heap', 'stack', 'object']],
        ideal: 'Boxing is converting a value type to a reference type (implicit). Unboxing is converting a reference type back to a value type (explicit).'
      },
      {
        q: 'Explain the difference between String and StringBuilder in C#.',
        keywords: [['immutable'], ['mutable'], ['stringbuilder'], ['memory', 'allocation'], ['performance', 'concat']],
        ideal: 'String is immutable, creating a new object on every alteration. StringBuilder is mutable, modifying the string within the same memory buffer, offering high performance for frequent updates.'
      },
      {
        q: 'What is an Exception and how do you handle it in C#?',
        keywords: [['try'], ['catch'], ['finally'], ['throw'], ['runtime', 'error', 'exception']],
        ideal: 'An exception is a runtime error. It is handled using try-catch blocks to intercept errors, and an optional finally block to clean up resources regardless of outcome.'
      }
    ],
    medium: [
      {
        q: 'What is the difference between ASP.NET MVC and ASP.NET Web API?',
        keywords: [['mvc'], ['web api', 'rest'], ['view', 'html'], ['json', 'xml', 'data'], ['http', 'controller']],
        ideal: 'MVC returns Views (HTML output for UI), while Web API returns formatted raw data (JSON/XML). MVC targets full-stack web apps, and Web API targets pure RESTful APIs.'
      },
      {
        q: 'Explain dependency injection in .NET Core and its lifetimes.',
        keywords: [['dependency', 'di', 'ioc', 'constructor injection'], ['singleton'], ['scoped'], ['transient'], ['container']],
        ideal: 'DI passes dependencies via constructors managed by an IoC container. Lifetimes: Transient (new per request), Scoped (once per HTTP request), Singleton (single instance across application life).'
      },
      {
        q: 'What is Entity Framework? Explain Code First vs Database First.',
        keywords: [['orm'], ['code first'], ['database first'], ['migration'], ['dbcontext', 'model']],
        ideal: 'EF is an object-relational mapper (ORM). Code First compiles C# classes into database tables using migrations. Database First generates C# entity context classes from a pre-existing database schema.'
      },
      {
        q: 'What is the difference between IEnumerable and IQueryable?',
        keywords: [['ienumerable'], ['iqueryable'], ['memory', 'client'], ['database', 'server', 'sql'], ['deferred', 'linq']],
        ideal: 'IEnumerable executes filtering in-memory on the client side. IQueryable builds an expression tree evaluated directly on the server database using optimized native SQL.'
      },
      {
        q: 'Explain async/await in C#. When should you use it?',
        keywords: [['async', 'await'], ['task'], ['non-blocking', 'asynchronous'], ['thread', 'pool'], ['io', 'network', 'db']],
        ideal: 'Async/await allows non-blocking execution of asynchronous operations. It releases threads back to the thread pool during waiting periods, maximizing scalability for intensive I/O operations.'
      }
    ],
    hard: [
      {
        q: 'What are the SOLID principles? Give a detailed real-world application example.',
        keywords: [['single responsibility', 'srp'], ['open closed', 'ocp'], ['liskov'], ['interface segregation', 'isp'], ['dependency inversion', 'dip']],
        ideal: 'S: Single Responsibility, O: Open/Closed (extend, don\'t modify), L: Liskov Substitution, I: Interface Segregation (lean interfaces), D: Dependency Inversion (inject abstractions).'
      },
      {
        q: 'What is middleware in ASP.NET Core and how does the pipeline work?',
        keywords: [['middleware'], ['pipeline'], ['next'], ['request', 'response'], ['invoke', 'use', 'run']],
        ideal: 'Middleware are structural software components chained sequentially in the HTTP execution pipeline. Each component can inspect/modify incoming requests and outgoing responses, deciding whether to invoke next().'
      },
      {
        q: 'Explain the Repository Pattern and Unit of Work.',
        keywords: [['repository'], ['unit of work'], ['data access', 'abstraction'], ['dbcontext', 'db'], ['transaction', 'commit']],
        ideal: 'The Repository pattern abstracts concrete data access queries. Unit of Work aggregates multiple repository actions inside a single coordinated database transaction to enforce transactional consistency.'
      },
      {
        q: 'What is LINQ? Explain deferred execution vs immediate execution.',
        keywords: [['linq'], ['deferred', 'lazy'], ['immediate', 'eager'], ['tolist', 'toarray'], ['query', 'execution']],
        ideal: 'LINQ maps queries to data collections. Deferred execution processes data only when enumerated (e.g., in a foreach). Immediate execution triggers query resolving instantly via operations like ToList() or ToArray().'
      },
      {
        q: 'How does garbage collection work in .NET? Explain Generations.',
        keywords: [['garbage collection', 'gc'], ['generation 0', 'gen 0'], ['generation 1', 'gen 1'], ['generation 2', 'gen 2'], ['heap', 'allocation', 'managed']],
        ideal: 'The .NET garbage collector automatically manages application memory across 3 generational tiers: Gen 0 (short-lived allocations), Gen 1 (survival buffer zone), and Gen 2 (long-lived state objects).'
      }
    ],
    premium: [
      {
        q: 'System Design: Design an enterprise-grade, real-time distributed notification system handling 100k requests/sec using the .NET ecosystem.',
        keywords: [['microservices'], ['signalr', 'websockets'], ['message queue', 'kafka', 'rabbitmq'], ['redis', 'cache'], ['scale', 'load balancer', 'distributed']],
        ideal: 'Leverage microservices using ASP.NET Core Web API processing into a message bus (Kafka/RabbitMQ). Distribute downstream traffic into a Redis-backed SignalR scale-out backplane for connection management.'
      },
      {
        q: 'Behavioral Challenge: Describe a situation where a critical database production deadlock occurred due to an architecture you approved, and how you led resolution under stress.',
        keywords: [['deadlock', 'incident'], ['star method', 'situation', 'task', 'action', 'result'], ['communication'], ['root cause', 'profiler'], ['mitigation', 'indexing']],
        ideal: 'Focus on rapid diagnostic transparency, structural performance monitoring (SQL Profiler), setting immediate application lock timeouts, and establishing standard query execution sequencing protocols.'
      },
      {
        q: 'Advanced Architecture: Explain CQRS and Event Sourcing patterns. What are the engineering tradeoffs?',
        keywords: [['cqrs'], ['event sourcing'], ['read', 'write'], ['separation'], ['consistency', 'eventual', 'replay', 'audit']],
        ideal: 'CQRS separates read queries from write commands. Event sourcing commits all state changes as an immutable sequence of events. Tradeoffs include high historical auditability vs eventual consistency latency.'
      },
      {
        q: 'Performance Engineering: How do you identify memory leaks and CPU spikes in a production .NET microservice? Explain tools and diagnostics.',
        keywords: [['memory leak', 'cpu spike'], ['dotnet-dump', 'dotnet-trace'], ['perfview'], ['memory dump', 'profiler'], ['diagnostic']],
        ideal: 'Utilize specialized diagnostic CLI tools like dotnet-dump and dotnet-trace to capture stack state. Analyze heap memory retention pathways using PerfView to safely isolate production issues.'
      },
      {
        q: 'Distributed Security: Design a secure token-based authentication and token revocation architecture for high-velocity decentralized multi-tenant microservices.',
        keywords: [['jwt', 'oauth2', 'oidc'], ['revocation', 'blacklist'], ['redis'], ['tenant', 'isolation'], ['gateway', 'api gateway']],
        ideal: 'Implement stateless JWT assertions verified at the API Gateway layer. Track revoked tokens using low-latency distributed global Redis blacklists with TTL expirations corresponding to token life cycles.'
      }
    ]
  },
  frontend: {
    beginner: [
      { q: 'What is the difference between let, var, and const in JavaScript?', keywords: [['scope'], ['block'], ['hoisting'], ['reassign'], ['const', 'let', 'var']], ideal: 'var is function scoped. let and const are block scoped. const prevents reassignment.' },
      { q: 'What is the difference between == and === in JavaScript?', keywords: [['strict'], ['loose'], ['type', 'coercion'], ['equality']], ideal: '== checks values with coercion. === checks value and type strictly.' },
      { q: 'What is the DOM in web development?', keywords: [['dom', 'document object model'], ['tree', 'structure'], ['html'], ['javascript']], ideal: 'The DOM represents HTML documents as objects to change document structure, style, and content via JS.' },
      { q: 'Explain basic CSS positioning values.', keywords: [['static'], ['relative'], ['absolute'], ['fixed'], ['sticky']], ideal: 'Static is default. Relative shifts based on normal flow. Absolute coordinates relative to closest positioned parent.' },
      { q: 'What are semantic HTML tags and why are they used?', keywords: [['semantic'], ['accessibility', 'a11y'], ['seo'], ['meaning', 'structure']], ideal: 'Tags like header, nav, footer give explicit meaning to layout, helping SEO and browser parsing tools.' }
    ],
    medium: [
      { q: 'Explain the Virtual DOM in React.', keywords: [['virtual dom'], ['real dom'], ['reconciliation'], ['diffing']], ideal: 'An in-memory representation of real UI elements. React diffs it with the actual DOM and calculates optimized atomic re-renders.' },
      { q: 'What are React hooks? Explain useState and useEffect.', keywords: [['hooks'], ['usestate', 'state'], ['useeffect', 'side effect'], ['lifecycle']], ideal: 'Hooks allow functional parts to retain states. useState captures internal parameters, useEffect manages side-effects.' },
      { q: 'What is CSS Flexbox vs Grid? When to use which?', keywords: [['flexbox'], ['grid'], ['one dimension', '1d'], ['two dimension', '2d']], ideal: 'Flexbox works along one dimensional axis (rows OR columns). Grid operates across both rows and columns at the same time.' },
      { q: 'What is event bubbling and event delegation in JavaScript?', keywords: [['bubbling'], ['delegation'], ['propagation'], ['listener']], ideal: 'Bubbling flows upward through structural nodes. Delegation registers an event parent handler to supervise children updates.' },
      { q: 'Explain closure in JavaScript.', keywords: [['closure'], ['scope'], ['lexical'], ['outer']], ideal: 'A closure means an inner block remembers variables defined in its outer declaration scope even after invocation.' }
    ],
    hard: [
      { q: 'Explain the React component lifecycle in functional components vs class components.', keywords: [['lifecycle'], ['useeffect'], ['componentdidmount'], ['componentwillunmount']], ideal: 'Class components use explicitly named lifecycle hooks. Functional ones match them using useEffect hooks combined with unmount cleanup returns.' },
      { q: 'What is a Promise in JavaScript? Detail all execution states.', keywords: [['promise'], ['pending'], ['fulfilled', 'resolved'], ['rejected']], ideal: 'Promises supervise delayed routines, transitioning safely through Pending, Fulfilled, or Rejected states.' },
      { q: 'What is responsive design? How do you implement it?', keywords: [['responsive'], ['media query'], ['breakpoint'], ['viewport']], ideal: 'Flexible presentation grids adjusting using programmatic media viewport threshold rules.' },
      { q: 'Explain State Management alternatives in complex frontend applications.', keywords: [['redux', 'toolkit'], ['context api'], ['zustand'], ['global', 'state']], ideal: 'Context API serves direct values, whereas systems like Redux or Zustand manage complex concurrent state modifications safely.' },
      { q: 'What is Webpack or Vite? Explain the compilation bundling process.', keywords: [['bundler', 'vite', 'webpack'], ['dependency'], ['module'], ['optimization']], ideal: 'Tools traversing standard dependency imports to output compressed structural production assets safely.' }
    ],
    premium: [
      { q: 'System Design: Architect a high-performance web dashboard with 50,000 active connections streaming real-time data.', keywords: [['websockets'], ['web workers'], ['virtual list', 'windowing'], ['canvas']], ideal: 'Establish processing over WebSockets inside dedicated Background Workers. Paint the components via specialized virtualization frames.' },
      { q: 'Behavioral Challenge: Discuss how you successfully negotiated technical debt with product management.', keywords: [['technical debt'], ['metrics'], ['business', 'value'], ['negotiation']], ideal: 'Frame engineering maintenance tasks using clear metric returns (Lighthouse scores vs product attrition values) to acquire timeline space.' },
      { q: 'Advanced Core: Deep dive into the JavaScript engine. Explain the Event Loop, Call Stack, Task Queue, and Microtask Queue.', keywords: [['event loop'], ['call stack'], ['task queue'], ['microtask queue']], ideal: 'Synchronized actions run on the Call Stack. Microtasks take immediate priority clearance over macrotask cycles through the Event Loop.' },
      { q: 'Frontend Security: Architect a complete defensive client security strategy covering XSS, CSRF, and Clickjacking.', keywords: [['xss', 'csrf'], ['csp', 'content security policy'], ['httponly'], ['sameite']], ideal: 'Deploy strict Content Security Policies, pass key session properties via HttpOnly cookies, and configure SameSite validation rules.' },
      { q: 'Web Performance: Detail advanced optimization techniques for a core web vitals score improvement campaign.', keywords: [['core web vitals'], ['inp'], ['lcp', 'fid', 'cls'], ['code splitting']], ideal: 'Implement dynamic chunk splitting, schedule rendering tasks, and optimize layout shifts (CLS).' }
    ]
  }
}

// Fallbacks for compatibility
questionBank.fullstack = JSON.parse(JSON.stringify(questionBank.frontend))
questionBank.qa = JSON.parse(JSON.stringify(questionBank.dotnet))

const roles = [
  { value: 'dotnet', label: '⚙️ .NET Developer' },
  { value: 'frontend', label: '🎨 Frontend Developer' },
  { value: 'fullstack', label: '🚀 Full Stack Developer' },
  { value: 'qa', label: '🧪 QA Tester' },
]

const levels = [
  { value: 'beginner', label: '🟢 Beginner' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'hard', label: '🔴 Hard' },
  { value: 'premium', label: '⭐ Premium', isPremium: true }
]

// --- BETTER ANSWER VALIDATION ENGINE ---
function evaluateUserAnswer(answer, keywordGroups) {
  if (!answer || !answer.trim()) {
    return { score: 0, techAccuracy: 0, keywordCoverage: 0, commQuality: 0, matched: [], missed: keywordGroups.map(g => g[0]) }
  }

  const cleanedAnswer = answer.toLowerCase()
  let matchedCount = 0
  const matchedList = []
  const missedList = []

  // Support multiple keyword groups / synonym matching
  keywordGroups.forEach(group => {
    const groupMatched = group.some(synonym => cleanedAnswer.includes(synonym.toLowerCase()))
    if (groupMatched) {
      matchedCount++
      matchedList.push(group[0]) // Return primary name
    } else {
      missedList.push(group[0])
    }
  })

  // Calculations for partial scoring
  const keywordCoverage = Math.round((matchedCount / keywordGroups.length) * 100)
  
  const wordCount = answer.trim().split(/\s+/).length
  let commQuality = 50
  if (wordCount > 15) commQuality = 75
  if (wordCount > 30) commQuality = 100
  if (wordCount < 6) commQuality = 20

  const techAccuracy = Math.max(0, Math.min(100, keywordCoverage * 1.1 - (missedList.length * 1.5)))
  const finalScore = Math.round((techAccuracy * 0.5) + (keywordCoverage * 0.3) + (commQuality * 0.2))

  return {
    score: finalScore,
    techAccuracy: Math.round(techAccuracy),
    keywordCoverage: Math.round(keywordCoverage),
    commQuality: Math.round(commQuality),
    matched: matchedList,
    missed: missedList
  }
}

function InterviewPractice() {
  const [screen, setScreen] = useState('setup') // setup, practice, transition, result
  const [selectedRole, setSelectedRole] = useState('dotnet')
  const [currentLevel, setCurrentLevel] = useState('beginner')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(120)
  const [isListening, setIsListening] = useState(false)
  const [showIdeal, setShowIdeal] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  // Explicit global result states to decouple and prevent empty array map crashes
  const [sessionResults, setSessionResults] = useState({
    overall: 0, tech: 0, keyword: 0, comm: 0,
    strengths: [], weaknesses: [], logs: []
  })

  const timerRef = useRef(null)
  const recognitionRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  // Camera Management Hook
  useEffect(() => {
    if (cameraActive) {
      navigator.mediaDevices.getUserMedia({ video: { width: 240, height: 180 } })
        .then(stream => {
          streamRef.current = stream
          if (videoRef.current) videoRef.current.srcObject = stream
        })
        .catch(err => {
          console.error("Camera connection error: ", err)
          setCameraActive(false)
        })
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [cameraActive, stopCamera])

  const startPracticeSession = (levelToUse = currentLevel) => {
    const targetPool = questionBank[selectedRole]?.[levelToUse] || []
    const selectedQuestions = [...targetPool].slice(0, 5) // Grab the 5 level questions
    
    setQuestions(selectedQuestions)
    setCurrentIndex(0)
    setAnswers([])
    setCurrentAnswer('')
    setTimeLeft(120)
    setShowIdeal(false)
    setScreen('practice')
  }

  // Speech Recognition Handling
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech API is not supported in this browser.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setCurrentAnswer(transcript)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  // Safe Metric Compiler
  const compileFinalDashboardMetrics = useCallback((finalAnswers) => {
    let sumScore = 0, sumTech = 0, sumKeyword = 0, sumComm = 0
    let missedPool = []
    let hitPool = []

    finalAnswers.forEach(ans => {
      sumScore += ans.evaluation.score
      sumTech += ans.evaluation.techAccuracy
      sumKeyword += ans.evaluation.keywordCoverage
      sumComm += ans.evaluation.commQuality
      
      missedPool.push(...ans.evaluation.missed)
      hitPool.push(...ans.evaluation.matched)
    })

    const len = finalAnswers.length || 1
    
    setSessionResults({
      overall: Math.round(sumScore / len),
      tech: Math.round(sumTech / len),
      keyword: Math.round(sumKeyword / len),
      comm: Math.round(sumComm / len),
      strengths: [...new Set(hitPool)].slice(0, 3),
      weaknesses: [...new Set(missedPool)].slice(0, 3),
      logs: finalAnswers
    })
  }, [])

  const handleNextQuestion = useCallback((autoSkip = false) => {
    stopListening()
    
    const evaluation = evaluateUserAnswer(
      currentAnswer,
      questions[currentIndex]?.keywords || []
    )

    const nextAnswerObject = {
      question: questions[currentIndex]?.q,
      answer: currentAnswer,
      skipped: autoSkip || !currentAnswer.trim(),
      evaluation,
      ideal: questions[currentIndex]?.ideal
    }

    const updatedAnswers = [...answers, nextAnswerObject]
    setAnswers(updatedAnswers)
    setCurrentAnswer('')
    setTimeLeft(120)
    setShowIdeal(false)

    if (currentIndex + 1 >= questions.length) {
      clearInterval(timerRef.current)
      compileFinalDashboardMetrics(updatedAnswers)
      setScreen('transition')
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [answers, compileFinalDashboardMetrics, currentAnswer, currentIndex, questions, stopListening])

  // Timer Effect
  useEffect(() => {
    if (screen !== 'practice') return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion(true)
          return 120
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [screen, currentIndex, questions, handleNextQuestion])

  const proceedToNextLevel = () => {
    const levelOrder = ['beginner', 'medium', 'hard', 'premium']
    const nextIdx = levelOrder.indexOf(currentLevel) + 1
    if (nextIdx < levelOrder.length) {
      const nextLvl = levelOrder[nextIdx]
      setCurrentLevel(nextLvl)
      startPracticeSession(nextLvl)
    } else {
      setScreen('result')
    }
  }

  const getSafeScore = (val) => {
    const score = Number(val)
    if (!Number.isFinite(score)) return 0
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  const CELL_COLORS = ['#38bdf8', '#334155']

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', paddingBottom: '60px' }}>
      
      {/* Floating Camera Window */}
      <div style={{ position: 'fixed', top: '88px', right: '20px', zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <button 
          onClick={() => setCameraActive(!cameraActive)}
          style={{
            padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
            backgroundColor: cameraActive ? '#ef4444' : '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {cameraActive ? '🎥 Close Cam' : '📹 Toggle Camera Feed'}
        </button>
        {cameraActive && (
          <div style={{ width: '180px', height: '135px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #38bdf8', backgroundColor: '#000' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* SETUP VIEW */}
        {screen === 'setup' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ padding: '6px 16px', backgroundColor: 'rgba(56,189,248,0.1)', border: '1px solid #38bdf8', borderRadius: '100px', fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
                Simulator Console Active
              </span>
              <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '16px', color: '#f8fafc' }}>
                AI Interview Practice Module
              </h1>
            </div>

            {/* Role Track Options */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '16px' }}>SELECT INTERVIEW ROLE</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {roles.map(r => (
                  <div key={r.value} onClick={() => setSelectedRole(r.value)} style={{
                    padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                    backgroundColor: selectedRole === r.value ? 'rgba(56,189,248,0.1)' : '#111827',
                    border: selectedRole === r.value ? '2px solid #38bdf8' : '1px solid #334155',
                    color: selectedRole === r.value ? '#38bdf8' : '#f8fafc', fontWeight: '600'
                  }}>
                    {r.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Levels and Progression Matrix */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', marginBottom: '16px' }}>DIFFICULTY PATHWAYS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {levels.map(lvl => {
                  const isSelected = currentLevel === lvl.value
                  return (
                    <div 
                      key={lvl.value} 
                      onClick={() => setCurrentLevel(lvl.value)}
                      style={{
                        padding: '20px', borderRadius: '12px', cursor: 'pointer', position: 'relative',
                        backgroundColor: isSelected ? 'rgba(56,189,248,0.05)' : '#111827',
                        border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                        boxShadow: lvl.isPremium ? '0 0 15px rgba(168,85,247,0.4)' : 'none',
                      }}
                    >
                      {lvl.isPremium && (
                        <div style={{
                          position: 'absolute', top: '10px', right: '10px',
                          backgroundColor: '#a855f7', color: '#fff', fontSize: '9px',
                          padding: '2px 8px', borderRadius: '100px', fontWeight: 'bold',
                          boxShadow: '0 0 8px #a855f7'
                        }}>
                          ⭐ PREMIUM UNLOCKED
                        </div>
                      )}
                      <div style={{ fontWeight: '700', fontSize: '16px', color: '#f8fafc' }}>
                        {lvl.label}
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', margin: 0 }}>
                        {lvl.isPremium ? 'Advanced Architecture & System Challenges.' : '5 technical questions to test competency.'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => startPracticeSession()}
                style={{
                  padding: '16px 40px', fontSize: '16px', fontWeight: '700',
                  borderRadius: '12px', border: 'none', color: '#0f172a',
                  backgroundColor: '#38bdf8', cursor: 'pointer', boxShadow: '0 4px 14px rgba(56,189,248,0.3)'
                }}
              >
                Start Practice Session
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE RUNNING PRACTICE SCREEN */}
        {screen === 'practice' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#38bdf8', marginRight: '12px' }}>
                  {levels.find(l => l.value === currentLevel)?.label}
                </span>
                <span style={{ backgroundColor: '#334155', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                  Question {currentIndex + 1}/5
                </span>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                Track: {roles.find(r => r.value === selectedRole)?.label}
              </span>
            </div>

            {/* Timer Display */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'monospace', fontSize: '22px', fontWeight: '700',
                padding: '6px 20px', borderRadius: '100px', backgroundColor: '#111827',
                border: '1px solid #334155', color: timeLeft < 30 ? '#f43f5e' : '#10b981'
              }}>
                ⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {/* Main Question Window */}
            <div style={{
              backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px',
              padding: '28px', marginBottom: '24px', boxShadow: currentLevel === 'premium' ? '0 0 25px rgba(168,85,247,0.15)' : 'none'
            }}>
              <p style={{ fontSize: '20px', fontWeight: '600', lineHeight: '1.6', color: '#f8fafc', margin: 0 }}>
                {questions[currentIndex]?.q}
              </p>
            </div>

            {/* Textarea Entry and Dictation */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>YOUR RESPONSE</label>
                <button 
                  onClick={isListening ? stopListening : startListening}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                    backgroundColor: isListening ? '#ef4444' : '#10b981', color: '#fff'
                  }}
                >
                  {isListening ? '🛑 Stop Recording' : '🎤 Speech to Text'}
                </button>
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your explanation or core technical statements here..."
                style={{
                  width: '100%', height: '160px', backgroundColor: '#0f172a', border: '1px solid #334155',
                  borderRadius: '12px', color: '#f8fafc', padding: '16px', fontSize: '15px', lineHeight: '1.6',
                  resize: 'none', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            {showIdeal && (
              <div style={{ padding: '20px', backgroundColor: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '12px', marginBottom: '24px' }}>
                <h5 style={{ margin: '0 0 6px 0', color: '#38bdf8', fontSize: '13px', fontWeight: '700' }}>💡 IDEAL REFERENCE GUIDE</h5>
                <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', lineHeight: '1.5' }}>{questions[currentIndex]?.ideal}</p>
              </div>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowIdeal(!showIdeal)} style={{ padding: '12px 20px', borderRadius: '10px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', cursor: 'pointer' }}>
                {showIdeal ? 'Hide Guide' : 'Reveal Reference Guide'}
              </button>
              <button onClick={() => handleNextQuestion(true)} style={{ padding: '12px 20px', borderRadius: '10px', backgroundColor: 'transparent', color: '#f43f5e', border: 'none', cursor: 'pointer' }}>
                Skip
              </button>
              <button 
                onClick={() => handleNextQuestion(false)}
                style={{ padding: '12px 28px', borderRadius: '10px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: '700', border: 'none', cursor: 'pointer' }}
              >
                {currentIndex + 1 >= questions.length ? 'Finish & Grade' : 'Next Question'}
              </button>
            </div>
          </div>
        )}

        {/* TRANSITION SPLIT LEVEL COMPLETED VIEW */}
        {screen === 'transition' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {levels.find(l => l.value === currentLevel)?.label} Tier Complete!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '32px' }}>
              Your answers have been graded. Review your breakdown metrics now or advance to the next difficulty level.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => setScreen('result')}
                style={{ padding: '14px 24px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f8fafc', cursor: 'pointer', fontWeight: '600' }}
              >
                📊 View Analytics Dashboard
              </button>
              
              {currentLevel !== 'premium' ? (
                <button 
                  onClick={proceedToNextLevel}
                  style={{ padding: '14px 28px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                >
                  Continue to Next Level →
                </button>
              ) : (
                <button 
                  onClick={() => setScreen('result')}
                  style={{ padding: '14px 28px', borderRadius: '10px', border: 'none', backgroundColor: '#a855f7', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                >
                  Inspect Final Report
                </button>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS RESULT SCREEN */}
        {screen === 'result' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Interview Performance Metrics</h2>
            <p style={{ color: '#94a3b8', marginBottom: '32px', marginTop: 0 }}>Automated grading results matching structural patterns and keyword matrices.</p>

            {/* Responsive Donut Chart Array */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '40px' }}>
              {[
                { label: 'Overall Rating', val: sessionResults.overall },
                { label: 'Technical Depth', val: sessionResults.tech },
                { label: 'Keyword Match', val: sessionResults.keyword },
                { label: 'Communication', val: sessionResults.comm }
              ].map((chart, idx) => {
                const safeScore = getSafeScore(chart.val)
                const radius = 38
                const circumference = 2 * Math.PI * radius
                const strokeOffset = circumference - (safeScore / 100) * circumference
                return (
                <div key={idx} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px 10px', textAlign: 'center' }}>
                  <div style={{ width: '100px', height: '100px', position: 'relative', margin: '0 auto' }}>
                    <svg width="100" height="100" viewBox="0 0 100 100" style={{ display: 'block', transform: 'rotate(-90deg)' }}>
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={CELL_COLORS[1]}
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={CELL_COLORS[0]}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                      />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15px', fontWeight: '800', color: '#f8fafc' }}>
                      {safeScore}%
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginTop: '8px' }}>{chart.label}</div>
                </div>
              )})}
            </div>

            {/* Keyword Strengths and Weaknesses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#10b981', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>💪 KEY STRENGTH AREAS</h4>
                {sessionResults.strengths.length > 0 ? sessionResults.strengths.map((s, i) => (
                  <div key={i} style={{ padding: '10px 12px', backgroundColor: '#111827', borderRadius: '8px', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>
                    ✦ Demonstrated fluency: <span style={{ color: '#38bdf8' }}>{s}</span>
                  </div>
                )) : <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>No primary strengths matched during this round.</p>}
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#f43f5e', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>💡 IMPROVEMENT SUGGESTIONS</h4>
                {sessionResults.weaknesses.length > 0 ? sessionResults.weaknesses.map((w, i) => (
                  <div key={i} style={{ padding: '10px 12px', backgroundColor: '#111827', borderRadius: '8px', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>
                    ⚠️ Focus more on: <span style={{ color: '#f43f5e' }}>{w}</span>
                  </div>
                )) : <p style={{ fontSize: '13px', color: '#10b981', margin: 0 }}>Excellent! You hit all major verification criteria parameters.</p>}
              </div>
            </div>

            {/* Answer Itemized Logs */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155', marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Granular Question Log Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sessionResults.logs.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '18px', border: '1px solid #334155' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: '600', fontSize: '14px', color: '#f8fafc' }}>Q{idx + 1}: {item.question}</p>
                    <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px' }}>
                      Your Answer: "{item.answer || '[Question skipped or left blank]'}"
                    </p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
                      <span>Technical Score: {item.evaluation?.techAccuracy}%</span>
                      <span>Keyword Match: {item.evaluation?.keywordCoverage}%</span>
                      <span>Overall Answer Rank: {item.evaluation?.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => { setScreen('setup'); setCurrentLevel('beginner'); }}
                style={{ padding: '14px 36px', borderRadius: '10px', border: 'none', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: '700', cursor: 'pointer' }}
              >
                🔄 Reset Practice Module
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default InterviewPractice
