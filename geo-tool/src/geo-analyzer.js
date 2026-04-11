/**
 * GEO Analyzer — Generative Engine Optimization analysis engine.
 *
 * Scores social media content on factors that make it discoverable
 * by LLMs (ChatGPT, Claude, Perplexity, Gemini, etc.) and provides
 * concrete rewrite suggestions.
 */

// ---------------------------------------------------------------------------
// Scoring weights — each factor contributes to a 0-100 GEO score
// ---------------------------------------------------------------------------
const WEIGHTS = {
  clarity: 15,          // Clear, unambiguous language
  entityDensity: 15,    // Named entities (people, brands, places, products)
  factualClaims: 15,    // Verifiable facts & statistics
  questionAnswering: 10, // Content that directly answers common questions
  structuredFormat: 10, // Lists, key-value pairs, structured sentences
  quotability: 10,      // Short, self-contained quotable statements
  topicSignals: 10,     // Strong topic/niche signals
  hashtagQuality: 8,    // Descriptive, searchable hashtags
  callToAction: 7,      // Engagement signals (LLMs sometimes weigh popularity)
};

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text) {
  return (text.match(/[.!?]+/g) || []).length || 1;
}

function averageWordsPerSentence(text) {
  return countWords(text) / countSentences(text);
}

/** Detect named entities (simple heuristic: capitalised multi-word phrases). */
function extractEntities(text) {
  const matches = text.match(/(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g) || [];
  // Also grab @mentions and obvious brand names
  const mentions = text.match(/@[\w.]+/g) || [];
  return [...new Set([...matches, ...mentions])];
}

/** Detect numbers / statistics. */
function extractStats(text) {
  return text.match(/\d[\d,.]*%?|\$[\d,.]+/g) || [];
}

/** Detect hashtags. */
function extractHashtags(text) {
  return text.match(/#[\w]+/g) || [];
}

/** Detect questions in the text. */
function extractQuestions(text) {
  return text.match(/[^.!?\n]*\?/g) || [];
}

/** Detect list-like structures (lines starting with - or numbers). */
function detectLists(text) {
  const listLines = text.split('\n').filter(l => /^\s*[-•*]\s|^\s*\d+[.)]\s/.test(l));
  return listLines;
}

/** Check for quotable one-liners (short sentences that stand alone well). */
function extractQuotables(text) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.filter(s => {
    const wc = countWords(s);
    return wc >= 5 && wc <= 25;
  });
}

// ---------------------------------------------------------------------------
// Individual scoring functions — each returns { score: 0-100, feedback }
// ---------------------------------------------------------------------------

function scoreClaritiy(text) {
  const avgWPS = averageWordsPerSentence(text);
  const wordCount = countWords(text);
  let score = 100;
  const feedback = [];

  // Penalise very long sentences
  if (avgWPS > 25) { score -= 30; feedback.push('Sentences are too long — aim for under 20 words each.'); }
  else if (avgWPS > 20) { score -= 15; feedback.push('Some sentences are long — shorter sentences are easier for LLMs to quote.'); }

  // Penalise very short content (too little signal)
  if (wordCount < 15) { score -= 25; feedback.push('Content is very short — add more context so LLMs have enough to work with.'); }

  // Check for filler / vague words
  const fillers = (text.match(/\b(stuff|things|really|very|basically|just|like|literally|actually|honestly)\b/gi) || []);
  if (fillers.length > 2) { score -= 15; feedback.push(`Reduce filler words (${fillers.slice(0, 3).join(', ')}…). Use precise language.`); }

  return { score: Math.max(0, score), feedback };
}

function scoreEntityDensity(text) {
  const entities = extractEntities(text);
  const words = countWords(text);
  const density = entities.length / Math.max(words, 1);
  let score;
  const feedback = [];

  if (entities.length === 0) {
    score = 20;
    feedback.push('No named entities found. Mention specific people, brands, places, or products so LLMs can link your content to known topics.');
  } else if (density < 0.02) {
    score = 50;
    feedback.push(`Found ${entities.length} entity/entities (${entities.join(', ')}). Adding more specific names improves discoverability.`);
  } else {
    score = 85 + Math.min(15, entities.length * 3);
    feedback.push(`Good entity density — mentions: ${entities.join(', ')}.`);
  }

  return { score: Math.min(100, score), feedback };
}

