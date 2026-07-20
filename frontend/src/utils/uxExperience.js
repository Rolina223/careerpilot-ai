export function calculateResumeProgress(resumeData) {
  const personal = resumeData?.personalInfo || {}
  const points = [
    !!personal.fullName,
    !!personal.summary,
    !!personal.email,
    !!personal.linkedin || !!personal.github,
    (resumeData?.experience || []).some(item => item?.company || item?.position || item?.description),
    (resumeData?.projects || []).some(item => item?.name || item?.description),
    (resumeData?.skills || []).filter(Boolean).length >= 4,
    (resumeData?.education || []).some(item => item?.school || item?.degree),
    (resumeData?.certifications || []).some(item => item?.name || item?.issuer),
  ]

  const completed = points.filter(Boolean).length
  const percent = Math.round((completed / points.length) * 100)

  const milestones = [
    { label: 'Starter profile', threshold: 30, message: 'You have the basics in place.' },
    { label: 'Ready to impress', threshold: 60, message: 'Your resume is shaping up nicely.' },
    { label: 'Application-ready', threshold: 90, message: 'You are close to a polished resume.' },
  ]

  const nextMilestone = milestones.find(item => percent < item.threshold) || milestones[milestones.length - 1]

  return { percent, completed, total: points.length, nextMilestone }
}

export function getResumeRecommendations(resumeData) {
  const recs = []
  const personal = resumeData?.personalInfo || {}

  if (!personal.summary) {
    recs.push({
      title: 'Write a sharper summary',
      detail: 'A strong opening line helps hiring teams understand your fit instantly.',
      action: 'Generate summary',
      to: '/resume-builder',
    })
  }

  if (!(resumeData?.skills || []).filter(Boolean).length) {
    recs.push({
      title: 'Add your strongest skills',
      detail: 'Skills make your resume easier to match and easier to scan.',
      action: 'Suggest skills',
      to: '/resume-builder',
    })
  }

  if (!(resumeData?.experience || []).some(item => item?.description)) {
    recs.push({
      title: 'Describe your experience',
      detail: 'Turn your work history into impact-focused bullets for recruiters.',
      action: 'Add experience',
      to: '/resume-builder',
    })
  }

  if (!personal.linkedin && !personal.github) {
    recs.push({
      title: 'Link your profiles',
      detail: 'Professional links improve trust and make your profile easier to verify.',
      action: 'Add links',
      to: '/resume-builder',
    })
  }

  if (!recs.length) {
    recs.push({
      title: 'Analyze your fit',
      detail: 'Use the AI analyzer to compare your resume against the role you want.',
      action: 'Analyze resume',
      to: '/analyze',
    })
  }

  return recs.slice(0, 3)
}

export function getSmartDefaults(resumeData) {
  const personal = resumeData?.personalInfo || {}
  const summary = personal.summary || 'Motivated software engineer building practical, user-focused products with a strong foundation in modern web technologies.'
  const skills = (resumeData?.skills || []).filter(Boolean)
  const starterSkills = skills.length ? skills : ['React', 'JavaScript', 'Problem solving', 'Communication']

  return {
    summary,
    skills: starterSkills,
    headline: personal.headline || 'Software Engineer',
  }
}

export function getPredictiveSuggestions(resumeData) {
  const hasExperience = (resumeData?.experience || []).some(item => item?.description)
  const hasProjects = (resumeData?.projects || []).some(item => item?.name)
  const hasSkills = (resumeData?.skills || []).filter(Boolean).length >= 4

  const suggestions = []

  if (!hasExperience) {
    suggestions.push('Start with your latest role and add impact-focused bullets.')
  }
  if (!hasProjects) {
    suggestions.push('Add one project to show practical problem solving and ownership.')
  }
  if (!hasSkills) {
    suggestions.push('Include a focused skill set that matches the roles you want.')
  }

  if (!suggestions.length) {
    suggestions.push('You are in a strong place—run the AI analyzer to sharpen your target fit.')
  }

  return suggestions.slice(0, 3)
}
