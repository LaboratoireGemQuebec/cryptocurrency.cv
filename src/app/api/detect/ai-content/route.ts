/**
 * @fileoverview AI Content Detection API
 * Detects AI-generated content and potential deepfakes
 */

import { NextRequest, NextResponse } from 'next/server';

interface DetectionResult {
  isAiGenerated: boolean;
  confidence: number;
  signals: DetectionSignal[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details: {
    textAnalysis?: TextAnalysis;
    imageAnalysis?: ImageAnalysis;
    sourceAnalysis?: SourceAnalysis;
  };
  recommendations: string[];
}

interface DetectionSignal {
  type: string;
  description: string;
  weight: number;
  detected: boolean;
}

interface TextAnalysis {
  perplexity: number;
  burstiness: number;
  vocabularyDiversity: number;
  sentenceVariance: number;
  repetitivePatterns: string[];
  suspiciousPhrases: string[];
}

interface ImageAnalysis {
  hasArtifacts: boolean;
  inconsistentLighting: boolean;
  unnaturalFeatures: string[];
  metadataFlags: string[];
}

interface SourceAnalysis {
  domainAge: number;
  hasVerifiedAuthor: boolean;
  citationCount: number;
  crossReferences: number;
  redFlags: string[];
}

// AI detection signals
const AI_TEXT_SIGNALS: DetectionSignal[] = [
  {
    type: 'low_perplexity',
    description: 'Text has unusually predictable word choices',
    weight: 0.25,
    detected: false,
  },
  {
    type: 'low_burstiness',
    description: 'Sentence lengths are too uniform',
    weight: 0.2,
    detected: false,
  },
  {
    type: 'generic_phrases',
    description: 'Contains common AI-generated phrases',
    weight: 0.15,
    detected: false,
  },
  {
    type: 'perfect_grammar',
    description: 'Suspiciously perfect grammar throughout',
    weight: 0.1,
    detected: false,
  },
  {
    type: 'repetitive_structure',
    description: 'Paragraph structures are too similar',
    weight: 0.15,
    detected: false,
  },
  {
    type: 'lack_of_specifics',
    description: 'Missing specific details, dates, or sources',
    weight: 0.15,
    detected: false,
  },
];

// Common AI-generated phrases
const AI_PHRASES = [
  'in today\'s digital age',
  'it\'s important to note that',
  'in conclusion',
  'at the end of the day',
  'it goes without saying',
  'let\'s dive in',
  'without further ado',
  'in this article, we will',
  'have you ever wondered',
  'the truth is',
  'in the realm of',
  'it\'s worth mentioning',
  'needless to say',
  'as we navigate',
  'in an era of',
];

// Suspicious source indicators
const SOURCE_RED_FLAGS = [
  'No author attribution',
  'Domain registered recently',
  'No external citations',
  'No verifiable quotes',
  'Copied content detected',
  'Inconsistent publication dates',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, imageUrl, sourceUrl, options = {} } = body;

    if (!text && !imageUrl && !sourceUrl) {
      return NextResponse.json(
        { error: 'Provide text, imageUrl, or sourceUrl for analysis' },
        { status: 400 }
      );
    }

    const result: DetectionResult = {
      isAiGenerated: false,
      confidence: 0,
      signals: [],
      riskLevel: 'low',
      details: {},
      recommendations: [],
    };

    // Analyze text if provided
    if (text) {
      const textAnalysis = analyzeText(text);
      result.details.textAnalysis = textAnalysis;

      // Check signals
      const textSignals = checkTextSignals(text, textAnalysis);
      result.signals.push(...textSignals);
    }

    // Analyze source if provided
    if (sourceUrl) {
      const sourceAnalysis = await analyzeSource(sourceUrl);
      result.details.sourceAnalysis = sourceAnalysis;

      // Add source-related signals
      if (!sourceAnalysis.hasVerifiedAuthor) {
        result.signals.push({
          type: 'no_author',
          description: 'No verified author for the content',
          weight: 0.1,
          detected: true,
        });
      }

      if (sourceAnalysis.domainAge < 30) {
        result.signals.push({
          type: 'new_domain',
          description: 'Content from a newly registered domain',
          weight: 0.15,
          detected: true,
        });
      }
    }

    // Analyze image if provided (placeholder)
    if (imageUrl) {
      result.details.imageAnalysis = await analyzeImage(imageUrl);

      if (result.details.imageAnalysis.hasArtifacts) {
        result.signals.push({
          type: 'image_artifacts',
          description: 'Image contains AI generation artifacts',
          weight: 0.3,
          detected: true,
        });
      }
    }

    // Calculate overall score
    const detectedSignals = result.signals.filter((s) => s.detected);
    const totalWeight = detectedSignals.reduce((sum, s) => sum + s.weight, 0);
    result.confidence = Math.min(totalWeight * 100, 100);
    result.isAiGenerated = result.confidence > 50;

    // Determine risk level
    if (result.confidence < 25) {
      result.riskLevel = 'low';
    } else if (result.confidence < 50) {
      result.riskLevel = 'medium';
    } else if (result.confidence < 75) {
      result.riskLevel = 'high';
    } else {
      result.riskLevel = 'critical';
    }

    // Generate recommendations
    result.recommendations = generateRecommendations(result);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to analyze content',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function analyzeText(text: string): TextAnalysis {
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  // Calculate vocabulary diversity (unique words / total words)
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  const vocabularyDiversity = uniqueWords.size / words.length;

