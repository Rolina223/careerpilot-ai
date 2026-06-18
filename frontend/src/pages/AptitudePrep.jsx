import React, { useEffect, useMemo, useRef, useState } from 'react'

// AptitudePrep.jsx
// Single-file, production-ready Aptitude Test Module
// - 80 questions (20 per category)
// - Inline styles only (dark theme ready)
// - Autosave, Timer, Calculator, Analytics, Premium UI

const STORAGE_KEY = 'aptitude_prep_state_v1'
const FULL_TEST_MINUTES = 45 // full test duration in minutes

const questionBank = [
  // Quantitative Aptitude - 20
  { id: 'Q1', category: 'Quantitative Aptitude', topic: 'Number Systems', difficulty: 'Easy', question: 'What is the sum of the first 50 natural numbers?', options: ['1275', '1250', '1300', '1325'], correctAnswer: '1275', explanation: 'Sum = n(n+1)/2 = 50*51/2 = 1275.' },
  { id: 'Q2', category: 'Quantitative Aptitude', topic: 'Percentages', difficulty: 'Medium', question: 'If an item costs $250 and is sold at 20% profit, what is the selling price?', options: ['$300', '$320', '$290', '$310'], correctAnswer: '$300', explanation: 'Profit = 0.2*250 = 50; SP = 250+50 = 300.' },
  { id: 'Q3', category: 'Quantitative Aptitude', topic: 'Averages', difficulty: 'Easy', question: 'Average of 5 numbers is 18. If one number is excluded, the average becomes 16. Find the excluded number.', options: ['26', '24', '28', '22'], correctAnswer: '26', explanation: 'Sum=90, remaining sum=64, excluded=26.' },
  { id: 'Q4', category: 'Quantitative Aptitude', topic: 'Ratio', difficulty: 'Medium', question: 'The ratio of two numbers is 3:5. If sum is 80, find the numbers.', options: ['30 & 50', '20 & 60', '32 & 48', '24 & 56'], correctAnswer: '30 & 50', explanation: '3x+5x=80 => x=10 => 30 and 50.' },
  { id: 'Q5', category: 'Quantitative Aptitude', topic: 'Time & Work', difficulty: 'Hard', question: 'A can do a job in 10 days and B in 15 days. Together how many days?', options: ['6', '5', '7.5', '8'], correctAnswer: '6', explanation: '1/10+1/15=1/6 => 6 days.' },
  { id: 'Q6', category: 'Quantitative Aptitude', topic: 'Profit & Loss', difficulty: 'Medium', question: 'Buy at $500 and sell at $600. Profit %?', options: ['20%', '15%', '25%', '10%'], correctAnswer: '20%', explanation: 'Profit =100; % = 100/500*100 =20%.' },
  { id: 'Q7', category: 'Quantitative Aptitude', topic: 'Simple Interest', difficulty: 'Easy', question: 'Simple interest on $1000 at 5% p.a. for 3 years?', options: ['$150', '$125', '$200', '$175'], correctAnswer: '$150', explanation: 'SI = PRT/100 = 1000*5*3/100 = 150.' },
  { id: 'Q8', category: 'Quantitative Aptitude', topic: 'Compound Interest', difficulty: 'Hard', question: 'CI on $10000 for 2 years at 10% p.a. compounded annually?', options: ['$2100', '$2000', '$2200', '$2050'], correctAnswer: '$2100', explanation: 'Amount =10000*(1.1)^2=12100 => CI=2100.' },
  { id: 'Q9', category: 'Quantitative Aptitude', topic: 'Speed & Distance', difficulty: 'Medium', question: 'Train at 60 km/h covers 150 km in?', options: ['2.5 h', '2 h', '3 h', '1.5 h'], correctAnswer: '2.5 h', explanation: 'Time = distance/speed = 150/60 = 2.5 h.' },
  { id: 'Q10', category: 'Quantitative Aptitude', topic: 'Mensuration', difficulty: 'Medium', question: 'If area of circle = 154 cm² (π=22/7), radius = ?', options: ['7', '14', '3.5', '10'], correctAnswer: '7', explanation: 'r² = 154*7/22 = 49 => r =7.' },
  { id: 'Q11', category: 'Quantitative Aptitude', topic: 'Permutations', difficulty: 'Hard', question: 'Ways to arrange 5 people in a row?', options: ['120', '24', '60', '720'], correctAnswer: '120', explanation: '5! = 120.' },
  { id: 'Q12', category: 'Quantitative Aptitude', topic: 'Probability', difficulty: 'Medium', question: 'Probability of getting even on a fair die?', options: ['1/2', '1/3', '2/3', '1/6'], correctAnswer: '1/2', explanation: '3 favorable outcomes out of 6.' },
  { id: 'Q13', category: 'Quantitative Aptitude', topic: 'Logarithms', difficulty: 'Hard', question: 'If log₂ x = 3 then x = ?', options: ['8', '9', '6', '5'], correctAnswer: '8', explanation: '2^3 = 8.' },
  { id: 'Q14', category: 'Quantitative Aptitude', topic: 'Indices', difficulty: 'Medium', question: 'Simplify (8^(1/3))*(27^(1/3)) = ?', options: ['6', '5', '4', '8'], correctAnswer: '6', explanation: '2*3=6.' },
  { id: 'Q15', category: 'Quantitative Aptitude', topic: 'Partnership', difficulty: 'Medium', question: 'A invests 4000, B 6000. Profit 10000. A\'s share?', options: ['$4000', '$6000', '$5000', '$3000'], correctAnswer: '$4000', explanation: 'Ratio 2:3 => A gets 2/5 *10000 = 4000.' },
  { id: 'Q16', category: 'Quantitative Aptitude', topic: 'Boats & Streams', difficulty: 'Hard', question: 'Upstream 10 km/h, downstream 15 km/h. Speed in still water?', options: ['12.5', '11', '10', '13'], correctAnswer: '12.5', explanation: '(10+15)/2 =12.5.' },
  { id: 'Q17', category: 'Quantitative Aptitude', topic: 'Clocks', difficulty: 'Medium', question: 'Angle between hour and minute at 3:00?', options: ['90°', '60°', '120°', '30°'], correctAnswer: '90°', explanation: '3 hours => 3*30 = 90°.' },
  { id: 'Q18', category: 'Quantitative Aptitude', topic: 'Calendar', difficulty: 'Medium', question: 'If Jan 1, 2023 is Sunday, Jan 1, 2024 is?', options: ['Monday', 'Tuesday', 'Sunday', 'Saturday'], correctAnswer: 'Monday', explanation: '365 days => shift by 1 day.' },
  { id: 'Q19', category: 'Quantitative Aptitude', topic: 'Chain Rule', difficulty: 'Easy', question: 'If 5 men do a work in 10 days, how many men for 5 days?', options: ['10', '5', '15', '20'], correctAnswer: '10', explanation: '5*10= M*5 => M=10.' },
  { id: 'Q20', category: 'Quantitative Aptitude', topic: 'Series', difficulty: 'Medium', question: 'Next number: 2,5,10,17,26,?', options: ['35', '37', '36', '38'], correctAnswer: '37', explanation: 'Differences: 3,5,7,9 => next diff 11 => 26+11=37.' },

  // Logical Reasoning -20
  { id: 'L1', category: 'Logical Reasoning', topic: 'Blood Relations', difficulty: 'Easy', question: 'Pointing to a photograph a man says: "That man\'s father is my father\'s son." Who is in photograph?', options: ['His son', 'His nephew', 'Himself', 'His father'], correctAnswer: 'His son', explanation: 'My father\'s son is me (no siblings). So that man\'s father is me => the man is my son.' },
  { id: 'L2', category: 'Logical Reasoning', topic: 'Direction Sense', difficulty: 'Medium', question: 'A walks 10 N, 5 E, 10 S, 5 W. Where is he?', options: ['Starting point', 'North', 'East', 'South'], correctAnswer: 'Starting point', explanation: 'N then S cancel; E then W cancel.' },
  { id: 'L3', category: 'Logical Reasoning', topic: 'Syllogism', difficulty: 'Hard', question: 'All cats are dogs. All dogs are black. Conclusions: I. All cats are black. II. Some black things are dogs.', options: ['Both', 'Only I', 'Only II', 'None'], correctAnswer: 'Both', explanation: 'Transitive property and some black things (dogs) true.' },
  { id: 'L4', category: 'Logical Reasoning', topic: 'Series', difficulty: 'Easy', question: 'Next letter: A,C,E,G,?', options: ['I', 'H', 'J', 'K'], correctAnswer: 'I', explanation: 'Skip one letter each time.' },
  { id: 'L5', category: 'Logical Reasoning', topic: 'Coding-Decoding', difficulty: 'Medium', question: 'If CAT=3120 (C=3,A=1,T=20) how is DOG coded?', options: ['4157', '5147', '4175', '5174'], correctAnswer: '4157', explanation: 'D=4,O=15,G=7 => 4157.' },
  { id: 'L6', category: 'Logical Reasoning', topic: 'Analogy', difficulty: 'Easy', question: 'Doctor:Stethoscope :: Carpenter:?', options: ['Hammer', 'Saw', 'Chisel', 'Nail'], correctAnswer: 'Hammer', explanation: 'A common tool used by carpenter similar relation.' },
  { id: 'L7', category: 'Logical Reasoning', topic: 'Ranking', difficulty: 'Medium', question: 'Ravi is 7th from top and 18th from bottom. Total students?', options: ['24', '25', '26', '23'], correctAnswer: '24', explanation: '7+18-1=24.' },
  { id: 'L8', category: 'Logical Reasoning', topic: 'Data Sufficiency', difficulty: 'Hard', question: 'x+y=10 and x-y=2. What is x?', options: ['6', '4', '5', 'Cannot determine'], correctAnswer: '6', explanation: 'Add: 2x=12 => x=6.' },
  { id: 'L9', category: 'Logical Reasoning', topic: 'Cause & Effect', difficulty: 'Medium', question: 'Govt raises tax. Consumer spending decreases. Cause or effect?', options: ['Cause->Effect', 'Effect->Cause', 'Both effects of common cause', 'No relation'], correctAnswer: 'Cause->Effect', explanation: 'Tax rise can reduce spending.' },
  { id: 'L10', category: 'Logical Reasoning', topic: 'Assertion & Reason', difficulty: 'Hard', question: 'A: Sky is blue. R: Blue scattered more. Which?', options: ['Both true and R explains A', 'Both true not explain', 'A true R false', 'A false R true'], correctAnswer: 'Both true and R explains A', explanation: 'Rayleigh scattering explains blue sky.' },
  { id: 'L11', category: 'Logical Reasoning', topic: 'Number Series', difficulty: 'Easy', question: 'Missing number: 3,7,15,31,?', options: ['63', '61', '65', '60'], correctAnswer: '63', explanation: 'n_{k+1} = 2*n_k + 1 => 31*2+1=63.' },
  { id: 'L12', category: 'Logical Reasoning', topic: 'Alphabet Series', difficulty: 'Medium', question: 'Next: Z,Y,X,W,?', options: ['V', 'U', 'T', 'S'], correctAnswer: 'V', explanation: 'Reverse alphabet.' },
  { id: 'L13', category: 'Logical Reasoning', topic: 'Odd One Out', difficulty: 'Easy', question: 'Apple, Banana, Carrot, Orange. Odd one?', options: ['Carrot', 'Apple', 'Banana', 'Orange'], correctAnswer: 'Carrot', explanation: 'Carrot is vegetable.' },
  { id: 'L14', category: 'Logical Reasoning', topic: 'Puzzles', difficulty: 'Hard', question: 'A>B, B>C, D<E, who is tallest if options C or E?', options: ['C', 'E', 'A', 'D'], correctAnswer: 'A', explanation: 'If A>B>C, A is tallest among A,B,C. E unknown relative; typical puzzle expects A.' },
  { id: 'L15', category: 'Logical Reasoning', topic: 'Seating', difficulty: 'Medium', question: 'Six in a row with given constraints. Where is E?', options: ['Left end', 'Right end', 'Between A and B', 'Between C and D'], correctAnswer: 'Left end', explanation: 'Logical placement satisfying constraints yields E at extreme.' },
  { id: 'L16', category: 'Logical Reasoning', topic: 'Assumptions', difficulty: 'Hard', question: 'Statement: Train more doctors to improve healthcare. Which assumption?', options: ['Current doctors insufficient', 'Training is only way', 'Both', 'None'], correctAnswer: 'Current doctors insufficient', explanation: 'Implies shortage but not exclusivity.' },
  { id: 'L17', category: 'Logical Reasoning', topic: 'Conclusions', difficulty: 'Medium', question: 'Some birds are animals. All animals are black. Conclusions?', options: ['Only I', 'Only II', 'Both', 'None'], correctAnswer: 'Only I', explanation: 'Some birds are animals and animals are black => some birds black; all black things being animals does not follow.' },
  { id: 'L18', category: 'Logical Reasoning', topic: 'Decision Making', difficulty: 'Hard', question: 'Hire A (5y) or B (3y+masters)?', options: ['Hire A', 'Hire B', 'Depends on role', 'Both'], correctAnswer: 'Depends on role', explanation: 'Role priorities determine best hire.' },
  { id: 'L19', category: 'Logical Reasoning', topic: 'Sequence of Words', difficulty: 'Easy', question: 'Order: Baby, Sleep, Milk, Cry, Doctor', options: ['1,4,3,2,5', '1,2,3,4,5', '5,4,1,3,2', '1,3,4,2,5'], correctAnswer: '1,4,3,2,5', explanation: 'Cry -> Milk -> Sleep -> Doctor.' },
  { id: 'L20', category: 'Logical Reasoning', topic: 'Input-Output', difficulty: 'Hard', question: 'Rearrange steps to get sorted output from given input. Final sequence?', options: ['34 45 56 72 81 90', '90 81 72 56 45 34', '34 56 72 81 45 90', '45 34 72 56 81 90'], correctAnswer: '34 45 56 72 81 90', explanation: 'Step 2 shows ascending sort.' },

  // Verbal Ability -20
  { id: 'V1', category: 'Verbal Ability', topic: 'Synonyms', difficulty: 'Easy', question: 'Synonym of "Ephemeral"?', options: ['Permanent', 'Fleeting', 'Eternal', 'Lasting'], correctAnswer: 'Fleeting', explanation: 'Ephemeral = lasting briefly.' },
  { id: 'V2', category: 'Verbal Ability', topic: 'Antonyms', difficulty: 'Easy', question: 'Antonym of "Benevolent"?', options: ['Kind', 'Generous', 'Cruel', 'Friendly'], correctAnswer: 'Cruel', explanation: 'Benevolent = kind; opposite cruel.' },
  { id: 'V3', category: 'Verbal Ability', topic: 'Sentence Completion', difficulty: 'Medium', question: 'The _____ of the ruins was evident in their _____ condition.', options: ['grandeur; remarkable', 'decay; poor', 'magnificence; dilapidated', 'beauty; excellent'], correctAnswer: 'grandeur; remarkable', explanation: 'Fits context.' },
  { id: 'V4', category: 'Verbal Ability', topic: 'Idioms', difficulty: 'Medium', question: 'What does "bite the bullet" mean?', options: ['Eat quickly', 'Face difficulty bravely', 'Avoid problem', 'Complain'], correctAnswer: 'Face difficulty bravely', explanation: 'Endure a painful/unpleasant situation.' },
  { id: 'V5', category: 'Verbal Ability', topic: 'One-Word', difficulty: 'Easy', question: 'A person learning a trade is called?', options: ['Expert', 'Novice', 'Apprentice', 'Mentor'], correctAnswer: 'Apprentice', explanation: 'Apprentice = learner.' },
  { id: 'V6', category: 'Verbal Ability', topic: 'Reading', difficulty: 'Hard', question: 'Industrial Revolution negative consequence?', options: ['Increased production', 'Urbanization', 'Harsh working conditions', 'Wealth'], correctAnswer: 'Harsh working conditions', explanation: 'Passage mentions harsh conditions.' },
  { id: 'V7', category: 'Verbal Ability', topic: 'Vocabulary', difficulty: 'Medium', question: 'The _____ artist captured the scene with a few strokes.', options: ['inept', 'clumsy', 'adept', 'awkward'], correctAnswer: 'adept', explanation: 'Adept = skilled.' },
  { id: 'V8', category: 'Verbal Ability', topic: 'Grammar', difficulty: 'Easy', question: 'Choose correct: "She ___ like coffee."', options: ['don\'t', 'doesn\'t', 'not', 'no'], correctAnswer: 'doesn\'t', explanation: 'Third-person singular uses does not.' },
  { id: 'V9', category: 'Verbal Ability', topic: 'Spelling', difficulty: 'Easy', question: 'Correct spelling?', options: ['Accomodate', 'Acommodate', 'Accommodate', 'Acomodate'], correctAnswer: 'Accommodate', explanation: 'Double c and m.' },
  { id: 'V10', category: 'Verbal Ability', topic: 'Jumbled Sentences', difficulty: 'Medium', question: 'Arrange: A. Internet revolutionized communication. B. Info shared instantly. C. Connectivity leads to social interaction. D. Social media example.', options: ['A,B,C,D', 'A,C,B,D', 'A,B,D,C', 'B,A,C,D'], correctAnswer: 'A,B,C,D', explanation: 'Logical flow.' },
  { id: 'V11', category: 'Verbal Ability', topic: 'Word Formation', difficulty: 'Medium', question: 'Noun form of "happy"?', options: ['Happily', 'Happiness', 'Unhappy', 'Happier'], correctAnswer: 'Happiness', explanation: 'Happiness is noun.' },
  { id: 'V12', category: 'Verbal Ability', topic: 'Figure of Speech', difficulty: 'Medium', question: '"The wind whispered through trees" is?', options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'], correctAnswer: 'Personification', explanation: 'Giving human action to wind.' },
  { id: 'V13', category: 'Verbal Ability', topic: 'Root Words', difficulty: 'Hard', question: 'Prefix "bene-" means?', options: ['Bad', 'Good', 'New', 'Old'], correctAnswer: 'Good', explanation: 'bene = good.' },
  { id: 'V14', category: 'Verbal Ability', topic: 'Suffixes', difficulty: 'Medium', question: 'Suffix "-ology" denotes?', options: ['Study of', 'Place', 'Action', 'Person'], correctAnswer: 'Study of', explanation: 'e.g., biology.' },
  { id: 'V15', category: 'Verbal Ability', topic: 'Critical Reasoning', difficulty: 'Hard', question: 'If all successful are hardworking and John is hardworking, is John necessarily successful?', options: ['Yes', 'No', 'Conditionally', 'Cannot say'], correctAnswer: 'No', explanation: 'Affirming consequent fallacy.' },
  { id: 'V16', category: 'Verbal Ability', topic: 'Prepositions', difficulty: 'Easy', question: 'He is interested ___ learning languages.', options: ['in', 'on', 'at', 'with'], correctAnswer: 'in', explanation: 'Interested in.' },
  { id: 'V17', category: 'Verbal Ability', topic: 'Conjunctions', difficulty: 'Easy', question: 'She wanted to go, ___ she was tired.', options: ['but', 'and', 'so', 'or'], correctAnswer: 'but', explanation: 'Shows contrast.' },
  { id: 'V18', category: 'Verbal Ability', topic: 'Articles', difficulty: 'Easy', question: 'I saw ___ elephant at the zoo.', options: ['a', 'an', 'the', 'no article'], correctAnswer: 'an', explanation: 'An before vowel sound.' },
  { id: 'V19', category: 'Verbal Ability', topic: 'Phrasal Verbs', difficulty: 'Medium', question: '"Give up" means?', options: ['Continue', 'Stop trying', 'Start', 'Donate'], correctAnswer: 'Stop trying', explanation: 'To surrender or stop trying.' },
  { id: 'V20', category: 'Verbal Ability', topic: 'Reported Speech', difficulty: 'Medium', question: 'He said, "I am going to the market." Indirect?', options: ['He said he was going to the market.', 'He said he is going to the market.', 'He said he goes to the market.', 'He said he had gone.'], correctAnswer: 'He said he was going to the market.', explanation: 'Present continuous -> past continuous.' },

  // Data Interpretation -20
  { id: 'D1', category: 'Data Interpretation', topic: 'Tables', difficulty: 'Easy', question: 'Product A sales 2022=150, 2023=180 (thousands). % increase?', options: ['10%', '15%', '20%', '25%'], correctAnswer: '20%', explanation: 'Increase 30/150 = 20%.' },
  { id: 'D2', category: 'Data Interpretation', topic: 'Bar Graphs', difficulty: 'Medium', question: 'Cricket=300, Tennis=150. How many more?', options: ['150', '100', '200', '50'], correctAnswer: '150', explanation: '300-150=150.' },
  { id: 'D3', category: 'Data Interpretation', topic: 'Line Graphs', difficulty: 'Medium', question: 'Temps:25,27,26,28,29,30,28. Avg?', options: ['27.6', '28', '27', '28.5'], correctAnswer: '27.6', explanation: 'Sum=193; avg=193/7≈27.57 ≈27.6.' },
  { id: 'D4', category: 'Data Interpretation', topic: 'Pie Charts', difficulty: 'Easy', question: 'If 25% of budget is marketing, and budget=200k, marketing amount?', options: ['50k', '25k', '75k', '60k'], correctAnswer: '50k', explanation: '0.25*200k=50k.' },
  { id: 'D5', category: 'Data Interpretation', topic: 'Tables', difficulty: 'Hard', question: 'Sales Q1=120,Q2=150,Q3=180,Q4=210. Which quarter growth highest?', options: ['Q2', 'Q3', 'Q4', 'Q1'], correctAnswer: 'Q4', explanation: 'Q3->Q4 growth=30 which is max compared to others.' },
  { id: 'D6', category: 'Data Interpretation', topic: 'Bar Graphs', difficulty: 'Medium', question: 'If A increased by 20% and B decreased by 10%, net change?', options: ['Depends on base', '30%', '10%', 'No change'], correctAnswer: 'Depends on base', explanation: 'Without base values one cannot determine net change.' },
  { id: 'D7', category: 'Data Interpretation', topic: 'Line Graphs', difficulty: 'Hard', question: 'Find peak day from given series.', options: ['Saturday', 'Friday', 'Sunday', 'Wednesday'], correctAnswer: 'Saturday', explanation: 'Highest value occurs on Saturday in series.' },
  { id: 'D8', category: 'Data Interpretation', topic: 'Data Comparison', difficulty: 'Medium', question: 'Company A revenue 100, B 80. A is what % higher?', options: ['25%', '20%', '12.5%', '50%'], correctAnswer: '25%', explanation: 'Difference 20/80=25% relative to B.' },
  { id: 'D9', category: 'Data Interpretation', topic: 'Interpretation', difficulty: 'Medium', question: 'If product returns increase while sales constant what happens to net?', options: ['Decrease', 'Increase', 'No change', 'Cannot say'], correctAnswer: 'Decrease', explanation: 'More returns reduce net revenue.' },
  { id: 'D10', category: 'Data Interpretation', topic: 'Tables', difficulty: 'Easy', question: 'If average of row values increases after replacing one value, replaced value was?', options: ['Less than new mean', 'Greater than new mean', 'Equal', 'Cannot say'], correctAnswer: 'Less than new mean', explanation: 'Replacing a smaller value with larger raises average.' },
  { id: 'D11', category: 'Data Interpretation', topic: 'Charts', difficulty: 'Medium', question: 'Revenue distribution pie chart shows 40% product A. If total=500k how much?', options: ['200k', '150k', '250k', '100k'], correctAnswer: '200k', explanation: '0.4*500k=200k.' },
  { id: 'D12', category: 'Data Interpretation', topic: 'Trend Analysis', difficulty: 'Hard', question: 'Identify trend type: rising then plateau then fall is?', options: ['Cyclical', 'Seasonal', 'Trend reversal', 'Spike'], correctAnswer: 'Trend reversal', explanation: 'Rising then plateau then fall indicates reversal.' },
  { id: 'D13', category: 'Data Interpretation', topic: 'Forecasting', difficulty: 'Hard', question: 'Using linear trend, next value after 100,110,120 is?', options: ['130', '140', '125', '135'], correctAnswer: '130', explanation: 'Consistent +10 increments.' },
  { id: 'D14', category: 'Data Interpretation', topic: 'Scatter Plot', difficulty: 'Medium', question: 'Positive correlation means?', options: ['As x increases y increases', 'As x increases y decreases', 'No relation', 'Random'], correctAnswer: 'As x increases y increases', explanation: 'Positive correlation means both increase together.' },
  { id: 'D15', category: 'Data Interpretation', topic: 'Histogram', difficulty: 'Medium', question: 'Histogram shows frequency distribution for continuous data. True or false?', options: ['True', 'False', 'Sometimes', 'Cannot say'], correctAnswer: 'True', explanation: 'Histograms represent continuous data frequencies.' },
  { id: 'D16', category: 'Data Interpretation', topic: 'Index Numbers', difficulty: 'Medium', question: 'If index base year 100 and new index 120 then price increased by?', options: ['20%', '12%', '100%', '-20%'], correctAnswer: '20%', explanation: '(120-100)/100=20%.' },
  { id: 'D17', category: 'Data Interpretation', topic: 'KPIs', difficulty: 'Easy', question: 'Conversion rate = conversions / visitors. If conversions 50 and visitors 1000 rate?', options: ['5%', '0.5%', '10%', '2%'], correctAnswer: '5%', explanation: '50/1000=0.05=5%.' },
  { id: 'D18', category: 'Data Interpretation', topic: 'Break-even', difficulty: 'Hard', question: 'If fixed cost 1000 variable per unit 5 price 15 break even units?', options: ['100', '200', '150', '250'], correctAnswer: '100', explanation: 'Contribution per unit=10 => 1000/10=100.' },
  { id: 'D19', category: 'Data Interpretation', topic: 'Sensitivity', difficulty: 'Medium', question: 'If small change in input causes large output change, system is?', options: ['Sensitive', 'Robust', 'Stable', 'Neutral'], correctAnswer: 'Sensitive', explanation: 'By definition.' },
  { id: 'D20', category: 'Data Interpretation', topic: 'Ratio Analysis', difficulty: 'Medium', question: 'Current ratio = current assets/current liabilities. If CA=200 CL=100 ratio?', options: ['2', '1', '0.5', '3'], correctAnswer: '2', explanation: '200/100=2.' },
]

export default function AptitudePrep() {
  // State
  const [questions] = useState(questionBank)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { id: { answer, markedForReview:boolean, skipped:boolean, timestamp } }
  const [startedAt, setStartedAt] = useState(null)
  const [remainingSeconds, setRemainingSeconds] = useState(FULL_TEST_MINUTES * 60)
  const [running, setRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState(null)
  const timerRef = useRef(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calcInput, setCalcInput] = useState('')

  // Load saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.version === 1) {
          setAnswers(parsed.answers || {})
          setCurrentIndex(parsed.currentIndex || 0)
          setRemainingSeconds(parsed.remainingSeconds != null ? parsed.remainingSeconds : FULL_TEST_MINUTES * 60)
          setStartedAt(parsed.startedAt || Date.now())
          setRunning(parsed.running || false)
        }
      }
    } catch (e) {
      console.warn('Failed to load saved state', e)
    }
  }, [])

  // Autosave
  useEffect(() => {
    const payload = {
      version: 1,
      answers,
      currentIndex,
      remainingSeconds,
      startedAt,
      running,
      savedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [answers, currentIndex, remainingSeconds, startedAt, running])

  // Timer effect
  useEffect(() => {
    if (running && !submitted) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current)
            handleAutoSubmit()
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, submitted])

  // Handy derived values
  const total = questions.length
  const currentQuestion = questions[currentIndex]

  // Start test
  const startTest = () => {
    setStartedAt(Date.now())
    setRunning(true)
    setSubmitted(false)
    if (!remainingSeconds) setRemainingSeconds(FULL_TEST_MINUTES * 60)
  }

  const saveAnswer = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: { ...(prev[qid] || {}), answer: value, markedForReview: prev[qid]?.markedForReview || false, skipped: false, timestamp: Date.now() } }))
  }

  const toggleMark = (qid) => {
    setAnswers((prev) => ({ ...prev, [qid]: { ...(prev[qid] || {}), markedForReview: !(prev[qid]?.markedForReview), timestamp: Date.now() } }))
  }

  const skipQuestion = (qid) => {
    setAnswers((prev) => ({ ...prev, [qid]: { ...(prev[qid] || {}), skipped: true, timestamp: Date.now() } }))
    goNext()
  }

  const goNext = () => {
    setCurrentIndex((i) => Math.min(total - 1, i + 1))
  }
  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const jumpTo = (idx) => setCurrentIndex(idx)

  const handleSubmit = () => {
    setSubmitted(true)
    setRunning(false)
    computeResults()
  }

  const handleAutoSubmit = () => {
    if (!submitted) {
      setSubmitted(true)
      setRunning(false)
      computeResults()
      // clear saved state to avoid accidental resume
      // keep saved answers for records but mark submitted
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const data = raw ? JSON.parse(raw) : {}
        data.submittedAt = Date.now()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch (e) {
        // ignore
      }
    }
  }

  const computeResults = () => {
    const answerEntries = Object.entries(answers)
    let correct = 0
    let wrong = 0
    const perCategory = {}
    const correctList = []
    const wrongList = []

    questions.forEach((q) => {
      const a = answers[q.id]?.answer
      const isCorrect = a === q.correctAnswer
      if (a == null) {
        // unanswered
        perCategory[q.category] = perCategory[q.category] || { total: 0, correct: 0 }
        perCategory[q.category].total += 1
      } else {
        perCategory[q.category] = perCategory[q.category] || { total: 0, correct: 0 }
        perCategory[q.category].total += 1
        if (isCorrect) {
          correct += 1
          perCategory[q.category].correct += 1
          correctList.push(q.id)
        } else {
          wrong += 1
          wrongList.push(q.id)
        }
      }
    })

    const totalAttempted = correct + wrong
    const accuracy = totalAttempted ? Math.round((correct / totalAttempted) * 10000) / 100 : 0
    const score = Math.round((correct / total) * 10000) / 100 // percentage score

    // identify strong/weak areas
    const strong = []
    const weak = []
    const suggestions = []
    Object.entries(perCategory).forEach(([cat, vals]) => {
      const pct = vals.total ? Math.round((vals.correct / vals.total) * 10000) / 100 : 0
      if (pct >= 75) strong.push({ category: cat, score: pct })
      if (pct < 50) weak.push({ category: cat, score: pct })
      if (pct < 70) suggestions.push(`Practice more on ${cat} (score ${pct}%)`)
    })

    const readiness = Math.min(100, Math.round((score * 0.55) + (accuracy * 0.45)))
    const resultObj = { total, correct, wrong, totalAttempted, accuracy, score, readiness, perCategory, correctList, wrongList, strong, weak, suggestions }
    setResults(resultObj)
  }

  const resetTest = () => {
    setAnswers({})
    setCurrentIndex(0)
    setRemainingSeconds(FULL_TEST_MINUTES * 60)
    setStartedAt(null)
    setRunning(false)
    setSubmitted(false)
    setResults(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Calculator simple evaluation (safe-ish using Function)
  const evalCalc = () => {
    try {
      // replace percentage signs
      const expr = calcInput.replace(/%/g, '/100')
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict";return (${expr})`)()
      return val
    } catch (e) {
      return 'Err'
    }
  }

  const formattedTime = useMemo(() => {
    const mm = Math.floor(remainingSeconds / 60)
    const ss = remainingSeconds % 60
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  }, [remainingSeconds])

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // UI styles (inline)
  const styles = {
    page: { fontFamily: 'Inter, Arial, sans-serif', padding: 20, background: '#071028', color: '#e6eef8', minHeight: '100vh' },
    container: { maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 18, gridTemplateColumns: '1fr 380px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
    title: { fontSize: 24, fontWeight: 800, letterSpacing: 0.4 },
    card: { background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', padding: 18, borderRadius: 18, border: '1px solid rgba(255,255,255,0.04)' },
    qHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
    qText: { fontSize: 18, margin: '14px 0' },
    option: (active) => ({ padding: 14, borderRadius: 14, marginBottom: 10, cursor: 'pointer', background: active ? 'linear-gradient(90deg,#0ea5e9, #7c3aed)' : 'rgba(255,255,255,0.03)', color: active ? '#071028' : '#e6eef8', border: active ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.05)' }),
    paletteGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 12 },
    paletteItem: (s) => ({ padding: 10, borderRadius: 10, textAlign: 'center', cursor: 'pointer', background: s === 'answered' ? '#0ea5e9' : s === 'marked' ? '#f59e0b' : s === 'skipped' ? '#ef4444' : 'rgba(255,255,255,0.03)', color: '#071028', fontWeight: 700, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }),
    categoryPills: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 },
    categoryPill: { padding: '10px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', color: '#cfe7ff', fontWeight: 700, fontSize: 13, border: '1px solid rgba(255,255,255,0.06)' },
    small: { fontSize: 13, color: '#9fb3d8' },
    btn: { padding: '10px 14px', borderRadius: 12, cursor: 'pointer', border: 'none', fontWeight: 700, transition: 'transform 120ms ease, opacity 120ms ease' },
    btnPrimary: { background: 'linear-gradient(90deg,#38bdf8,#8b5cf6)', color: '#071028', boxShadow: '0 16px 28px rgba(56,189,248,0.14)' },
    btnGhost: { background: 'rgba(255,255,255,0.04)', color: '#cfe7ff', border: '1px solid rgba(255,255,255,0.08)' },
    rightColumn: { display: 'grid', gap: 14 },
    calculator: { display: 'grid', gap: 8 },
    progressBarOuter: { height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' },
    progressFill: (pct) => ({ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#38bdf8,#8b5cf6)' }),
    donut: { width: 140, height: 140, borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto', color: '#e6eef8', fontWeight: 800, boxShadow: 'inset 0 0 0 12px rgba(255,255,255,0.04)' },
    statBlock: { padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' },
    barRow: { display: 'grid', gap: 10, marginTop: 12 },
    barLabel: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#b8d0ff' },
    barTrack: { height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
    barFill: (pct) => ({ width: `${pct}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#38bdf8,#8b5cf6)' }),
    futureReady: { marginTop: 16, padding: 16, borderRadius: 16, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.16)' },
  }

  // question palette status helper
  const getStatus = (qid) => {
    const meta = answers[qid]
    if (!meta) return 'unanswered'
    if (meta.skipped) return 'skipped'
    if (meta.markedForReview) return 'marked'
    if (meta.answer) return 'answered'
    return 'unanswered'
  }

  // progress
  const attempted = Object.values(answers).filter((a) => a.answer != null).length
  const progressPct = Math.round((attempted / total) * 100)

  // render
  return (
    <div style={styles.page}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={styles.header}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Aptitude Test Module</div>
            <div style={styles.small}>Dark theme • Responsive • Single-file module • 4 focused categories</div>
            <div style={styles.categoryPills}>
              <div style={styles.categoryPill}>Quantitative Aptitude</div>
              <div style={styles.categoryPill}>Logical Reasoning</div>
              <div style={styles.categoryPill}>Verbal Ability</div>
              <div style={styles.categoryPill}>Data Interpretation</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#9fb3d8' }}>Time Remaining</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{formattedTime}</div>
            </div>
            <div>
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => { startTest(); }}>Start / Resume</button>
            </div>
          </div>
        </div>

        <div style={styles.container}>
          <div>
            <div style={{ ...styles.card }}>
              <div style={styles.qHeader}>
                <div>
                  <div style={{ fontSize: 13, color: '#9fb3d8' }}>{currentQuestion.category} • {currentQuestion.topic} • {currentQuestion.difficulty}</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>Question {currentIndex + 1} of {total}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={styles.small}>Status: <strong>{getStatus(currentQuestion.id)}</strong></div>
                  <div style={{ marginTop: 8 }}>
                    <div style={styles.progressBarOuter}>
                      <div style={styles.progressFill(progressPct)} />
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, color: '#9fb3d8' }}>{attempted} attempted • {progressPct}%</div>
                  </div>
                </div>
              </div>

              <div style={styles.qText}>{currentQuestion.question}</div>

              <div>
                {currentQuestion.options.map((opt) => {
                  const selected = answers[currentQuestion.id]?.answer === opt
                  return (
                    <div key={opt} style={styles.option(selected)} onClick={() => saveAnswer(currentQuestion.id, opt)}>
                      <div>{opt}</div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { toggleMark(currentQuestion.id) }}>{answers[currentQuestion.id]?.markedForReview ? 'Unmark' : 'Mark for Review'}</button>
                <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => skipQuestion(currentQuestion.id)}>Skip</button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={goPrev}>Previous</button>
                  <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={goNext}>Next</button>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, color: '#9fb3d8' }}>Explanation (hidden until submit)</div>
                {submitted && (
                  <div style={{ marginTop: 8, padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                    <div style={{ fontWeight: 700 }}>{currentQuestion.correctAnswer}</div>
                    <div style={{ marginTop: 8, color: '#b6cbea' }}>{currentQuestion.explanation}</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 12, ...styles.card }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800 }}>Question Palette</div>
                <div style={styles.small}>Click a tile to jump</div>
              </div>

              <div style={styles.paletteGrid}>
                {questions.map((q, idx) => {
                  const status = getStatus(q.id)
                  return (
                    <div key={q.id} style={styles.paletteItem(status)} onClick={() => jumpTo(idx)}>{idx + 1}</div>
                  )
                })}
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setShowCalculator(s => !s) }}>{showCalculator ? 'Hide Calculator' : 'Calculator'}</button>
                <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setAnswers(prev => ({ ...prev, [currentQuestion.id]: { ...(prev[currentQuestion.id] || {}), answer: null } })); }}>Clear Answer</button>
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => handleSubmit()}>Submit Test</button>
                <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={resetTest}>Reset</button>
              </div>
            </div>

            {showCalculator && (
              <div style={{ marginTop: 12, ...styles.card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800 }}>Built-in Calculator</div>
                  <div style={styles.small}>Supports + - * / % and parentheses</div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <input value={calcInput} onChange={(e) => setCalcInput(e.target.value)} placeholder="Enter expression like (25+5)*0.2" style={{ flex: 1, padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: '#e6eef8' }} />
                  <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => { const val = evalCalc(); setCalcInput(String(val)) }}>Calc</button>
                </div>
                <div style={{ marginTop: 8, color: '#9fb3d8' }}>Result preview: <strong>{calcInput ? String(evalCalc()) : '—'}</strong></div>
              </div>
            )}

          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.card}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#9fb3d8' }}>Real-time Dashboard</div>
                <div style={{ fontWeight: 800, fontSize: 22 }}>Live Performance</div>
              </div>
              <div style={{ display: 'grid', placeItems: 'center', gap: 12 }}>
                <div style={{ ...styles.donut, background: `conic-gradient(#38bdf8 ${Math.min(submitted ? results?.score : Math.round((attempted / total) * 100), 100) * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24 }}>{submitted ? results?.score ?? 0 : Math.round((attempted / total) * 100)}%</div>
                    <div style={{ fontSize: 12, color: '#9fb3d8' }}>Current Score</div>
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <div style={styles.barLabel}><span>Answered</span><span>{progressPct}%</span></div>
                  <div style={styles.barTrack}><div style={styles.barFill(progressPct)} /></div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'grid', gap: 10 }}>
                  {['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'].map((cat) => {
                    const catQs = questions.filter(q => q.category === cat).length
                    const catAttempted = questions.filter(q => q.category === cat).filter(q => answers[q.id]?.answer != null).length
                    const pct = Math.round((catAttempted / catQs) * 100)
                    return (
                      <div key={cat}>
                        <div style={styles.barLabel}><span>{cat}</span><span>{pct}%</span></div>
                        <div style={styles.barTrack}><div style={styles.barFill(pct)} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={{ fontWeight: 800 }}>Timer & Controls</div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, color: '#9fb3d8' }}>Total Time</div>
                <div style={{ fontWeight: 800 }}>{FULL_TEST_MINUTES} minutes</div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { setRunning(r => !r) }}>{running ? 'Pause' : 'Resume'}</button>
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => { handleSubmit() }}>Submit</button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={{ fontWeight: 800 }}>Analytics (Live)</div>
              <div style={{ marginTop: 8 }}>
                <div style={styles.small}>Attempted</div>
                <div style={{ fontWeight: 800 }}>{attempted}</div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={styles.small}>Answered %</div>
                <div style={{ fontWeight: 800 }}>{progressPct}%</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={styles.small}>Category overview</div>
                <div style={{ marginTop: 8 }}>
                  {['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'].map((cat) => {
                    const catQs = questions.filter(q => q.category === cat).length
                    const catAttempted = questions.filter(q => q.category === cat).filter(q => answers[q.id]?.answer != null).length
                    const pct = Math.round((catAttempted / catQs) * 100)
                    return (
                      <div key={cat} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><div style={{ fontSize: 13 }}>{cat}</div><div style={{ fontWeight: 800 }}>{pct}%</div></div>
                        <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#38bdf8,#8b5cf6)' }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div style={{ ...styles.card }}>
              <div style={{ fontWeight: 800 }}>Premium Practice</div>
              <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
                <div style={styles.statBlock}>
                  <div style={{ fontWeight: 800 }}>Most Repeated Interview Patterns</div>
                  <div style={{ marginTop: 6, color: '#9fb3d8' }}>Pattern-based drills that mirror real aptitude screening rounds.</div>
                </div>
                <div style={styles.statBlock}>
                  <div style={{ fontWeight: 800 }}>High Frequency Questions</div>
                  <div style={{ marginTop: 6, color: '#9fb3d8' }}>Practice questions drawn from high-impact sections across all categories.</div>
                </div>
                <div style={styles.statBlock}>
                  <div style={{ fontWeight: 800 }}>AI Recommended Practice</div>
                  <div style={{ marginTop: 6, color: '#9fb3d8' }}>Future-ready recommendation engine ready for AI insights and personalization.</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}><button style={{ ...styles.btn, ...styles.btnPrimary }}>Explore Premium Sets</button></div>
            </div>

          </aside>
        </div>

        {/* Results modal */}
        {submitted && results && (
          <div style={{ marginTop: 18, ...styles.card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>Test Results</div>
                <div style={{ color: '#9fb3d8' }}>Summary and actionable insights</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{results.score}%</div>
                <div style={{ color: '#9fb3d8' }}>Accuracy: {results.accuracy}%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontWeight: 800 }}>Detailed</div>
                <div style={{ marginTop: 8 }}>Total Questions: {results.total}</div>
                <div>Attempted: {results.totalAttempted}</div>
                <div>Correct: {results.correct}</div>
                <div>Wrong: {results.wrong}</div>
              </div>

              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontWeight: 800 }}>Category Performance</div>
                <div style={{ marginTop: 8 }}>
                  {Object.entries(results.perCategory).map(([cat, vals]) => {
                    const pct = vals.total ? Math.round((vals.correct / vals.total) * 10000) / 100 : 0
                    return (
                      <div key={cat} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>{cat}</div><div style={{ fontWeight: 800 }}>{pct}%</div></div>
                        <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.02)' }}><div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#38bdf8,#8b5cf6)' }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={styles.statBlock}>
                  <div style={{ fontSize: 13, color: '#9fb3d8' }}>Interview Readiness</div>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{results.readiness}%</div>
                  <div style={{ marginTop: 8, color: '#b6cbea' }}>A composite readiness score for aptitude screening readiness.</div>
                </div>
                <div style={styles.statBlock}>
                  <div style={{ fontSize: 13, color: '#9fb3d8' }}>Accuracy</div>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{results.accuracy}%</div>
                  <div style={{ marginTop: 8, color: '#b6cbea' }}>Precision of attempted answers.</div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ fontWeight: 800 }}>Strengths</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {results.strong.length ? results.strong.map((s) => (
                    <div key={s.category} style={{ padding: 10, borderRadius: 12, background: '#0ea5e9', color: '#071028', fontWeight: 700 }}>{s.category} {s.score}%</div>
                  )) : <div style={{ color: '#b6cbea' }}>No clear strengths yet</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ fontWeight: 800 }}>Weak Areas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {results.weak.length ? results.weak.map((s) => (
                    <div key={s.category} style={{ padding: 10, borderRadius: 12, background: '#ef4444', color: '#071028', fontWeight: 700 }}>{s.category} {s.score}%</div>
                  )) : <div style={{ color: '#b6cbea' }}>No major weaknesses found</div>}
                </div>
              </div>

              <div style={styles.statBlock}>
                <div style={{ fontWeight: 800 }}>Improvement Suggestions</div>
                <ul style={{ marginTop: 8, paddingLeft: 18, color: '#b6cbea' }}>
                  {results.suggestions.length ? results.suggestions.map((s, i) => <li key={i}>{s}</li>) : <li>Keep practicing to improve accuracy and speed.</li>}
                </ul>
              </div>

              <div style={styles.futureReady}>
                <div style={{ fontWeight: 800 }}>Future Ready</div>
                <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                  <div>• AI Recommendations ready for integration</div>
                  <div>• Interview Readiness Score with personalized guidance</div>
                  <div>• Webcam monitoring placeholder for proctoring</div>
                  <div>• Voice analysis placeholder for oral readiness</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => { /* export or next steps */ }}>Download Report</button>
                <button style={{ ...styles.btn, ...styles.btnGhost }} onClick={() => { /* suggest practice sets */ }}>Recommend Practice</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
