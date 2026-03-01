const fs = require('fs');
const content = fs.readFileSync('src/lib/crypto-news.ts', 'utf8');

const sourcePattern = /^\s{2}(\w+):\s*\{\s*\n\s+name:\s*'([^']+)',\s*\n\s+url:\s*'([^']+)',\s*\n\s+category:\s*'([^']+)'(?:,\s*\n\s+disabled:\s*(true))?/gm;
const sources = [];
let match;
while ((match = sourcePattern.exec(content)) !== null) {
  const lineNum = content.substring(0, match.index).split('\n').length;
  sources.push({
    line: lineNum,
    key: match[1],
    name: match[2],
    url: match[3],
    category: match[4],
    disabled: match[5] === 'true'
  });
}

const disableCategories = ['geopolitical', 'tradfi', 'quant', 'macro', 'fintech'];
const disableMainstream = ['wsj_business', 'nyt_business', 'washingtonpost_biz', 'economist', 'marketwatch', 'seekingalpha', 'nikkei_asia', 'economic_times_india', 'ft_crypto'];
const keepGeopolitical = ['federal_reserve', 'sec_press'];

const toDisable = sources.filter(s => {
  if (s.disabled) return false;
  if (disableCategories.includes(s.category) && keepGeopolitical.indexOf(s.key) === -1) return true;
  if (disableMainstream.includes(s.key)) return true;
  return false;
});

const active = sources.filter(s => s.disabled === false);
console.log('Total sources:', sources.length);
console.log('Currently active:', active.length);
console.log('To disable:', toDisable.length);
console.log('Active after:', active.length - toDisable.length);
console.log('\nWill disable:');
for (const s of toDisable) {
  console.log(`  L${s.line}: ${s.key} (${s.category}) — ${s.name}`);
}
