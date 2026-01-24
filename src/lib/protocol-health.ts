/**
 * Protocol Health & DeFi Risk Analysis Engine
 * 
 * Enterprise-grade smart contract security monitoring, protocol risk scoring,
 * and real-time DeFi safety intelligence.
 * 
 * Features:
 * - Smart contract audit tracking
 * - TVL monitoring and anomaly detection
 * - Exploit/hack real-time alerts
 * - Protocol risk scoring (A-F grades)
 * - Insurance coverage analysis
 * - Governance risk assessment
 * - Team/founder verification
 * - Code quality metrics
 * 
 * @module lib/protocol-health
 */

// =============================================================================
// Types & Interfaces
// =============================================================================

export interface Protocol {
  id: string;
  name: string;
  slug: string;
  category: ProtocolCategory;
  chains: string[];
  website: string;
  twitter?: string;
  github?: string;
  discord?: string;
  logo?: string;
  description: string;
  launchDate: string;
  isVerified: boolean;
}

export type ProtocolCategory = 
  | 'lending'
  | 'dex'
  | 'derivatives'
  | 'yield'
  | 'bridge'
  | 'cdp'
  | 'liquid-staking'
  | 'options'
  | 'insurance'
  | 'nft-marketplace'
  | 'gaming'
  | 'launchpad'
  | 'oracle'
  | 'privacy'
  | 'payments'
  | 'other';

export interface AuditReport {
  id: string;
  protocolId: string;
  auditor: string;
  auditorReputation: 'tier1' | 'tier2' | 'tier3' | 'unknown';
  date: string;
  version: string;
  scope: string[];
  findings: AuditFinding[];
  reportUrl?: string;
  isPublic: boolean;
  overallRating: 'pass' | 'pass-with-issues' | 'fail' | 'pending';
}

export interface AuditFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  title: string;
  description: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'wont-fix';
  cweId?: string;
  location?: string;
}

export interface TVLData {
  protocolId: string;
  timestamp: number;
  tvlUsd: number;
  change24h: number;
  change7d: number;
  change30d: number;
  chainBreakdown: Record<string, number>;
  tokenBreakdown: Array<{
    token: string;
    amount: number;
    valueUsd: number;
    percentage: number;
  }>;
  rank: number;
}

export interface SecurityIncident {
  id: string;
  protocolId: string;
  date: string;
  type: IncidentType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  lossUsd: number;
  recoveredUsd: number;
  attackVector: string;
  description: string;
  postMortemUrl?: string;
  txHashes?: string[];
  isConfirmed: boolean;
  status: 'ongoing' | 'contained' | 'resolved' | 'investigating';
}

export type IncidentType = 
  | 'exploit'
  | 'rug-pull'
  | 'flash-loan-attack'
  | 'oracle-manipulation'
  | 'reentrancy'
  | 'access-control'
  | 'economic-attack'
  | 'bridge-hack'
  | 'governance-attack'
  | 'insider'
  | 'phishing'
  | 'unknown';

export interface ProtocolRiskScore {
  protocolId: string;
  overallScore: number; // 0-100
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  lastUpdated: string;
  factors: {
    smartContractRisk: RiskFactor;
    centralzationRisk: RiskFactor;
    oracleRisk: RiskFactor;
    governanceRisk: RiskFactor;
    economicRisk: RiskFactor;
    operationalRisk: RiskFactor;
    auditStatus: RiskFactor;
    teamVerification: RiskFactor;
    insuranceCoverage: RiskFactor;
    trackRecord: RiskFactor;
  };
  recommendations: string[];
  warnings: string[];
}

export interface RiskFactor {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sources: string[];
}

export interface InsuranceCoverage {
  protocolId: string;
  providers: InsuranceProvider[];
  totalCoverageUsd: number;
  coverageRatio: number; // coverage / TVL
  averagePremium: number; // % annual
  lastUpdated: string;
}

export interface InsuranceProvider {
  name: string;
  coverageUsd: number;
  premium: number;
  deductible: number;
  coveredRisks: string[];
  excludedRisks: string[];
  policyUrl?: string;
  expiryDate?: string;
}

export interface GovernanceMetrics {
  protocolId: string;
  tokenSymbol: string;
  tokenAddress: string;
  totalSupply: number;
  circulatingSupply: number;
  holderCount: number;
  topHolderConcentration: number; // % held by top 10
  treasuryValue: number;
  proposalCount: number;
  averageVoterParticipation: number;
  timelockDuration: number; // hours
  multisigDetails?: {
    signers: number;
    threshold: number;
    knownSigners: string[];
  };
  recentProposals: GovernanceProposal[];
}

