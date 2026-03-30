---
title: "How to Spot a Rug Pull: Protecting Yourself from DeFi Scams"
description: "Learn what a rug pull is, the different types, and how to identify red flags before investing in any DeFi token. Tools and checklist to protect your funds."
date: "2026-03-30"
author: team
category: security
tags: ["rug pull", "scam", "defi", "safety", "smart contracts"]
image: "/images/blog/rug-pull-how-to-spot.jpg"
imageAlt: "Warning signs and red flags of cryptocurrency rug pull scams"
---

The term "rug pull" describes a DeFi exit scam where project developers abandon a project and run with investor funds. The name refers to pulling the rug out from underneath investors — they look down and everything is gone. Rug pulls cost DeFi users billions annually. Learning to recognize them is non-negotiable if you invest in small-cap tokens or new DeFi projects.

## What Is a Rug Pull?

A rug pull occurs when a project's creators exploit their privileged access to drain value from investors. Unlike a hack (where attackers target vulnerabilities), a rug pull is an intentional, planned theft by the people who built the project.

The typical arc: a team launches a token with exciting marketing, attracts significant liquidity, builds a community with hype and promises — then exits, taking all the value with them.

## Types of Rug Pulls

### Hard Rug

The most severe type. Developers use a backdoor function in the smart contract to drain the liquidity pool instantly. One transaction removes all liquidity, the price collapses to zero within seconds, and the team disappears.

Hard rugs are only possible if the smart contract contains malicious code — a mint function only the owner can call, a hidden withdrawal function, or ownership controls that weren't renounced.

### Soft Rug (Slow Rug)

Developers don't steal everything at once. Instead, they gradually sell their team token allocation, each sale depressing the price slightly. This can happen over days or weeks. Eventually the project has lost 90%+ of its value and the team quietly stops posting.

Soft rugs are harder to detect because each sell looks like normal trading. Signs include consistent large sells from known team wallets, slowing development activity, and fading community engagement.

### Liquidity Pull

Rather than exploiting a contract, developers simply remove their own liquidity from a DEX pool. This is possible when no lock is in place. Without liquidity, the token becomes untradable. Anyone holding it is left with worthless tokens they can't sell.

## Red Flags Before You Invest

### Anonymous Team with No Verifiable History

Pseudonymous teams aren't automatically suspicious — many legitimate projects are pseudonymous. But completely anonymous teams with no prior reputation, no verifiable identities, and no accountability are a significant warning sign for a project asking you to trust them with money.

### No Smart Contract Audit

Reputable projects pay for code audits from firms like Certik, Trail of Bits, Peckshield, or Quantstamp. Audits don't guarantee safety but they create accountability and reduce undetected backdoors. No audit on a project soliciting significant investment is a major red flag.

### Unlocked or Short-Term Locked Liquidity

Legitimate projects lock their liquidity through services like Team Finance or Unicrypt for extended periods (typically 1-2 years minimum). If liquidity is unlocked or locked for only 30-90 days, developers retain the ability to pull it.

Always verify liquidity lock status on the locking service directly — not just on the project's website.

### Honeypot Code

A honeypot is a token you can buy but not sell. The contract includes logic that blocks selling transactions for regular users while the dev wallet retains sell capability. Token price appears to climb (because everyone can only buy, not sell), attracting more buyers — until the developer dumps everything.

### Mint Function Not Renounced

If the contract owner retains the ability to mint unlimited new tokens, they can dilute existing holders to zero at any time. Check whether ownership has been renounced or whether the mint function has meaningful restrictions.

### Concentrated Token Holdings

If a handful of wallets hold 30-50%+ of the total supply (excluding locked tokens), those holders can dump and devastate the price. Check token holder distribution on Etherscan or BSCScan before buying.

### Pressure to Buy Quickly

Artificial urgency ("only 24 hours to buy at this price," "presale ending soon") is a classic manipulation tactic. Legitimate projects don't require you to rush.

## Tools to Check Before Buying

### Token Sniffer (tokensniffer.com)
Automated contract analysis that detects common rug pull patterns, honeypot code, and suspicious functions. Not perfect but catches many obvious threats in seconds.

### RugDoc (rugdoc.io)
Specialized DeFi project risk assessments. Their team analyzes farm contracts and rates risk levels. Focus on BSC and Ethereum projects.

### DEXTools / DEXScreener
Shows token age, transaction volume, wallet concentration, and large holder movements. Look at the holder list and transaction history before buying.

### Etherscan / BSCScan
Directly review the contract code, ownership status, and recent transactions. Check whether ownership is renounced (contract is now permissionless) and scan for suspicious functions.

### Honeypot.is
Specifically tests whether a token is a honeypot — attempts to simulate a buy and sell to detect if selling is blocked.

## Real Examples

**Squid Game Token (2021):** A token riding the Netflix show's popularity. Contained code preventing holders from selling. Price pumped to $2,856 before developers drained $3.38 million in one transaction. It became one of the most publicized hard rugs.

**AnubisDAO (2021):** Raised $60 million in ETH in a single day. Nineteen hours into the fundraise, all funds were transferred out of the LP. The anonymous team was never identified.

**Frosties NFT (2022):** Developers abandoned an NFT project immediately after mint, stealing $1.3 million. Notably, the developers were later arrested — showing rug pulls are not risk-free for perpetrators.

## A Quick Pre-Investment Checklist

Before buying any new DeFi token:

- [ ] Contract audited by reputable firm?
- [ ] Liquidity locked for 12+ months?
- [ ] Ownership renounced or clearly controlled by multisig?
- [ ] Token holder distribution reasonable?
- [ ] Team has verifiable background or history?
- [ ] Token passes Token Sniffer scan?
- [ ] No mint function or other privileged owner functions?
- [ ] Project has sustained activity (not just a sudden launch)?

No checklist eliminates all risk. But projects that fail multiple criteria above should be avoided entirely, not approached cautiously. The asymmetry between due diligence effort (30 minutes) and potential loss (everything you invest) makes this checklist worth running every time.