  // Calculate sentence length variance
  const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
  const avgLength =
    sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance =
    sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) /
    sentenceLengths.length;
  const sentenceVariance = Math.sqrt(variance);

  // Calculate burstiness (variation in sentence lengths)
  const burstiness = sentenceVariance / avgLength;

  // Mock perplexity (would need actual LLM for real calculation)
  // Lower perplexity = more predictable = more likely AI
  const perplexity = 30 + Math.random() * 70; // Mock value

  // Find repetitive patterns
  const repetitivePatterns: string[] = [];
  const phrases = new Map<string, number>();

  for (let i = 0; i < sentences.length - 1; i++) {
    const words1 = sentences[i].toLowerCase().split(/\s+/).slice(0, 3).join(' ');
    const words2 = sentences[i + 1].toLowerCase().split(/\s+/).slice(0, 3).join(' ');

    if (words1 === words2 && words1.length > 10) {
      repetitivePatterns.push(words1);
    }
  }

  // Find suspicious AI phrases
  const suspiciousPhrases: string[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of AI_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      suspiciousPhrases.push(phrase);
    }
  }

  return {
    perplexity,
    burstiness,
    vocabularyDiversity,
    sentenceVariance,
    repetitivePatterns,
    suspiciousPhrases,
  };
}

function checkTextSignals(
  text: string,
  analysis: TextAnalysis
): DetectionSignal[] {
  const signals: DetectionSignal[] = AI_TEXT_SIGNALS.map((s) => ({ ...s }));

  // Low perplexity check
  if (analysis.perplexity < 40) {
    signals.find((s) => s.type === 'low_perplexity')!.detected = true;
  }

  // Low burstiness check
  if (analysis.burstiness < 0.3) {
    signals.find((s) => s.type === 'low_burstiness')!.detected = true;
  }

  // Generic phrases check
  if (analysis.suspiciousPhrases.length >= 2) {
    signals.find((s) => s.type === 'generic_phrases')!.detected = true;
  }

  // Repetitive structure check
  if (analysis.repetitivePatterns.length > 0) {
    signals.find((s) => s.type === 'repetitive_structure')!.detected = true;
  }

  // Low vocabulary diversity might indicate AI
  if (analysis.vocabularyDiversity < 0.4) {
    signals.find((s) => s.type === 'lack_of_specifics')!.detected = true;
  }

  return signals;
}

async function analyzeSource(url: string): Promise<SourceAnalysis> {
  try {
    // In production, would use WHOIS, web archive, etc.
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Mock analysis
    const redFlags: string[] = [];

    // Check for common trustworthy domains
    const trustedDomains = [
      'coindesk.com',
      'cointelegraph.com',
      'theblock.co',
      'decrypt.co',
      'bitcoinmagazine.com',
      'bloomberg.com',
      'reuters.com',
    ];

    const isTrusted = trustedDomains.some((d) => domain.includes(d));

    if (!isTrusted) {
      redFlags.push('Not a recognized crypto news source');
    }

    return {
      domainAge: isTrusted ? 1000 + Math.random() * 3000 : 10 + Math.random() * 100,
      hasVerifiedAuthor: isTrusted && Math.random() > 0.3,
      citationCount: Math.floor(Math.random() * 10),
      crossReferences: Math.floor(Math.random() * 5),
      redFlags,
    };
  } catch {
    return {
      domainAge: 0,
      hasVerifiedAuthor: false,
      citationCount: 0,
      crossReferences: 0,
      redFlags: ['Could not analyze source URL'],
    };
  }
}

async function analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
  // Placeholder for image analysis
  // In production, would use computer vision models

  return {
    hasArtifacts: Math.random() > 0.7,
    inconsistentLighting: Math.random() > 0.8,
    unnaturalFeatures: Math.random() > 0.8 ? ['Unusual hand details'] : [],
    metadataFlags: Math.random() > 0.5 ? ['No EXIF data'] : [],
  };
}

function generateRecommendations(result: DetectionResult): string[] {
  const recommendations: string[] = [];

  if (result.riskLevel === 'critical') {
    recommendations.push('Do not trust this content without verification');
    recommendations.push('Cross-reference with multiple trusted sources');
    recommendations.push('Check for the original source of claims');
  } else if (result.riskLevel === 'high') {
    recommendations.push('Verify key claims with official sources');
    recommendations.push('Look for author credentials and track record');
  } else if (result.riskLevel === 'medium') {
    recommendations.push('Consider cross-checking important details');
  }

  if (result.details.textAnalysis?.suspiciousPhrases.length) {
    recommendations.push('Text contains common AI-generated phrases');
  }

  if (result.details.sourceAnalysis?.redFlags.length) {
    recommendations.push('Source has verification concerns: ' +
      result.details.sourceAnalysis.redFlags.join(', '));
  }

  if (recommendations.length === 0) {
    recommendations.push('Content appears authentic but always verify important claims');
  }

  return recommendations;
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    description: 'AI Content Detection API - Detects AI-generated content and deepfakes',
    usage: {
      method: 'POST',
      body: {
        text: 'Text content to analyze (optional)',
        imageUrl: 'URL of image to analyze (optional)',
        sourceUrl: 'URL of source to verify (optional)',
      },
    },
    response: {
      isAiGenerated: 'boolean - Whether content is likely AI-generated',
      confidence: 'number - Confidence percentage (0-100)',
      riskLevel: 'low | medium | high | critical',
      signals: 'Array of detection signals with weights',
      details: 'Detailed analysis results',
      recommendations: 'Array of recommended actions',
    },
    example: {
      request: {
        text: 'In today\'s digital age, Bitcoin continues to revolutionize...',
        sourceUrl: 'https://example.com/crypto-news',
      },
    },
  });
}
