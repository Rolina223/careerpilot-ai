import { useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const questionBank = [
  { id: 1, category: 'arrays', companies: ['TCS', 'Infosys', 'Generic'], q: 'What will be the output?\n\nint[] arr = {1, 2, 3, 4, 5};\nint sum = 0;\nfor(int i=0; i<arr.length; i++) {\n  sum += arr[i];\n}\nprint(sum);', options: ['10', '15', '20', '14'], answer: 1, explanation: 'Sum of 1+2+3+4+5 = 15' },
  { id: 2, category: 'arrays', companies: ['Wipro', 'Cognizant', 'Generic'], q: 'What is the time complexity of linear search in an array of size n?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, explanation: 'Linear search checks each element once, so it is O(n).' },
  { id: 3, category: 'arrays', companies: ['TCS', 'Accenture', 'Generic'], q: 'What will be the output?\n\nint[] arr = {5, 3, 8, 1};\nint max = arr[0];\nfor(int i=1; i<arr.length; i++) {\n  if(arr[i] > max) max = arr[i];\n}\nprint(max);', options: ['5', '3', '8', '1'], answer: 2, explanation: 'Loop finds the maximum value, which is 8.' },
  { id: 4, category: 'arrays', companies: ['Infosys', 'Cognizant', 'Generic'], q: 'Which method is used to reverse an array in most languages?', options: ['sort()', 'reverse()', 'flip()', 'invert()'], answer: 1, explanation: 'reverse() is the standard method to reverse array elements.' },
  { id: 5, category: 'arrays', companies: ['TCS', 'Wipro', 'Generic'], q: 'What will arr.length return for: int[] arr = new int[10];', options: ['9', '10', '0', 'Error'], answer: 1, explanation: 'Array of size 10 has length property = 10.' },
  { id: 6, category: 'arrays', companies: ['Accenture', 'Cognizant', 'Generic'], q: 'What is the index of the first element in a 0-indexed array?', options: ['1', '0', '-1', 'Depends on language'], answer: 1, explanation: 'Most languages (C, Java, JS, C#) use 0-based indexing.' },
  { id: 7, category: 'arrays', companies: ['TCS', 'Infosys', 'Generic'], q: 'What will be the output?\n\nint[] arr = {2, 4, 6, 8};\nprint(arr[arr.length - 1]);', options: ['2', '4', '6', '8'], answer: 3, explanation: 'arr.length-1 = 3, arr[3] = 8 (last element).' },
  { id: 8, category: 'arrays', companies: ['Wipro', 'Accenture', 'Generic'], q: 'Two pointer technique is commonly used for which problem?', options: ['Sorting', 'Finding pair with given sum', 'Searching in tree', 'Graph traversal'], answer: 1, explanation: 'Two pointer technique is efficient for finding pairs with a target sum in sorted arrays.' },
  { id: 9, category: 'strings', companies: ['TCS', 'Cognizant', 'Generic'], q: 'What will be the output?\n\nstring s = "Hello";\nprint(s.length());', options: ['4', '5', '6', 'Error'], answer: 1, explanation: '"Hello" has 5 characters: H-e-l-l-o.' },
  { id: 10, category: 'strings', companies: ['Infosys', 'Wipro', 'Generic'], q: 'What does s.toUpperCase() do to "hello"?', options: ['"hello"', '"HELLO"', '"Hello"', 'Error'], answer: 1, explanation: 'toUpperCase() converts all characters to uppercase: "HELLO".' },
  { id: 11, category: 'strings', companies: ['TCS', 'Accenture', 'Generic'], q: 'How do you check if a string is a palindrome?', options: ['Compare with sorted string', 'Compare string with its reverse', 'Count vowels', 'Check length'], answer: 1, explanation: 'A palindrome reads the same forwards and backwards, so compare with its reverse.' },
  { id: 12, category: 'strings', companies: ['Cognizant', 'Accenture', 'Generic'], q: 'What will be the output?\n\nstring s1 = "abc";\nstring s2 = "abc";\nprint(s1 == s2);', options: ['true', 'false', 'Error', 'Depends on memory address'], answer: 0, explanation: 'String content comparison in most languages with == for equal strings returns true.' },
  { id: 13, category: 'strings', companies: ['TCS', 'Wipro', 'Generic'], q: 'Which method is used to split a string by a delimiter?', options: ['split()', 'join()', 'concat()', 'slice()'], answer: 0, explanation: 'split() divides a string into an array based on a delimiter.' },
  { id: 14, category: 'strings', companies: ['Infosys', 'Cognizant', 'Generic'], q: 'What will substring("Hello World", 0, 5) return?', options: ['"Hello"', '"World"', '"Hello "', 'Error'], answer: 0, explanation: 'substring(0,5) returns characters from index 0 to 4 = "Hello".' },
  { id: 15, category: 'strings', companies: ['TCS', 'Infosys', 'Generic'], q: 'How do you count vowels efficiently in a string?', options: ['Use a Set/array of vowels and loop', 'Sort the string', 'Reverse the string', 'Use binary search'], answer: 0, explanation: 'Loop through string, check each char against a set of vowels {a,e,i,o,u}.' },
  { id: 16, category: 'strings', companies: ['Wipro', 'Accenture', 'Generic'], q: 'What is string immutability?', options: ['Strings can be changed in place', 'Strings cannot be changed once created', 'Strings are always uppercase', 'Strings have no length'], answer: 1, explanation: 'In languages like Java, C#, JS — strings are immutable; modifying creates a new string.' },
  { id: 17, category: 'pseudocode', companies: ['TCS', 'Infosys', 'Generic'], q: 'What will be the output?\n\nint x = 5, y = 10;\nx = x + y;\ny = x - y;\nprint(x, y);', options: ['15, 5', '5, 10', '15, 10', '10, 5'], answer: 0, explanation: 'x=5+10=15. y=15-10=5. Output: 15, 5' },
  { id: 18, category: 'pseudocode', companies: ['Wipro', 'Cognizant', 'Generic'], q: 'What will be the output?\n\nint i = 0;\nwhile(i < 5) {\n  print(i);\n  i++;\n}', options: ['0 1 2 3 4', '1 2 3 4 5', '0 1 2 3 4 5', 'Infinite loop'], answer: 0, explanation: 'Loop runs while i<5, printing 0,1,2,3,4 then exits when i=5.' },
  { id: 19, category: 'pseudocode', companies: ['TCS', 'Accenture', 'Generic'], q: 'What will be the output?\n\nint a = 10;\nint b = 3;\nprint(a % b);', options: ['3', '1', '0', '3.33'], answer: 1, explanation: '10 % 3 = 1 (remainder of division).' },
  { id: 20, category: 'pseudocode', companies: ['Infosys', 'Cognizant', 'Generic'], q: 'What is the output?\n\nfor(int i=1; i<=3; i++) {\n  for(int j=1; j<=2; j++) {\n    print(i*j);\n  }\n}', options: ['1 2 2 4 3 6', '1 2 3 4 5 6', '1 1 2 2 3 3', '2 4 6'], answer: 0, explanation: 'i=1: j=1→1, j=2→2. i=2: j=1→2, j=2→4. i=3: j=1→3, j=2→6. Output: 1 2 2 4 3 6' },
  { id: 21, category: 'pseudocode', companies: ['TCS', 'Wipro', 'Generic'], q: 'What will be the output?\n\nbool flag = true;\nif(!flag) {\n  print("A");\n} else {\n  print("B");\n}', options: ['A', 'B', 'true', 'Error'], answer: 1, explanation: '!flag = !true = false, so else block runs, printing "B".' },
  { id: 22, category: 'pseudocode', companies: ['Cognizant', 'Accenture', 'Generic'], q: 'What is the output?\n\nint x = 1;\ndo {\n  print(x);\n  x++;\n} while(x <= 3);', options: ['1 2 3', '1 2', '0 1 2', '1 2 3 4'], answer: 0, explanation: 'do-while executes once then checks. Prints 1, 2, 3 then x=4 fails condition.' },
  { id: 23, category: 'pseudocode', companies: ['TCS', 'Infosys', 'Generic'], q: 'What is the time complexity of this code?\n\nfor(int i=0; i<n; i++) {\n  for(int j=0; j<n; j++) {\n    print(i,j);\n  }\n}', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 2, explanation: 'Nested loop running n times each = O(n²).' },
  { id: 24, category: 'pseudocode', companies: ['Wipro', 'Accenture', 'Generic'], q: 'What will be the output?\n\nint arr[] = {1,2,3};\nint sum=0;\nfor(int val : arr) {\n  sum += val;\n}\nprint(sum);', options: ['3', '6', '1', 'Error'], answer: 1, explanation: 'For-each loop sums all elements: 1+2+3=6.' },
]

const codingProblems = [
  {
    id: 1,
    title: 'Reverse a String',
    difficulty: 'Easy',
    companies: ['TCS', 'Infosys', 'Wipro', 'Generic'],
    description: 'Write a function that reverses a string without using built-in reverse() method.',
    example: { input: '"hello"', output: '"olleh"' },
    csharp: `string ReverseString(string s) {\n    char[] arr = s.ToCharArray();\n    int left = 0, right = arr.Length - 1;\n    while (left < right) {\n        char temp = arr[left];\n        arr[left] = arr[right];\n        arr[right] = temp;\n        left++;\n        right--;\n    }\n    return new string(arr);\n}`,
    javascript: `function reverseString(s) {\n  let arr = s.split('');\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  return arr.join('');\n}`,
    explanation: 'Use two pointers — one at start, one at end. Swap characters and move pointers toward center until they meet.',
  },
  {
    id: 2,
    title: 'Find Duplicate in Array',
    difficulty: 'Easy',
    companies: ['TCS', 'Cognizant', 'Generic'],
    description: 'Given an array of integers, find if any element appears more than once.',
    example: { input: '[1, 2, 3, 4, 2]', output: 'true (2 is duplicate)' },
    csharp: `bool HasDuplicate(int[] arr) {\n    HashSet<int> seen = new HashSet<int>();\n    foreach (int num in arr) {\n        if (seen.Contains(num)) return true;\n        seen.Add(num);\n    }\n    return false;\n}`,
    javascript: `function hasDuplicate(arr) {\n  const seen = new Set();\n  for (let num of arr) {\n    if (seen.has(num)) return true;\n    seen.add(num);\n  }\n  return false;\n}`,
    explanation: 'Use a HashSet/Set to track seen elements. If an element is already in the set, it is a duplicate. This is O(n) time.',
  },
  {
    id: 3,
    title: 'FizzBuzz',
    difficulty: 'Easy',
    companies: ['Infosys', 'Wipro', 'Accenture', 'Generic'],
    description: 'Print numbers 1 to n. If divisible by 3 print "Fizz", by 5 print "Buzz", by both print "FizzBuzz".',
    example: { input: 'n = 15', output: '1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz' },
    csharp: `void FizzBuzz(int n) {\n    for (int i = 1; i <= n; i++) {\n        if (i % 15 == 0) Console.WriteLine("FizzBuzz");\n        else if (i % 3 == 0) Console.WriteLine("Fizz");\n        else if (i % 5 == 0) Console.WriteLine("Buzz");\n        else Console.WriteLine(i);\n    }\n}`,
    javascript: `function fizzBuzz(n) {\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) console.log("FizzBuzz");\n    else if (i % 3 === 0) console.log("Fizz");\n    else if (i % 5 === 0) console.log("Buzz");\n    else console.log(i);\n  }\n}`,
    explanation: 'Check divisibility by 15 first (covers both 3 and 5), then 3, then 5, else print the number itself.',
  },
  {
    id: 4,
    title: 'Check Palindrome',
    difficulty: 'Easy',
    companies: ['TCS', 'Accenture', 'Generic'],
    description: 'Check if a given string is a palindrome (reads same forwards and backwards).',
    example: { input: '"madam"', output: 'true' },
    csharp: `bool IsPalindrome(string s) {\n    int left = 0, right = s.Length - 1;\n    while (left < right) {\n        if (s[left] != s[right]) return false;\n        left++;\n        right--;\n    }\n    return true;\n}`,
    javascript: `function isPalindrome(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    if (s[left] !== s[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}`,
    explanation: 'Use two pointers from both ends moving inward. If any pair of characters do not match, it is not a palindrome.',
  },
  {
    id: 5,
    title: 'Find Maximum Subarray Sum',
    difficulty: 'Medium',
    companies: ['Cognizant', 'Wipro', 'Generic'],
    description: 'Find the contiguous subarray with the largest sum (Kadane\'s Algorithm).',
    example: { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6 (subarray [4,-1,2,1])' },
    csharp: `int MaxSubArray(int[] nums) {\n    int maxSum = nums[0], currentSum = nums[0];\n    for (int i = 1; i < nums.Length; i++) {\n        currentSum = Math.Max(nums[i], currentSum + nums[i]);\n        maxSum = Math.Max(maxSum, currentSum);\n    }\n    return maxSum;\n}`,
    javascript: `function maxSubArray(nums) {\n  let maxSum = nums[0], currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}`,
    explanation: 'Kadane\'s Algorithm: track running sum, reset to current element if sum becomes negative, keep track of max seen so far.',
  },
  {
    id: 6,
    title: 'Count Vowels in a String',
    difficulty: 'Easy',
    companies: ['TCS', 'Infosys', 'Generic'],
    description: 'Count the number of vowels (a,e,i,o,u) in a given string.',
    example: { input: '"hello world"', output: '3' },
    csharp: `int CountVowels(string s) {\n    string vowels = "aeiouAEIOU";\n    int count = 0;\n    foreach (char c in s) {\n        if (vowels.Contains(c)) count++;\n    }\n    return count;\n}`,
    javascript: `function countVowels(s) {\n  const vowels = "aeiouAEIOU";\n  let count = 0;\n  for (let c of s) {\n    if (vowels.includes(c)) count++;\n  }\n  return count;\n}`,
    explanation: 'Loop through each character and check if it exists in a string/set of vowels. Increment counter on match.',
  },
]

const companies = [
  { name: 'TCS', icon: '🏢', color: '#38bdf8', pattern: 'Arrays + Strings + Pseudocode' },
  { name: 'Infosys', icon: '💼', color: '#818cf8', pattern: 'Arrays + Strings + Pseudocode' },
  { name: 'Wipro', icon: '🌐', color: '#34d399', pattern: 'Arrays + Strings + Pseudocode' },
  { name: 'Cognizant', icon: '⚡', color: '#f59e0b', pattern: 'Arrays + Strings + Pseudocode' },
  { name: 'Accenture', icon: '🎯', color: '#fb7185', pattern: 'Arrays + Strings + Pseudocode' },
  { name: 'Generic', icon: '📚', color: '#94a3b8', pattern: 'Mixed Practice' },
]

const categoryInfo = {
  arrays: { label: 'Arrays', color: '#38bdf8' },
  strings: { label: 'Strings', color: '#818cf8' },
  pseudocode: { label: 'Pseudocode Output', color: '#34d399' },
}

const difficultyColor = { Easy: '#34d399', Medium: '#f59e0b', Hard: '#fb7185' }

function CodingPrep() {
  const [mainTab, setMainTab] = useState('mcq') // mcq | problems
  const [screen, setScreen] = useState('setup')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState([])

  // Coding Problems state
  const [problemCompany, setProblemCompany] = useState('Generic')
  const [expandedProblem, setExpandedProblem] = useState(null)
  const [showSolution, setShowSolution] = useState({})
  const [activeLang, setActiveLang] = useState({})

  const getCompanyQuestionCount = (companyName) => {
    return questionBank.filter(q => q.companies.includes(companyName)).length
  }

  const getCompanyProblemCount = (companyName) => {
    return codingProblems.filter(p => p.companies.includes(companyName)).length
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
      question: questions[currentIndex], selected: selectedOption,
      correct: isCorrect, skipped: selectedOption === null,
    }])
    setSelectedOption(null)
    setShowAnswer(false)
    if (currentIndex + 1 >= questions.length) setScreen('result')
    else setCurrentIndex(prev => prev + 1)
  }

  const handleSkip = () => {
    setResults(prev => [...prev, {
      question: questions[currentIndex], selected: null, correct: false, skipped: true,
    }])
    setSelectedOption(null)
    setShowAnswer(false)
    if (currentIndex + 1 >= questions.length) setScreen('result')
    else setCurrentIndex(prev => prev + 1)
  }

  const filteredProblems = codingProblems.filter(p => p.companies.includes(problemCompany))

  // ====== TOP TAB SWITCHER ======
  const TabSwitcher = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
      {[
        { id: 'mcq', label: '📝 MCQ Practice' },
        { id: 'problems', label: '💻 Coding Problems' },
      ].map(tab => (
        <button key={tab.id} onClick={() => { setMainTab(tab.id); setScreen('setup') }} style={{
          padding: '12px 28px',
          backgroundColor: mainTab === tab.id ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.03)',
          border: mainTab === tab.id ? '1px solid rgba(56,189,248,0.5)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
          color: mainTab === tab.id ? '#38bdf8' : 'var(--text-secondary)',
          boxShadow: mainTab === tab.id ? '0 0 20px rgba(56,189,248,0.15)' : 'none',
          transition: 'all 0.2s ease',
        }}>
          {tab.label}
        </button>
      ))}
    </div>
  )

  // ====== CODING PROBLEMS TAB ======
  if (mainTab === 'problems') {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', backgroundColor: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.3)', borderRadius: '100px',
            fontSize: '13px', color: '#38bdf8', fontWeight: '500', marginBottom: '16px',
          }}>
            ✦ Practice Coding Problems
          </div>
          <h2 style={{
            fontSize: '40px', fontWeight: '800', background: 'var(--gradient)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '12px', letterSpacing: '-1px',
          }}>
            Coding Prep
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Try solving, then reveal the solution with explanation
          </p>
        </div>

        <TabSwitcher />

        {/* Company Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
          {companies.map(c => (
            <button key={c.name} onClick={() => setProblemCompany(c.name)} style={{
              padding: '8px 18px',
              backgroundColor: problemCompany === c.name ? `${c.color}15` : 'rgba(255,255,255,0.03)',
              border: problemCompany === c.name ? `1px solid ${c.color}50` : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '100px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              color: problemCompany === c.name ? c.color : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}>
              {c.icon} {c.name} ({getCompanyProblemCount(c.name)})
            </button>
          ))}
        </div>

        {/* Problems List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredProblems.map((problem) => {
            const isExpanded = expandedProblem === problem.id
            const isSolutionShown = showSolution[problem.id]
            const lang = activeLang[problem.id] || 'csharp'

            return (
              <div key={problem.id} style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(56,189,248,0.15)',
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div
                  onClick={() => setExpandedProblem(isExpanded ? null : problem.id)}
                  style={{
                    padding: '20px 24px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
                      backgroundColor: `${difficultyColor[problem.difficulty]}15`,
                      color: difficultyColor[problem.difficulty],
                      border: `1px solid ${difficultyColor[problem.difficulty]}40`,
                    }}>
                      {problem.difficulty}
                    </span>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {problem.title}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '14px', color: '#38bdf8',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}>▾</span>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="fade-in" style={{ padding: '0 24px 24px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>
                      {problem.description}
                    </p>

                    {/* Example */}
                    <div style={{
                      padding: '14px 18px', backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', marginBottom: '16px',
                    }}>
                      <p style={{ fontSize: '12px', color: '#818cf8', fontWeight: '700', marginBottom: '6px' }}>EXAMPLE</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        Input: {problem.example.input}<br />
                        Output: {problem.example.output}
                      </p>
                    </div>

                    {!isSolutionShown ? (
                      <button
                        onClick={() => setShowSolution(prev => ({ ...prev, [problem.id]: true }))}
                        style={{
                          padding: '10px 24px', background: 'var(--gradient)', border: 'none',
                          borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700',
                          cursor: 'pointer', boxShadow: '0 0 15px rgba(56,189,248,0.2)',
                        }}
                      >
                        💡 Show Solution
                      </button>
                    ) : (
                      <div className="fade-in">
                        {/* Language Tabs */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          {['csharp', 'javascript'].map(l => (
                            <button key={l} onClick={() => setActiveLang(prev => ({ ...prev, [problem.id]: l }))} style={{
                              padding: '6px 16px',
                              backgroundColor: lang === l ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.04)',
                              border: lang === l ? '1px solid rgba(56,189,248,0.4)' : '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                              color: lang === l ? '#38bdf8' : 'var(--text-secondary)',
                            }}>
                              {l === 'csharp' ? 'C#' : 'JavaScript'}
                            </button>
                          ))}
                        </div>

                        {/* Code Block */}
                        <pre style={{
                          fontSize: '13px', color: '#e2e8f0', backgroundColor: 'rgba(0,0,0,0.3)',
                          padding: '18px 20px', borderRadius: '12px', marginBottom: '14px',
                          fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.7',
                          overflowX: 'auto', whiteSpace: 'pre', border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          {lang === 'csharp' ? problem.csharp : problem.javascript}
                        </pre>

                        {/* Explanation */}
                        <div style={{
                          padding: '14px 18px', backgroundColor: 'rgba(129,140,248,0.05)',
                          border: '1px solid rgba(129,140,248,0.2)', borderRadius: '10px',
                        }}>
                          <p style={{ fontSize: '12px', color: '#818cf8', fontWeight: '700', marginBottom: '6px' }}>
                            💡 EXPLANATION
                          </p>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            {problem.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ====== MCQ TAB — SETUP SCREEN ======
  if (screen === 'setup') {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', backgroundColor: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.3)', borderRadius: '100px',
            fontSize: '13px', color: '#38bdf8', fontWeight: '500', marginBottom: '16px',
          }}>
            ✦ Company-wise Coding Prep
          </div>
          <h2 style={{
            fontSize: '40px', fontWeight: '800', background: 'var(--gradient)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '12px', letterSpacing: '-1px',
          }}>
            Coding Prep
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '550px', margin: '0 auto', lineHeight: '1.7' }}>
            MCQ-based coding rounds — Arrays, Strings & Pseudocode Output Prediction
          </p>
        </div>

        <TabSwitcher />

        <div style={{
          padding: '14px 20px', backgroundColor: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px',
          marginBottom: '32px', textAlign: 'center',
        }}>
          <p style={{ fontSize: '12px', color: '#f59e0b' }}>
            ⚠️ Practice in company exam style — MCQ format, no code execution needed
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {companies.map((company) => {
            const count = getCompanyQuestionCount(company.name)
            return (
              <div key={company.name} onClick={() => startTest(company)} style={{
                padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)',
                border: `1px solid ${company.color}25`, borderRadius: '18px',
                cursor: 'pointer', transition: 'all 0.3s ease',
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
                  border: `1px solid ${company.color}33`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px',
                }}>
                  {company.icon}
                </div>
                <p style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {company.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                  💻 {company.pattern}
                </p>
                <div style={{
                  display: 'inline-block', padding: '6px 14px',
                  backgroundColor: `${company.color}12`, border: `1px solid ${company.color}30`,
                  borderRadius: '100px', fontSize: '12px', color: company.color, fontWeight: '700',
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

  // ====== MCQ TAB — TEST SCREEN ======
  if (screen === 'test') {
    const q = questions[currentIndex]
    const progress = (currentIndex / questions.length) * 100
    const catInfo = categoryInfo[q.category]

    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{
            padding: '6px 16px', backgroundColor: `${selectedCompany.color}12`,
            border: `1px solid ${selectedCompany.color}40`, borderRadius: '100px',
            fontSize: '13px', color: selectedCompany.color, fontWeight: '700',
          }}>
            {selectedCompany.icon} {selectedCompany.name} Coding Practice
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
          <pre style={{
            fontSize: '14px', color: '#e2e8f0', backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '18px 20px', borderRadius: '12px', marginBottom: '20px',
            fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.7',
            overflowX: 'auto', whiteSpace: 'pre-wrap', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {q.q}
          </pre>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt, i) => {
              let bgColor = 'rgba(255,255,255,0.03)'
              let borderColor = 'rgba(255,255,255,0.08)'
              let textColor = 'var(--text-primary)'

              if (showAnswer) {
                if (i === q.answer) {
                  bgColor = 'rgba(52,211,153,0.12)'; borderColor = 'rgba(52,211,153,0.5)'; textColor = '#34d399'
                } else if (i === selectedOption) {
                  bgColor = 'rgba(251,113,133,0.12)'; borderColor = 'rgba(251,113,133,0.5)'; textColor = '#fb7185'
                }
              } else if (i === selectedOption) {
                bgColor = `${catInfo?.color}12`; borderColor = `${catInfo?.color}50`; textColor = catInfo?.color
              }

              return (
                <div key={i} onClick={() => !showAnswer && setSelectedOption(i)} style={{
                  padding: '14px 18px', backgroundColor: bgColor, border: `1px solid ${borderColor}`,
                  borderRadius: '12px', cursor: showAnswer ? 'default' : 'pointer', display: 'flex',
                  alignItems: 'center', gap: '12px', transition: 'all 0.2s ease', fontFamily: 'monospace',
                }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${textColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
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
              marginTop: '20px', padding: '16px 20px', backgroundColor: 'rgba(129,140,248,0.05)',
              border: '1px solid rgba(129,140,248,0.2)', borderRadius: '12px',
            }}>
              <p style={{ fontSize: '12px', color: '#818cf8', fontWeight: '700', marginBottom: '6px' }}>💡 EXPLANATION:</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{q.explanation}</p>
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
              }}>⏭ Skip</button>
              <button onClick={handleSubmitAnswer} disabled={selectedOption === null} className="btn-primary" style={{
                padding: '12px 40px', fontSize: '15px', fontWeight: '700', borderRadius: '12px',
                opacity: selectedOption === null ? 0.5 : 1, cursor: selectedOption === null ? 'not-allowed' : 'pointer',
              }}>Submit Answer</button>
            </>
          ) : (
            <button onClick={handleNext} className="btn-primary" style={{
              padding: '12px 40px', fontSize: '15px', fontWeight: '700', borderRadius: '12px',
            }}>
              {currentIndex + 1 >= questions.length ? '🏁 Finish' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ====== MCQ TAB — RESULT SCREEN ======
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
      return { name: categoryInfo[catKey].label, correct: catCorrect, total: catResults.length, color: categoryInfo[catKey].color }
    }).filter(c => c.total > 0)

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>
            {percentage >= 70 ? '🏆' : percentage >= 50 ? '👍' : '💪'}
          </div>
          <h2 style={{
            fontSize: '36px', fontWeight: '800', background: 'var(--gradient)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px',
          }}>
            {selectedCompany.icon} {selectedCompany.name} Practice Complete!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            You scored {correct} out of {questions.length} ({percentage}%)
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            padding: '28px', backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(56,189,248,0.2)', borderRadius: '20px', backdropFilter: 'blur(20px)',
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px', textAlign: 'center' }}>
              OVERALL BREAKDOWN
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} stroke="none" />))}
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
            border: '1px solid rgba(56,189,248,0.2)', borderRadius: '20px', backdropFilter: 'blur(20px)',
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
                  {categoryStats.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', flex: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  Q{i + 1}: {r.question.q.split('\n')[0]}
                </p>
                <span style={{
                  fontSize: '12px', fontWeight: '700',
                  color: r.correct ? '#34d399' : r.skipped ? '#94a3b8' : '#fb7185', minWidth: 'fit-content',
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
          }}>← Choose Another Company</button>
          <button onClick={() => startTest(selectedCompany)} className="btn-primary" style={{
            padding: '14px 32px', fontSize: '15px', fontWeight: '700', borderRadius: '12px',
          }}>🔄 Try Again</button>
        </div>
      </div>
    )
  }
}

export default CodingPrep