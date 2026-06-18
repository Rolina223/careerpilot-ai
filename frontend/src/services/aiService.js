const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateProfessionalSummary(personalInfo, experience, education) {
  await delay(300);

  const responsiveSummary = personalInfo.summary || '';
  const focusedArea = experience.filter((item) => item.position || item.company).slice(0, 2);
  const topSkills = personalInfo.linkedin || personalInfo.github || personalInfo.portfolio ? 'technology, teamwork, and communication' : 'technology, teamwork, and communication';

  if (responsiveSummary.trim()) {
    return `${responsiveSummary.trim()} This version is sharpened to highlight impact, collaboration, and measurable outcomes.`;
  }

  const summaryParts = [
    `${personalInfo.fullName || 'A driven professional'} with experience across modern web and product teams.`,
    focusedArea.length
      ? `Delivered results in roles such as ${focusedArea.map((item) => item.position || 'a key contributor').join(' and ')}.`
      : 'Experienced in building polished digital products with customer-focused design.',
    `Strong background in ${topSkills}.`,
  ];

  return summaryParts.join(' ');
}

export async function suggestSkills(experience, projects, certifications) {
  await delay(300);

  const skillPool = new Set([
    'React',
    'Node.js',
    'JavaScript',
    'TypeScript',
    'Python',
    'AWS',
    'Git',
    'Figma',
    'SQL',
    'REST APIs',
    'Problem Solving',
    'Agile',
    'Project Management',
  ]);

  experience.forEach((item) => {
    if (item.position.toLowerCase().includes('product')) skillPool.add('Product Roadmap');
    if (item.position.toLowerCase().includes('engineer')) skillPool.add('Software Development');
    if (item.description.toLowerCase().includes('cloud')) skillPool.add('Cloud Architecture');
    if (item.description.toLowerCase().includes('automation')) skillPool.add('Automation');
  });

  projects.forEach((project) => {
    if (project.techStack.toLowerCase().includes('react')) skillPool.add('React');
    if (project.techStack.toLowerCase().includes('node')) skillPool.add('Node.js');
    if (project.techStack.toLowerCase().includes('python')) skillPool.add('Python');
  });

  certifications.forEach((cert) => {
    if (cert.name.toLowerCase().includes('aws')) skillPool.add('AWS');
    if (cert.name.toLowerCase().includes('scrum')) skillPool.add('Scrum');
  });

  return Array.from(skillPool).slice(0, 10);
}

export async function improveExperienceDescription(description, achievements) {
  await delay(300);

  const base = description.trim() || 'Led key projects and delivered results with a focus on quality and speed.';
  const achievementText = achievements.filter(Boolean).map((item) => `• ${item}`).join(' ');

  return `${base} ${achievementText}`.trim();
}
