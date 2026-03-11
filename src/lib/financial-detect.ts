const FINANCIAL_PATTERNS = [
  /\$[\d,]+/,                          // Dollar amounts
  /\b\d+[\d,]*\s*dollars?\b/i,         // "50000 dollars"
  /\ballocat(e|es|ed|ing|ion)\b/i,
  /\bappropriat(e|es|ed|ing|ion)\b/i,
  /\bbudget(s|ed|ing|ary)?\b/i,
  /\bfund(s|ed|ing)?\b/i,
  /\bexpenditure(s)?\b/i,
  /\bdisburse(s|d|ment|ments)?\b/i,
  /\bfinancial\b/i,
  /\bfinanc(e|es|ed|ing)\b/i,
  /\bapportionments?\b/i,
  /\brevenue(s)?\b/i,
  /\bsalar(y|ies)\b/i,
  /\bcompensation\b/i,
  /\breserves?\b/i,
  /\bassessments?\b/i,
  /\bper\s*diem\b/i,
  /\bstipend(s)?\b/i,
];

export interface FinancialDetectionResult {
  detected: boolean;
  matches: string[];      // The actual matched text snippets
  patterns: string[];     // Which pattern categories matched
}

export function detectFinancialImplications(textEn: string | null, textEs: string | null): FinancialDetectionResult {
  const combined = [textEn, textEs].filter(Boolean).join(" ");
  const matches: string[] = [];
  const patterns: string[] = [];

  for (const pattern of FINANCIAL_PATTERNS) {
    const match = combined.match(new RegExp(pattern, "gi"));
    if (match) {
      // Dedupe matches
      for (const m of match) {
        if (!matches.includes(m)) matches.push(m);
      }
      // Use the pattern source as a category label
      if (!patterns.includes(pattern.source)) {
        patterns.push(pattern.source);
      }
    }
  }

  return {
    detected: matches.length > 0,
    matches: matches.slice(0, 10), // Cap at 10 for display
    patterns,
  };
}
