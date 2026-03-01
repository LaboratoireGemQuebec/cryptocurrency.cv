const fs = require('fs');
let content = fs.readFileSync('src/lib/crypto-news.ts', 'utf8');

// Sources to disable — non-crypto noise that adds latency without crypto news value
const toDisable = {
  // Mainstream finance (not crypto-specific RSS feeds)
  ft_crypto:             'FT paywall blocks RSS; non-crypto-specific feed',
  wsj_business:          'Generic finance, not crypto-specific',
  nyt_business:          'Generic business news, not crypto-specific',
  economist:             'General economics, not crypto-specific',
  marketwatch:           'Generic stock market, not crypto-specific',
  seekingalpha:          'Generic stock market, not crypto-specific',
  nikkei_asia:           'Asian business news, not crypto-specific',
  economic_times_india:  'Indian markets, not crypto-specific',

  // Geopolitical (world news, not crypto)
  bbc_world:             'General world news, not crypto-specific',
  ap_news:               'General news wire, not crypto-specific',
  dw_news:               'German news, not crypto-specific',
  cbc_news:              'Canadian news, not crypto-specific',
  al_jazeera:            'General world news, not crypto-specific',

  // TradFi
  bny_mellon:            'Traditional finance, not crypto-specific',

  // Quant — zero crypto content
  aqr_insights:          'Quant research, zero crypto content',
  two_sigma_insights:    'Quant research, zero crypto content',
  alpha_architect:       'Quant research, zero crypto content',

  // Fintech (generic fintech, not crypto)
  finextra:              'Banking/fintech news, not crypto-specific',
  pymnts_crypto:         'Payments news, not crypto-specific',
  fintech_futures:       'Fintech news, not crypto-specific',

  // Macro — central bank economic research papers, not breaking news
  lyn_alden:             'Macro commentary, not crypto-specific',
  alhambra_partners:     'Macro economics, not crypto-specific',
  federal_reserve_notes: 'Academic Fed research notes, not breaking news',
  bis_speeches:          'Central bank speeches, not crypto-specific',
  ecb_press:             'Central bank press, not crypto-specific',
  imf_blog:              'IMF commentary, not crypto-specific',
  boe_speeches:          'Central bank speeches, not crypto-specific',
};

let count = 0;
for (const [key, reason] of Object.entries(toDisable)) {
  // Pattern: category: 'xxx',\n  },  or  category: 'xxx',\n    disabled: true
  // We need to find the source entry and add disabled: true after category line
  const regex = new RegExp(
    `(  ${key}:\\s*\\{[\\s\\S]*?category:\\s*'[^']+'),(\\s*\\n\\s*\\},)`,
    'm'
  );
  const match = content.match(regex);
  if (match) {
    content = content.replace(regex, `$1\n    disabled: true, // Perf: ${reason}$2`);
    count++;
    console.log(`✓ Disabled: ${key}`);
  } else {
    console.log(`✗ Not found: ${key}`);
  }
}

fs.writeFileSync('src/lib/crypto-news.ts', content);
console.log(`\nDone: disabled ${count} sources`);