export interface GovernanceProposal {
  id: string;
  title: string;
  status: 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  endDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
}

export interface TeamInfo {
  protocolId: string;
  isDoxxed: boolean;
  isAnonymous: boolean;
  teamSize: number;
  founders: TeamMember[];
  advisors: TeamMember[];
  backers: string[];
  fundingRounds: FundingRound[];
  linkedInVerified: boolean;
  githubActivity: {
    contributors: number;
    commits30d: number;
    lastCommit: string;
    openIssues: number;
    stars: number;
  };
}

export interface TeamMember {
  name: string;
  role: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  previousProjects?: string[];
  isVerified: boolean;
}

export interface FundingRound {
  date: string;
  type: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'private' | 'public';
  amountUsd: number;
  valuation?: number;
  investors: string[];
}

export interface ProtocolHealthSummary {
  protocol: Protocol;
  riskScore: ProtocolRiskScore;
  tvl: TVLData;
  audits: AuditReport[];
  incidents: SecurityIncident[];
  insurance: InsuranceCoverage | null;
  governance: GovernanceMetrics | null;
  team: TeamInfo | null;
  alerts: HealthAlert[];
}

export interface HealthAlert {
  id: string;
  protocolId: string;
  type: 'tvl-drop' | 'new-incident' | 'audit-issue' | 'governance-risk' | 'team-change' | 'contract-upgrade' | 'unusual-activity';
  severity: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  actionRequired: boolean;
  link?: string;
}

// =============================================================================
// Constants
// =============================================================================

const TIER1_AUDITORS = [
  'Trail of Bits',
  'OpenZeppelin',
  'Consensys Diligence',
  'Halborn',
  'Quantstamp',
  'CertiK',
  'ChainSecurity',
  'Sigma Prime',
  'Runtime Verification',
  'Least Authority',
];

const TIER2_AUDITORS = [
  'PeckShield',
  'SlowMist',
  'BlockSec',
  'Hacken',
  'Dedaub',
  'Code4rena',
  'Sherlock',
  'Spearbit',
  'yAudit',
  'Zellic',
];

const CATEGORY_BASE_RISK: Record<ProtocolCategory, number> = {
  'oracle': 15,
  'insurance': 20,
  'liquid-staking': 25,
  'lending': 30,
  'dex': 30,
  'cdp': 35,
  'derivatives': 40,
  'yield': 45,
  'bridge': 55,
  'options': 40,
  'nft-marketplace': 25,
  'gaming': 35,
  'launchpad': 50,
  'privacy': 45,
  'payments': 20,
  'other': 40,
};

// =============================================================================
// Risk Scoring Engine
// =============================================================================

