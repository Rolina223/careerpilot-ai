  const stopWords = new Set([
    'and', 'the', 'for', 'with', 'from', 'that', 'this', 'will', 'your', 'have', 'has', 'are', 'is', 'was', 'were', 'a', 'an', 'of', 'in', 'to', 'on', 'by', 'as', 'or', 'be', 'it', 'at', 'we', 'our', 'you', 'role', 'job', 'candidate', 'team', 'results', 'skills', 'experience', 'work', 'project', 'projects', 'resume', 'developer', 'engineer', 'manager', 'position', 'based'
  ]);

  const templateAtsFactors = {
    ats: 1.0,
    modern: 0.94,
    executive: 0.9,
    creative: 0.82,
  };

  const roleBenchmarks = {
    dotnet: { average: 68, top10: 91 },
    frontend: { average: 72, top10: 94 },
    fullstack: { average: 75, top10: 96 },
    backend: { average: 70, top10: 92 },
    qa: { average: 64, top10: 88 },
    dataanalyst: { average: 69, top10: 90 },
    devops: { average: 71, top10: 93 },
    android: { average: 71, top10: 92 },
  };

  function normalizeText(value) {
    return (value || '').toString().toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  }

  function extractKeywords(text) {
    const tokens = normalizeText(text).split(/\s+/).filter(Boolean);
    const keywords = new Set();

    tokens.forEach((token) => {
      if (token.length > 2 && !stopWords.has(token)) {
        keywords.add(token);
      }
    });

    return Array.from(keywords);
  }

  function countFilled(fields = []) {
    return fields.filter(Boolean).length;
  }

  function getTemplateImpact(templateId) {
    return templateAtsFactors[templateId] || templateAtsFactors.ats;
  }

  export function buildKeywordCoverage(resumeData, jobDescription = '') {
    const keywords = extractKeywords(jobDescription);
    if (!keywords.length) {
      return { matchedKeywords: [], missingKeywords: [], coverage: 0 };
    }

    const resumeText = normalizeText([
      resumeData.personalInfo.fullName,
      resumeData.personalInfo.summary,
      resumeData.personalInfo.linkedin,
      resumeData.personalInfo.github,
      resumeData.personalInfo.portfolio,
      ...resumeData.experience.flatMap((item) => [item.company, item.position, item.description, ...(item.achievements || [])]),
      ...resumeData.projects.flatMap((item) => [item.name, item.techStack, item.description]),
      ...resumeData.education.flatMap((item) => [item.school, item.degree, item.field]),
      ...resumeData.certifications.flatMap((item) => [item.name, item.issuer]),
    ].join(' '));

    const matchedKeywords = [];
    const missingKeywords = [];

    keywords.forEach((keyword) => {
      if (resumeText.includes(keyword)) {
        matchedKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });

    return {
      matchedKeywords,
      missingKeywords,
      coverage: Math.round((matchedKeywords.length / keywords.length) * 100),
    };
  }

  export function getHealthChecklist(resumeData) {
    const personal = resumeData.personalInfo;
    const hasProjects = resumeData.projects.some((item) => item.name && item.description);
    const hasSkills = resumeData.skills.some((skill) => !!skill);
    const hasExperience = resumeData.experience.some((item) => item.company && item.position);
    const hasAchievements = resumeData.experience.some((item) => (item.achievements || []).some(Boolean));
    const hasCertifications = resumeData.certifications.some((item) => item.name && item.issuer);

    return [
      { label: 'Contact information present', status: !!(personal.email || personal.phone || personal.location), type: 'success' },
      { label: 'Skills added', status: hasSkills, type: hasSkills ? 'success' : 'warning' },
      { label: 'Projects added', status: hasProjects, type: hasProjects ? 'success' : 'warning' },
      { label: 'Experience added', status: hasExperience, type: hasExperience ? 'success' : 'warning' },
      { label: 'Summary section present', status: !!personal.summary, type: personal.summary ? 'success' : 'warning' },
      { label: 'LinkedIn profile added', status: !!personal.linkedin, type: personal.linkedin ? 'success' : 'warning' },
      { label: 'GitHub profile added', status: !!personal.github, type: personal.github ? 'success' : 'warning' },
      { label: 'Portfolio URL added', status: !!personal.portfolio, type: personal.portfolio ? 'success' : 'warning' },
      { label: 'Certifications added', status: hasCertifications, type: hasCertifications ? 'success' : 'warning' },
      { label: 'Achievements included', status: hasAchievements, type: hasAchievements ? 'success' : 'warning' },
    ];
  }

  export function getIndustryBenchmark(roleValue = 'fullstack') {
    return roleBenchmarks[roleValue] || roleBenchmarks.fullstack;
  }

  function getCompletenessScore(resumeData) {
    const fields = [
      resumeData.personalInfo.fullName,
      resumeData.personalInfo.email,
      resumeData.personalInfo.phone,
      resumeData.personalInfo.location,
      resumeData.personalInfo.summary,
      resumeData.personalInfo.linkedin,
      resumeData.personalInfo.github,
      resumeData.personalInfo.portfolio,
    ];

    const sectionCount = [
      resumeData.experience.some((item) => item.company && item.position),
      resumeData.projects.some((item) => item.name && item.description),
      resumeData.education.some((item) => item.school && item.degree),
      resumeData.certifications.some((item) => item.name && item.issuer),
      resumeData.skills.some((skill) => !!skill),
    ].filter(Boolean).length;

    const fieldScore = Math.round((countFilled(fields) / fields.length) * 100);
    const sectionScore = Math.round((sectionCount / 5) * 100);

    return Math.round((fieldScore * 0.65) + (sectionScore * 0.35));
  }

  function getExperienceQualityScore(resumeData) {
    const entries = resumeData.experience.filter((item) => item.company || item.position || item.description);
    if (!entries.length) return 0;

    const completeEntries = entries.filter((item) => item.company && item.position && item.description).length;
    const achievementCount = entries.reduce((sum, item) => sum + (item.achievements || []).filter(Boolean).length, 0);
    const descriptionCoverage = Math.min(1, entries.reduce((sum, item) => sum + (item.description?.trim().length || 0), 0) / (entries.length * 120));

    return Math.round((completeEntries / entries.length) * 50 + Math.min(achievementCount, 6) * 8 + descriptionCoverage * 10);
  }

  function getSkillsQualityScore(resumeData) {
    const skillSet = new Set(resumeData.skills.filter((skill) => skill?.trim()).map((skill) => skill.toLowerCase()));
    const count = skillSet.size;

    const diversityScore = Math.min(1, count / 12);
    const baseline = Math.min(100, Math.max(0, count * 8));

    return Math.round((baseline * 0.8) + (diversityScore * 20));
  }

  function getProjectsScore(resumeData) {
    const projects = resumeData.projects.filter((item) => item.name && item.description);
    if (!projects.length) return 0;

    const portfolioStrength = projects.reduce((sum, item) => sum + (item.githubLink ? 1.2 : 1), 0);
    const score = Math.min(100, (projects.length * 20) + (portfolioStrength - projects.length) * 8);
    return Math.round(score);
  }

  function getEducationScore(resumeData) {
    const entries = resumeData.education.filter((item) => item.school && item.degree);
    return Math.min(100, entries.length * 40);
  }

  function getCertificationsScore(resumeData) {
    const count = resumeData.certifications.filter((item) => item.name && item.issuer).length;
    return Math.min(100, count * 34);
  }

  function getProfessionalPresenceScore(resumeData) {
    const summaryLength = resumeData.personalInfo.summary?.trim().length || 0;
    const hasSummary = summaryLength >= 80;
    const linkCount = countFilled([resumeData.personalInfo.linkedin, resumeData.personalInfo.github, resumeData.personalInfo.portfolio]);
    const presenceScore = Math.min(100, hasSummary ? 50 : 25 + Math.min(3, linkCount) * 15);
    return Math.round(presenceScore + Math.min(20, summaryLength / 5));
  }

  function getAtsCompatibilityScore(resumeData, selectedTemplate, jobDescription) {
    const contactPresent = countFilled([resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location]) >= 2;
    const summaryPresent = !!resumeData.personalInfo.summary;
    const keywordCoverage = buildKeywordCoverage(resumeData, jobDescription).coverage;

    const templateFactor = getTemplateImpact(selectedTemplate);
    const baseScore = Math.round((contactPresent ? 35 : 20) + (summaryPresent ? 25 : 10) + (keywordCoverage * 0.4));
    const finalScore = Math.round(Math.min(100, baseScore * templateFactor));

    return { baseScore, templateFactor, score: finalScore };
  }

  export function calculateResumeScore(resumeData, selectedTemplate, jobDescription = '') {
    const overallWeights = {
      atsCompatibility: 0.18,
      completeness: 0.16,
      experienceQuality: 0.17,
      skillsQuality: 0.15,
      projects: 0.11,
      education: 0.09,
      certifications: 0.07,
      professionalPresence: 0.07,
    };

    const ats = getAtsCompatibilityScore(resumeData, selectedTemplate, jobDescription).score;
    const completeness = getCompletenessScore(resumeData);
    const experienceQuality = getExperienceQualityScore(resumeData);
    const skillsQuality = getSkillsQualityScore(resumeData);
    const projects = getProjectsScore(resumeData);
    const education = getEducationScore(resumeData);
    const certifications = getCertificationsScore(resumeData);
    const professionalPresence = getProfessionalPresenceScore(resumeData);

    const overall = Math.round(
      ats * overallWeights.atsCompatibility +
        completeness * overallWeights.completeness +
        experienceQuality * overallWeights.experienceQuality +
        skillsQuality * overallWeights.skillsQuality +
        projects * overallWeights.projects +
        education * overallWeights.education +
        certifications * overallWeights.certifications +
        professionalPresence * overallWeights.professionalPresence
    );

    return {
      overall,
      atsCompatibility: ats,
      completeness,
      experienceQuality,
      skillsQuality,
      projects,
      education,
      certifications,
      professionalPresence,
      templateImpact: getTemplateImpact(selectedTemplate),
    };
  }

  export function getTemplateAtsImpact(selectedTemplate) {
    const factor = getTemplateImpact(selectedTemplate);
    return {
      factor,
      label: selectedTemplate === 'creative' ? 'Minimal ATS support' : selectedTemplate === 'executive' ? 'Higher visual polish' : selectedTemplate === 'modern' ? 'Balanced ATS + design' : 'Highest ATS compatibility',
    };
  }

  export function getRoleBenchmark(roleValue) {
    return getIndustryBenchmark(roleValue);
  }