function scoreFactualClaims(text) {
  const stats = extractStats(text);
  let score;
  const feedback = [];

  if (stats.length === 0) {
    score = 25;
    feedback.push('No statistics or numbers found. Adding data points (percentages, dollar amounts, dates) makes content more citable by LLMs.');
  } else if (stats.length === 1) {
    score = 60;
    feedback.push(`One data point found (${stats[0]}). Adding 2-3 more strengthens factual authority.`);
  } else {
    score = 75 + Math.min(25, stats.length * 8);
    feedback.push(`${stats.length} data points found — strong factual signal.`);
  }

  return { score: Math.min(100, score), feedback };
}

function scoreQuestionAnswering(text) {
  const questions = extractQuestions(text);
  let score;
  const feedback = [];

  if (questions.length > 0) {
    score = 85;
    feedback.push('Content includes question-answer patterns — great for LLM retrieval.');
  } else {
    score = 40;
    feedback.push('Consider framing part of your post as a question + answer. LLMs love Q&A-style content (e.g., "How do you…? Here\'s how:").');
  }

  return { score, feedback };
}

function scoreStructuredFormat(text) {
  const lists = detectLists(text);
  const hasLineBreaks = (text.match(/\n/g) || []).length >= 2;
  let score = 30;
  const feedback = [];

  if (lists.length >= 2) { score += 40; feedback.push('List structure detected — LLMs can easily extract bullet points.'); }
  if (hasLineBreaks) { score += 20; feedback.push('Good use of line breaks for readability.'); }
  if (score <= 30) { feedback.push('Add structure: use bullet points, numbered lists, or line breaks. Structured content is easier for LLMs to parse and cite.'); }

  return { score: Math.min(100, score), feedback };
}

function scoreQuotability(text) {
  const quotables = extractQuotables(text);
  let score;
  const feedback = [];

  if (quotables.length === 0) {
    score = 30;
    feedback.push('No easily quotable sentences found. Include 1-2 concise takeaway sentences that LLMs can directly cite.');
  } else {
    score = 60 + Math.min(40, quotables.length * 15);
    feedback.push(`${quotables.length} quotable sentence(s) found — LLMs can cite these directly.`);
  }

  return { score: Math.min(100, score), feedback };
}