function calculateSmartContractRisk(audits: AuditReport[], incidents: SecurityIncident[]): RiskFactor {
  let score = 100;
  const details: string[] = [];
  const sources: string[] = [];

  // Check audit status
  if (audits.length === 0) {
    score -= 50;
    details.push('No audits found');
  } else {
    const tier1Audits = audits.filter(a => TIER1_AUDITORS.includes(a.auditor));
    const tier2Audits = audits.filter(a => TIER2_AUDITORS.includes(a.auditor));
    
    if (tier1Audits.length === 0 && tier2Audits.length === 0) {
      score -= 30;
      details.push('No reputable auditor');
    } else if (tier1Audits.length > 0) {
      score += 10;
      details.push(`Tier 1 audit by ${tier1Audits[0].auditor}`);
      sources.push(tier1Audits[0].auditor);
    }

    // Check for open critical/high findings
    const openHighFindings = audits.flatMap(a => 
      a.findings.filter(f => 
        (f.severity === 'critical' || f.severity === 'high') && 
        f.status !== 'resolved'
      )
    );
    
    if (openHighFindings.length > 0) {
      score -= openHighFindings.length * 15;
      details.push(`${openHighFindings.length} open high/critical findings`);
    }

    // Check audit age
    const latestAudit = audits.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    const auditAge = (Date.now() - new Date(latestAudit.date).getTime()) / (1000 * 60 * 60 * 24);
    if (auditAge > 365) {
      score -= 20;
      details.push('Audit older than 1 year');
    } else if (auditAge > 180) {
      score -= 10;
      details.push('Audit older than 6 months');
    }
  }

  // Check incident history
  const recentIncidents = incidents.filter(i => {
    const incidentAge = (Date.now() - new Date(i.date).getTime()) / (1000 * 60 * 60 * 24);
    return incidentAge < 365;
  });

  if (recentIncidents.length > 0) {
    const criticalIncidents = recentIncidents.filter(i => i.severity === 'critical');
    const highIncidents = recentIncidents.filter(i => i.severity === 'high');
    
    score -= criticalIncidents.length * 25;
    score -= highIncidents.length * 15;
    
    if (criticalIncidents.length > 0) {
      details.push(`${criticalIncidents.length} critical incidents in past year`);
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Smart Contract Risk',
    score,
    weight: 0.25,
    details: details.join('; ') || 'Well audited with no major issues',
    severity: score >= 70 ? 'low' : score >= 50 ? 'medium' : score >= 30 ? 'high' : 'critical',
    sources,
  };
}

function calculateCentralizationRisk(governance: GovernanceMetrics | null): RiskFactor {
  let score = 100;
  const details: string[] = [];

  if (!governance) {
    score = 50;
    details.push('Governance data unavailable');
  } else {
    // Check top holder concentration
    if (governance.topHolderConcentration > 50) {
      score -= 30;
      details.push(`Top 10 holders control ${governance.topHolderConcentration.toFixed(1)}%`);
    } else if (governance.topHolderConcentration > 30) {
      score -= 15;
      details.push('Moderate token concentration');
    }

    // Check multisig
    if (governance.multisigDetails) {
      const { signers, threshold } = governance.multisigDetails;
      if (threshold < 3) {
        score -= 20;
        details.push(`Low multisig threshold (${threshold}/${signers})`);
      } else if (threshold < signers / 2) {
        score -= 10;
        details.push('Multisig threshold below 50%');
      }
    } else {
      score -= 25;
      details.push('No multisig protection');
    }

    // Check timelock
    if (governance.timelockDuration < 24) {
      score -= 20;
      details.push('Timelock under 24 hours');
    } else if (governance.timelockDuration < 48) {
      score -= 10;
      details.push('Short timelock period');
    }

    // Check voter participation
    if (governance.averageVoterParticipation < 5) {
      score -= 15;
      details.push('Very low voter participation');
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Centralization Risk',
    score,
    weight: 0.15,
    details: details.join('; ') || 'Well decentralized governance',
    severity: score >= 70 ? 'low' : score >= 50 ? 'medium' : score >= 30 ? 'high' : 'critical',
    sources: [],
  };
}

function calculateOracleRisk(protocol: Protocol): RiskFactor {
  let score = 80;
  const details: string[] = [];

  // Certain categories have higher oracle risk
  const highOracleRiskCategories: ProtocolCategory[] = ['lending', 'derivatives', 'options', 'cdp'];
  
  if (highOracleRiskCategories.includes(protocol.category)) {
    score -= 20;
    details.push(`${protocol.category} protocols are oracle-dependent`);
  }

  return {
    name: 'Oracle Risk',
    score,
    weight: 0.10,
    details: details.join('; ') || 'Standard oracle implementation',
    severity: score >= 70 ? 'low' : score >= 50 ? 'medium' : score >= 30 ? 'high' : 'critical',
    sources: [],
  };
}

function calculateTeamRisk(team: TeamInfo | null): RiskFactor {
  let score = 100;
  const details: string[] = [];

  if (!team) {
    score = 40;
    details.push('Team information unavailable');
  } else {
    if (team.isAnonymous && !team.isDoxxed) {
      score -= 30;
      details.push('Anonymous team');
    }

    if (!team.linkedInVerified) {
      score -= 10;
      details.push('Team not LinkedIn verified');
    }

    if (team.githubActivity.commits30d < 10) {
      score -= 15;
      details.push('Low development activity');
    }

    if (team.fundingRounds.length === 0) {
      score -= 10;
      details.push('No known funding rounds');
    }

    if (team.backers.length === 0) {
      score -= 10;
      details.push('No reputable backers');
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Team Verification',
    score,
    weight: 0.10,
    details: details.join('; ') || 'Verified team with strong track record',
    severity: score >= 70 ? 'low' : score >= 50 ? 'medium' : score >= 30 ? 'high' : 'critical',
    sources: [],
  };
}

function calculateInsuranceScore(insurance: InsuranceCoverage | null, tvl: TVLData): RiskFactor {
  let score = 50;
  const details: string[] = [];

  if (!insurance || insurance.totalCoverageUsd === 0) {
    score = 30;
    details.push('No insurance coverage');
  } else {
    const coverageRatio = insurance.totalCoverageUsd / tvl.tvlUsd;
    
    if (coverageRatio >= 0.5) {
      score = 90;
      details.push(`${(coverageRatio * 100).toFixed(1)}% of TVL insured`);
    } else if (coverageRatio >= 0.25) {
      score = 70;
      details.push(`Partial coverage (${(coverageRatio * 100).toFixed(1)}%)`);
    } else if (coverageRatio >= 0.1) {
      score = 50;
      details.push('Limited insurance coverage');
    } else {
      score = 40;
      details.push('Minimal insurance coverage');
    }

    if (insurance.providers.length > 1) {
      score += 10;
      details.push('Multiple insurance providers');
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Insurance Coverage',
    score,
    weight: 0.10,
    details: details.join('; ') || 'Adequate insurance protection',
    severity: score >= 70 ? 'low' : score >= 50 ? 'medium' : score >= 30 ? 'high' : 'critical',
    sources: insurance?.providers.map(p => p.name) || [],
  };
}

function calculateTrackRecordScore(protocol: Protocol, incidents: SecurityIncident[], tvl: TVLData): RiskFactor {
  let score = 100;
  const details: string[] = [];

  // Protocol age
  const ageInDays = (Date.now() - new Date(protocol.launchDate).getTime()) / (1000 * 60 * 60 * 24);
  
  if (ageInDays < 90) {
    score -= 30;
    details.push('Protocol less than 3 months old');
  } else if (ageInDays < 180) {
    score -= 20;
    details.push('Protocol less than 6 months old');
  } else if (ageInDays < 365) {
    score -= 10;
    details.push('Protocol less than 1 year old');
  }

  // Total losses
  const totalLosses = incidents.reduce((sum, i) => sum + (i.lossUsd - i.recoveredUsd), 0);
  
  if (totalLosses > 100_000_000) {
    score -= 40;
    details.push(`$${(totalLosses / 1e6).toFixed(0)}M in historical losses`);
  } else if (totalLosses > 10_000_000) {
    score -= 25;
    details.push(`$${(totalLosses / 1e6).toFixed(0)}M in historical losses`);
  } else if (totalLosses > 1_000_000) {
    score -= 15;
    details.push(`$${(totalLosses / 1e6).toFixed(1)}M in historical losses`);
  }

  // TVL stability
  if (tvl.change30d < -50) {
    score -= 20;
    details.push('TVL dropped >50% in 30 days');
  } else if (tvl.change30d < -30) {
    score -= 10;
    details.push('Significant TVL decline');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Track Record',
    score,
    weight: 0.10,
    details: details.join('; ') || 'Strong historical track record',
    severity: score >= 70 ? 'low' : score >= 50 ? 'medium' : score >= 30 ? 'high' : 'critical',
    sources: [],
  };
}

function calculateEconomicRisk(protocol: Protocol, tvl: TVLData): RiskFactor {
  let score = 80;
  const details: string[] = [];
  const baseRisk = CATEGORY_BASE_RISK[protocol.category];

  score -= baseRisk * 0.3;

  // TVL considerations
  if (tvl.tvlUsd < 1_000_000) {
    score -= 20;
    details.push('Very low TVL (<$1M)');
  } else if (tvl.tvlUsd < 10_000_000) {
    score -= 10;
    details.push('Low TVL (<$10M)');
  }

  // Token concentration
  if (tvl.tokenBreakdown.length > 0) {
    const topTokenPercent = tvl.tokenBreakdown[0].percentage;
    if (topTokenPercent > 80) {
      score -= 15;
      details.push('Highly concentrated in single asset');
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Economic Risk',
    score,
    weight: 0.10,
    details: details.join('; ') || 'Healthy economic model',
    severity: score >= 70 ? 'low' : score >= 50 ? 'medium' : score >= 30 ? 'high' : 'critical',
    sources: [],
  };
}

function scoreToGrade(score: number): ProtocolRiskScore['grade'] {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'C-';
  if (score >= 50) return 'D';
  return 'F';
}

export function calculateRiskScore(
  protocol: Protocol,
  audits: AuditReport[],
  incidents: SecurityIncident[],
  tvl: TVLData,
  governance: GovernanceMetrics | null,
  insurance: InsuranceCoverage | null,
  team: TeamInfo | null
): ProtocolRiskScore {
  const smartContractRisk = calculateSmartContractRisk(audits, incidents);
  const centralizationRisk = calculateCentralizationRisk(governance);
  const oracleRisk = calculateOracleRisk(protocol);
  const governanceRisk = calculateCentralizationRisk(governance); // Same logic for now
  const economicRisk = calculateEconomicRisk(protocol, tvl);
  const teamVerification = calculateTeamRisk(team);
  const insuranceCoverage = calculateInsuranceScore(insurance, tvl);
  const trackRecord = calculateTrackRecordScore(protocol, incidents, tvl);

  // Placeholder for operational risk
  const operationalRisk: RiskFactor = {
    name: 'Operational Risk',
    score: 75,
    weight: 0.05,
    details: 'Standard operational practices',
    severity: 'low',
    sources: [],
  };

  // Placeholder for audit status factor
  const auditStatus: RiskFactor = {
    name: 'Audit Status',
    score: audits.length > 0 ? 80 : 30,
    weight: 0.05,
    details: audits.length > 0 ? `${audits.length} audit(s) on file` : 'No audits',
    severity: audits.length > 0 ? 'low' : 'high',
    sources: audits.map(a => a.auditor),
  };

  const factors = {
    smartContractRisk,
    centralzationRisk: centralizationRisk,
    oracleRisk,
    governanceRisk,
    economicRisk,
    operationalRisk,
    auditStatus,
    teamVerification,
    insuranceCoverage,
    trackRecord,
  };

  // Calculate weighted score
  const totalWeight = Object.values(factors).reduce((sum, f) => sum + f.weight, 0);
  const weightedScore = Object.values(factors).reduce(
    (sum, f) => sum + (f.score * f.weight),
    0
  ) / totalWeight;

  const overallScore = Math.round(weightedScore);
  const grade = scoreToGrade(overallScore);

  // Generate recommendations
  const recommendations: string[] = [];
  const warnings: string[] = [];

  Object.values(factors).forEach(factor => {
    if (factor.score < 50) {
      warnings.push(`${factor.name}: ${factor.details}`);
    } else if (factor.score < 70) {
      recommendations.push(`Consider: ${factor.name} - ${factor.details}`);
    }
  });

  return {
    protocolId: protocol.id,
    overallScore,
    grade,
    lastUpdated: new Date().toISOString(),
    factors,
    recommendations,
    warnings,
  };
}

// =============================================================================
// Data Fetching Functions
// =============================================================================

export async function fetchProtocolHealth(protocolId: string): Promise<ProtocolHealthSummary | null> {
  try {
    // In production, these would be real API calls
    const [protocol, audits, incidents, tvl, governance, insurance, team] = await Promise.all([
      fetchProtocolInfo(protocolId),
      fetchAudits(protocolId),
      fetchIncidents(protocolId),
      fetchTVL(protocolId),
      fetchGovernance(protocolId),
      fetchInsurance(protocolId),
      fetchTeamInfo(protocolId),
    ]);

    if (!protocol || !tvl) {
      return null;
    }

    const riskScore = calculateRiskScore(
      protocol,
      audits,
      incidents,
      tvl,
      governance,
      insurance,
      team
    );

    const alerts = generateHealthAlerts(protocol, riskScore, tvl, incidents);

    return {
      protocol,
      riskScore,
      tvl,
      audits,
      incidents,
      insurance,
      governance,
      team,
      alerts,
    };
  } catch (error) {
    console.error(`[Protocol Health] Error fetching health for ${protocolId}:`, error);
    return null;
  }
}

async function fetchProtocolInfo(protocolId: string): Promise<Protocol | null> {
  // Real implementation would call DefiLlama or similar API
  const protocols = await getTopProtocols();
  return protocols.find(p => p.id === protocolId) || null;
}

async function fetchAudits(protocolId: string): Promise<AuditReport[]> {
  // Mock implementation - real would use audit databases
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  
  // Return mock audits for top protocols
  const topProtocolAudits: Record<string, AuditReport[]> = {
    'aave-v3': [{
      id: 'aave-audit-1',
      protocolId: 'aave-v3',
      auditor: 'Trail of Bits',
      auditorReputation: 'tier1',
      date: sixMonthsAgo.toISOString(),
      version: '3.0',
      scope: ['lending-pool', 'governance', 'token'],
      findings: [
        { id: 'f1', severity: 'low', title: 'Gas optimization', description: 'Minor gas improvements possible', status: 'resolved' },
      ],
      isPublic: true,
      overallRating: 'pass',
    }],
    'uniswap-v3': [{
      id: 'uni-audit-1',
      protocolId: 'uniswap-v3',
      auditor: 'OpenZeppelin',
      auditorReputation: 'tier1',
      date: sixMonthsAgo.toISOString(),
      version: '3.0',
      scope: ['pool', 'factory', 'router'],
      findings: [],
      isPublic: true,
      overallRating: 'pass',
    }],
  };

  return topProtocolAudits[protocolId] || [];
}

async function fetchIncidents(protocolId: string): Promise<SecurityIncident[]> {
  // Mock implementation - real would use rekt.news API or similar
  const mockIncidents: Record<string, SecurityIncident[]> = {
    'ronin-bridge': [{
      id: 'ronin-1',
      protocolId: 'ronin-bridge',
      date: '2022-03-23',
      type: 'bridge-hack',
      severity: 'critical',
      lossUsd: 624_000_000,
      recoveredUsd: 0,
      attackVector: 'Compromised private keys',
      description: 'Validator keys compromised allowing unauthorized withdrawals',
      isConfirmed: true,
      status: 'resolved',
    }],
  };

  return mockIncidents[protocolId] || [];
}

async function fetchTVL(protocolId: string): Promise<TVLData | null> {
  try {
    // Use DefiLlama API
    const response = await fetch(`https://api.llama.fi/protocol/${protocolId}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      // Return mock data for demo
      return generateMockTVL(protocolId);
    }

    const data = await response.json();
    
    return {
      protocolId,
      timestamp: Date.now(),
      tvlUsd: data.tvl || 0,
      change24h: data.change_1d || 0,
      change7d: data.change_7d || 0,
      change30d: data.change_1m || 0,
      chainBreakdown: data.chainTvls || {},
      tokenBreakdown: [],
      rank: 0,
    };
  } catch {
    return generateMockTVL(protocolId);
  }
}

function generateMockTVL(protocolId: string): TVLData {
  const mockTVLs: Record<string, number> = {
    'lido': 25_000_000_000,
    'aave-v3': 12_000_000_000,
    'uniswap-v3': 5_000_000_000,
    'makerdao': 8_000_000_000,
    'curve-finance': 3_500_000_000,
  };

  const tvl = mockTVLs[protocolId] || Math.random() * 1_000_000_000;

  return {
    protocolId,
    timestamp: Date.now(),
    tvlUsd: tvl,
    change24h: (Math.random() - 0.5) * 10,
    change7d: (Math.random() - 0.5) * 20,
    change30d: (Math.random() - 0.5) * 30,
    chainBreakdown: { ethereum: tvl * 0.7, arbitrum: tvl * 0.2, polygon: tvl * 0.1 },
    tokenBreakdown: [
      { token: 'ETH', amount: tvl * 0.4 / 3000, valueUsd: tvl * 0.4, percentage: 40 },
      { token: 'USDC', amount: tvl * 0.3, valueUsd: tvl * 0.3, percentage: 30 },
      { token: 'Other', amount: tvl * 0.3, valueUsd: tvl * 0.3, percentage: 30 },
    ],
    rank: Math.floor(Math.random() * 100) + 1,
  };
}

async function fetchGovernance(protocolId: string): Promise<GovernanceMetrics | null> {
  // Mock implementation
  const hasGovernance = ['aave-v3', 'uniswap-v3', 'makerdao', 'compound-v3'].includes(protocolId);
  
  if (!hasGovernance) return null;

  return {
    protocolId,
    tokenSymbol: protocolId.split('-')[0].toUpperCase(),
    tokenAddress: '0x...',
    totalSupply: 100_000_000,
    circulatingSupply: 80_000_000,
    holderCount: 50000,
    topHolderConcentration: 25,
    treasuryValue: 500_000_000,
    proposalCount: 150,
    averageVoterParticipation: 15,
    timelockDuration: 48,
    multisigDetails: {
      signers: 9,
      threshold: 5,
      knownSigners: ['Founder 1', 'Founder 2', 'Community Rep'],
    },
    recentProposals: [],
  };
}

async function fetchInsurance(protocolId: string): Promise<InsuranceCoverage | null> {
  // Mock implementation
  const insuredProtocols = ['aave-v3', 'uniswap-v3', 'compound-v3'];
  
  if (!insuredProtocols.includes(protocolId)) return null;

  return {
    protocolId,
    providers: [
      {
        name: 'Nexus Mutual',
        coverageUsd: 50_000_000,
        premium: 2.5,
        deductible: 0,
        coveredRisks: ['smart-contract', 'oracle-failure'],
        excludedRisks: ['governance-attack', 'rug-pull'],
      },
    ],
    totalCoverageUsd: 50_000_000,
    coverageRatio: 0.1,
    averagePremium: 2.5,
    lastUpdated: new Date().toISOString(),
  };
}

async function fetchTeamInfo(protocolId: string): Promise<TeamInfo | null> {
  // Mock implementation
  const doxxedProtocols = ['aave-v3', 'uniswap-v3', 'makerdao', 'compound-v3'];
  
  const isDoxxed = doxxedProtocols.includes(protocolId);

  return {
    protocolId,
    isDoxxed,
    isAnonymous: !isDoxxed,
    teamSize: isDoxxed ? 50 : 10,
    founders: isDoxxed ? [
      { name: 'Founder', role: 'CEO', isVerified: true },
    ] : [],
    advisors: [],
    backers: isDoxxed ? ['a16z', 'Paradigm', 'Coinbase Ventures'] : [],
    fundingRounds: isDoxxed ? [
      { date: '2021-01-01', type: 'series-a', amountUsd: 25_000_000, investors: ['a16z'] },
    ] : [],
    linkedInVerified: isDoxxed,
    githubActivity: {
      contributors: 100,
      commits30d: 150,
      lastCommit: new Date().toISOString(),
      openIssues: 25,
      stars: 5000,
    },
  };
}

function generateHealthAlerts(
  protocol: Protocol,
  riskScore: ProtocolRiskScore,
  tvl: TVLData,
  incidents: SecurityIncident[]
): HealthAlert[] {
  const alerts: HealthAlert[] = [];

  // TVL drop alert
  if (tvl.change24h < -20) {
    alerts.push({
      id: `tvl-drop-${protocol.id}`,
      protocolId: protocol.id,
      type: 'tvl-drop',
      severity: tvl.change24h < -50 ? 'critical' : 'danger',
      title: 'Significant TVL Drop',
      message: `${protocol.name} TVL dropped ${Math.abs(tvl.change24h).toFixed(1)}% in 24 hours`,
      timestamp: new Date().toISOString(),
      actionRequired: true,
    });
  }

  // Risk score warnings
  if (riskScore.overallScore < 50) {
    alerts.push({
      id: `low-score-${protocol.id}`,
      protocolId: protocol.id,
      type: 'governance-risk',
      severity: 'danger',
      title: 'Low Safety Score',
      message: `${protocol.name} has a risk score of ${riskScore.overallScore}/100 (${riskScore.grade})`,
      timestamp: new Date().toISOString(),
      actionRequired: false,
    });
  }

  // Active incidents
  const activeIncidents = incidents.filter(i => i.status === 'ongoing' || i.status === 'investigating');
  for (const incident of activeIncidents) {
    alerts.push({
      id: `incident-${incident.id}`,
      protocolId: protocol.id,
      type: 'new-incident',
      severity: 'critical',
      title: 'Active Security Incident',
      message: `${incident.type}: ${incident.description}`,
      timestamp: incident.date,
      actionRequired: true,
    });
  }

  return alerts;
}

// =============================================================================
// Public API Functions
// =============================================================================

export async function getTopProtocols(limit: number = 100): Promise<Protocol[]> {
  try {
    const response = await fetch('https://api.llama.fi/protocols', {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return getMockProtocols();
    }

    const data = await response.json();
    
    return data.slice(0, limit).map((p: { slug: string; name: string; category: string; chains: string[]; url: string; twitter?: string; logo?: string; description?: string }) => ({
      id: p.slug,
      name: p.name,
      slug: p.slug,
      category: mapCategory(p.category),
      chains: p.chains || [],
      website: p.url || '',
      twitter: p.twitter,
      logo: p.logo,
      description: p.description || '',
      launchDate: '2020-01-01', // DefiLlama doesn't provide this
      isVerified: true,
    }));
  } catch {
    return getMockProtocols();
  }
}

function mapCategory(category: string): ProtocolCategory {
  const mapping: Record<string, ProtocolCategory> = {
    'Lending': 'lending',
    'Dexes': 'dex',
    'Derivatives': 'derivatives',
    'Yield': 'yield',
    'Bridge': 'bridge',
    'CDP': 'cdp',
    'Liquid Staking': 'liquid-staking',
    'Options': 'options',
    'Insurance': 'insurance',
    'NFT Marketplace': 'nft-marketplace',
    'Gaming': 'gaming',
    'Launchpad': 'launchpad',
    'Oracle': 'oracle',
    'Privacy': 'privacy',
    'Payments': 'payments',
  };

  return mapping[category] || 'other';
}

function getMockProtocols(): Protocol[] {
  return [
    {
      id: 'lido',
      name: 'Lido',
      slug: 'lido',
      category: 'liquid-staking',
      chains: ['Ethereum', 'Polygon', 'Solana'],
      website: 'https://lido.fi',
      twitter: 'lidofinance',
      description: 'Liquid staking for Ethereum and other networks',
      launchDate: '2020-12-01',
      isVerified: true,
    },
    {
      id: 'aave-v3',
      name: 'Aave V3',
      slug: 'aave-v3',
      category: 'lending',
      chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'],
      website: 'https://aave.com',
      twitter: 'aabordi',
      description: 'Decentralized lending and borrowing protocol',
      launchDate: '2022-03-16',
      isVerified: true,
    },
    {
      id: 'uniswap-v3',
      name: 'Uniswap V3',
      slug: 'uniswap-v3',
      category: 'dex',
      chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
      website: 'https://uniswap.org',
      twitter: 'Uniswap',
      description: 'Decentralized exchange with concentrated liquidity',
      launchDate: '2021-05-05',
      isVerified: true,
    },
    {
      id: 'makerdao',
      name: 'MakerDAO',
      slug: 'makerdao',
      category: 'cdp',
      chains: ['Ethereum'],
      website: 'https://makerdao.com',
      twitter: 'MakerDAO',
      description: 'Decentralized stablecoin (DAI) issuance protocol',
      launchDate: '2017-12-18',
      isVerified: true,
    },
    {
      id: 'curve-finance',
      name: 'Curve Finance',
      slug: 'curve-finance',
      category: 'dex',
      chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche', 'Fantom'],
      website: 'https://curve.fi',
      twitter: 'CurveFinance',
      description: 'Efficient stablecoin and like-asset exchange',
      launchDate: '2020-01-20',
      isVerified: true,
    },
  ];
}

export async function getProtocolRanking(
  category?: ProtocolCategory,
  chain?: string,
  limit: number = 50
): Promise<Array<{ protocol: Protocol; score: ProtocolRiskScore; tvl: TVLData }>> {
  const protocols = await getTopProtocols(200);
  
  let filtered = protocols;
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (chain) {
    filtered = filtered.filter(p => p.chains.includes(chain));
  }

  const rankings = await Promise.all(
    filtered.slice(0, limit).map(async (protocol) => {
      const health = await fetchProtocolHealth(protocol.id);
      if (!health) return null;
      return {
        protocol,
        score: health.riskScore,
        tvl: health.tvl,
      };
    })
  );

  return rankings
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.score.overallScore - a.score.overallScore);
}

export async function getRecentIncidents(limit: number = 20): Promise<SecurityIncident[]> {
  // In production, this would query a database of incidents
  // For now, return mock data from known hacks
  return [
    {
      id: 'recent-1',
      protocolId: 'example-protocol',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'flash-loan-attack',
      severity: 'high',
      lossUsd: 5_000_000,
      recoveredUsd: 0,
      attackVector: 'Flash loan + oracle manipulation',
      description: 'Attacker manipulated oracle prices using flash loan',
      isConfirmed: true,
      status: 'investigating',
    },
  ];
}

export async function searchProtocols(query: string): Promise<Protocol[]> {
  const protocols = await getTopProtocols(500);
  const lowerQuery = query.toLowerCase();
  
  return protocols.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.slug.toLowerCase().includes(lowerQuery) ||
    p.category.includes(lowerQuery)
  );
}

// =============================================================================
// Export all
// =============================================================================

export const protocolHealth = {
  fetchProtocolHealth,
  getTopProtocols,
  getProtocolRanking,
  getRecentIncidents,
  searchProtocols,
  calculateRiskScore,
};

export default protocolHealth;