function scoreTopicSignals(text) {
  // Look for strong topical / niche keywords (repeated important words)
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const freq = {};
  const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','shall','should','may','might','must','can','could','and','but','or','nor','for','yet','so','in','on','at','to','from','by','with','of','it','this','that','i','me','my','you','your','we','our','they','their','he','she','his','her','its','not','no','if','then','than','when','what','how','who','which','where','why','all','each','every','both','few','more','most','other','some','such','only','same','just','also','very','really']);
  words.forEach(w => { if (w.length > 3 && !stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const topTerms = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const repeated = topTerms.filter(([, c]) => c >= 2);

  let score;
  const feedback = [];

  if (repeated.length >= 2) {
    score = 80;
    feedback.push(`Strong topic signals: ${repeated.map(([w]) => w).join(', ')}. LLMs can easily categorize this content.`);
  } else if (repeated.length === 1) {
    score = 55;
    feedback.push(`One repeated topic term ("${repeated[0][0]}"). Reinforce your niche with 1-2 more related keywords.`);
  } else {
    score = 30;
    feedback.push('No clear topic signal. Repeat your core keywords 2-3 times naturally so LLMs associate your content with that topic.');
  }

  return { score, feedback };
}

function scoreHashtagQuality(text) {
  const hashtags = extractHashtags(text);
  let score;
  const feedback = [];

  if (hashtags.length === 0) {
    score = 20;
    feedback.push('No hashtags found. Add 3-8 descriptive hashtags that match search queries people type into LLMs.');
  } else if (hashtags.length < 3) {
    score = 50;
    feedback.push(`Only ${hashtags.length} hashtag(s). Aim for 3-8 descriptive ones.`);
  } else if (hashtags.length > 15) {
    score = 50;
    feedback.push('Too many hashtags — trim to 5-10 high-quality, specific ones. Spam-like hashtag blocks reduce trust signals.');
  } else {
    score = 80;
    // Check descriptiveness (longer hashtags = more descriptive)
    const descriptive = hashtags.filter(h => h.length > 8);
    if (descriptive.length >= 2) {
      score = 95;
      feedback.push(`Great hashtag set (${hashtags.length} tags, ${descriptive.length} descriptive). These help LLMs categorize your content.`);
    } else {
      feedback.push(`${hashtags.length} hashtags found. Consider making them more descriptive (e.g., #SocialMediaMarketing instead of #SMM).`);
    }
  }

  return { score: Math.min(100, score), feedback };
}

function scoreCallToAction(text) {
  const ctaPatterns = /\b(comment|share|tag|follow|click|visit|check out|learn more|sign up|subscribe|dm|message|link in bio|save this|bookmark)\b/i;
  const hasCTA = ctaPatterns.test(text);
  let score;
  const feedback = [];

  if (hasCTA) {
    score = 85;
    feedback.push('Call-to-action detected — engagement signals can indirectly boost LLM visibility through popularity metrics.');
  } else {
    score = 35;
    feedback.push('Add a call-to-action (e.g., "Save this for later" or "Share with someone who needs this"). Engagement boosts content visibility to LLM training pipelines.');
  }

  return { score, feedback };
}

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------

function analyzeContent(text, platform = 'general') {
  const scores = {
    clarity: scoreClaritiy(text),
    entityDensity: scoreEntityDensity(text),
    factualClaims: scoreFactualClaims(text),
    questionAnswering: scoreQuestionAnswering(text),
    structuredFormat: scoreStructuredFormat(text),
    quotability: scoreQuotability(text),
    topicSignals: scoreTopicSignals(text),
    hashtagQuality: scoreHashtagQuality(text),
    callToAction: scoreCallToAction(text),
  };

  // Weighted total
  let totalScore = 0;
  for (const [key, { score }] of Object.entries(scores)) {
    totalScore += (score / 100) * WEIGHTS[key];
  }
  totalScore = Math.round(totalScore);

  // Collect all feedback
  const allFeedback = [];
  for (const [key, { score, feedback }] of Object.entries(scores)) {
    allFeedback.push({
      factor: key,
      score,
      weight: WEIGHTS[key],
      feedback: feedback.join(' '),
    });
  }

  // Sort: worst scores first for priority fixing
  allFeedback.sort((a, b) => a.score - b.score);

  // Platform-specific tips
  const platformTips = getPlatformTips(text, platform);

  return {
    overallScore: totalScore,
    grade: gradeFromScore(totalScore),
    wordCount: countWords(text),
    sentenceCount: countSentences(text),
    entities: extractEntities(text),
    hashtags: extractHashtags(text),
    stats: extractStats(text),
    factors: allFeedback,
    platformTips,
    topImprovements: allFeedback.slice(0, 3).map(f => f.feedback),
  };
}

function gradeFromScore(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function getPlatformTips(text, platform) {
  const tips = [];

  if (platform === 'facebook' || platform === 'general') {
    if (countWords(text) < 40) tips.push('Facebook: Longer posts (40-80 words) tend to get more engagement and provide more content for LLMs to index.');
    if (!text.includes('http') && !text.includes('link')) tips.push('Facebook: Consider adding a link to a detailed blog or page — LLMs often crawl linked content for deeper context.');
    if (extractQuestions(text).length === 0) tips.push('Facebook: Posts with questions drive comments, which boosts visibility in LLM training data.');
  }

  if (platform === 'instagram' || platform === 'general') {
    const hashtags = extractHashtags(text);
    if (hashtags.length < 5) tips.push('Instagram: Use 5-15 niche hashtags. Descriptive hashtags (not generic ones like #love) help LLMs categorize your content.');
    if (countWords(text) < 20) tips.push('Instagram: Write a substantive caption (50+ words). Instagram captions are now indexed and LLMs read them.');
    if (!text.toLowerCase().includes('alt text') && !text.toLowerCase().includes('image description')) {
      tips.push('Instagram: Add alt text to your images describing what\'s in the photo. LLMs use alt text to understand visual content.');
    }
  }

  return tips;
}

// ---------------------------------------------------------------------------
// Content rewriter — generates an LLM-optimized version
// ---------------------------------------------------------------------------

function generateOptimizedVersion(text, platform = 'general') {
  const entities = extractEntities(text);
  const hashtags = extractHashtags(text);
  const questions = extractQuestions(text);
  const stats = extractStats(text);

  const suggestions = [];

  suggestions.push('--- OPTIMIZED VERSION TEMPLATE ---\n');

  // Hook line
  if (questions.length === 0) {
    suggestions.push('🔹 HOOK (add a question to open):');
    suggestions.push(`   "Did you know [fact about your topic]?"\n`);
  }

  // Main body
  suggestions.push('🔹 BODY (structured, fact-rich):');
  suggestions.push('   Here\'s what you need to know about [topic]:');
  suggestions.push('   1. [First key point with a specific number/stat]');
  suggestions.push('   2. [Second point mentioning a specific brand/person/place]');
  suggestions.push('   3. [Third point with actionable advice]\n');

  // Quotable takeaway
  suggestions.push('🔹 QUOTABLE TAKEAWAY:');
  suggestions.push('   "[One-sentence summary that someone could cite directly]"\n');

  // CTA
  suggestions.push('🔹 CALL TO ACTION:');
  suggestions.push('   "Save this post for later" or "Share with someone who needs this"\n');

  // Hashtags
  if (platform === 'instagram' || platform === 'general') {
    suggestions.push('🔹 HASHTAGS (descriptive, niche):');
    if (hashtags.length > 0) {
      suggestions.push(`   Keep: ${hashtags.join(' ')}`);
    }
    suggestions.push('   Add: #[YourNicheTopic] #[SpecificSubtopic] #[IndustryTerm] #[LocationIfRelevant]');
  }

  // Schema / structured data tip
  suggestions.push('\n🔹 SCHEMA MARKUP (for your website/blog linked from the post):');
  suggestions.push('   Add JSON-LD structured data (Article, FAQPage, or HowTo schema)');
  suggestions.push('   to any webpage you link from your social posts. This is the');
  suggestions.push('   #1 way to get cited by LLMs.');

  return suggestions.join('\n');
}

// ---------------------------------------------------------------------------
// JSON-LD Schema generator for linked content
// ---------------------------------------------------------------------------

function generateSchema(text, options = {}) {
  const {
    type = 'Article',
    authorName = 'Author Name',
    authorUrl = '',
    siteName = 'Your Website',
    url = 'https://yoursite.com/post',
    imageUrl = '',
    datePublished = new Date().toISOString().split('T')[0],
  } = options;

  const entities = extractEntities(text);
  const questions = extractQuestions(text);
  const firstSentence = text.split(/[.!?]/)[0]?.trim() || text.slice(0, 120);

  if (type === 'FAQPage' && questions.length > 0) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map(q => ({
        '@type': 'Question',
        name: q.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: '[Your answer here]',
        },
      })),
    };
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: firstSentence.slice(0, 110),
    description: text.slice(0, 300),
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
    datePublished,
    dateModified: datePublished,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(url ? { url } : {}),
    ...(entities.length > 0 ? { keywords: entities.join(', ') } : {}),
  };

  return schema;
}

module.exports = {
  analyzeContent,
  generateOptimizedVersion,
  generateSchema,
  extractEntities,
  extractHashtags,
  extractStats,
  extractQuestions,
};
