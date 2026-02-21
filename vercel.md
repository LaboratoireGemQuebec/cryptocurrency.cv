04:54:46.363 Running build in Washington, D.C., USA (East) – iad1 (Turbo Build Machine)
04:54:46.364 Build machine configuration: 30 cores, 60 GB
04:54:46.483 Cloning github.com/nirholas/free-crypto-news (Branch: main, Commit: 3f922fc)
04:54:55.239 Cloning completed: 8.756s
04:54:55.424 Found .vercelignore
04:54:55.596 Removed 2478 ignored files defined in .vercelignore
04:54:55.596   /.github/CODEOWNERS
04:54:55.596   /.github/demo.svg
04:54:55.596   /.github/FUNDING.yml
04:54:55.596   /.github/ISSUE_TEMPLATE/bug_report.md
04:54:55.596   /.github/ISSUE_TEMPLATE/config.yml
04:54:55.596   /.github/ISSUE_TEMPLATE/feature_request.md
04:54:55.596   /.github/ISSUE_TEMPLATE/new_source.md
04:54:55.596   /.github/PULL_REQUEST_TEMPLATE.md
04:54:55.596   /.github/repository-metadata.json
04:54:55.596   /alfred/crypto-news.sh
04:54:55.647 Restored build cache from previous deployment (ECKfMVv7E8RDXCs7spwtgoTsa6fV)
04:54:55.895 Warning: Detected "engines": { "node": ">=18.0.0" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: https://vercel.link/node-version
04:54:55.895 Running "vercel build"
04:54:56.345 Vercel CLI 50.22.0
04:54:56.631 Warning: Detected "engines": { "node": ">=18.0.0" } in your `package.json` that will automatically upgrade when a new major Node.js Version is released. Learn More: https://vercel.link/node-version
04:54:56.650 Installing dependencies...
04:54:59.553 npm warn deprecated @types/recharts@2.0.1: This is a stub types definition. recharts provides its own type definitions, so you do not need this installed.
04:54:59.561 npm warn deprecated @types/redis@4.0.11: This is a stub types definition. redis provides its own type definitions, so you do not need this installed.
04:54:59.571 npm warn deprecated @types/dompurify@3.2.0: This is a stub types definition. dompurify provides its own type definitions, so you do not need this installed.
04:55:06.048 
04:55:06.049 > free-crypto-news@1.0.2 postinstall
04:55:06.049 > node -e "const fs=require('fs');const p='node_modules/tsconfig.base.json';if(!fs.existsSync(p))fs.writeFileSync(p,JSON.stringify({compilerOptions:{strict:true,esModuleInterop:true,skipLibCheck:true,moduleResolution:'bundler',module:'esnext',target:'es2021',lib:['es2021','dom']}},null,2))"
04:55:06.049 
04:55:06.073 
04:55:06.073 > free-crypto-news@1.0.2 prepare
04:55:06.073 > husky
04:55:06.073 
04:55:06.121 
04:55:06.121 added 137 packages, removed 52 packages, and changed 179 packages in 9s
04:55:06.121 
04:55:06.121 386 packages are looking for funding
04:55:06.121   run `npm fund` for details
04:55:06.160 Detected Next.js version: 16.1.6
04:55:06.167 Running "npm run build"
04:55:06.249 
04:55:06.249 > free-crypto-news@1.0.2 build
04:55:06.249 > next build
04:55:06.249 
04:55:06.883 ▲ Next.js 16.1.6 (Turbopack)
04:55:06.883 - Experiments (use with caution):
04:55:06.883   ✓ optimizeCss
04:55:06.883   · staleTimes
04:55:06.883 
04:55:07.001   Creating an optimized production build ...
04:55:15.988 ✓ Compiled successfully in 8.7s
04:55:15.990   Running TypeScript ...
04:55:37.830   Collecting page data using 29 workers ...
04:55:39.203 ⚠ Using edge runtime on a page currently disables static generation for that page
04:55:39.518 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.519 
04:55:39.525 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.525     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.525     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.585 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.586 
04:55:39.592 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.592     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.592     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.632 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.632 
04:55:39.632 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.632     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.632     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.632 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.633 
04:55:39.633 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.633     at Proxy.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:28:4383)
04:55:39.633     at async c.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:2:492)
04:55:39.639 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.639 
04:55:39.642 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.643 
04:55:39.644 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.644     at Proxy.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:28:4383)
04:55:39.644     at async c.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:2:492)
04:55:39.648 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.649     at Proxy.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:28:4383)
04:55:39.649     at async c.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:2:492)
04:55:39.649 [Redis] Connected
04:55:39.656 [Redis] Connected
04:55:39.660 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.660 
04:55:39.662 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.662 
04:55:39.665 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.665 
04:55:39.666 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.667     at Proxy.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:28:4383)
04:55:39.667     at async c.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:2:492)
04:55:39.667 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.667 
04:55:39.669 [Redis] Connected
04:55:39.670 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.670     at Proxy.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:28:4383)
04:55:39.670     at async c.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:2:492)
04:55:39.671 [Redis] Connected
04:55:39.671 [Redis] Connected
04:55:39.672 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.672     at Proxy.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:28:4383)
04:55:39.672     at async c.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:2:492)
04:55:39.673 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.674 
04:55:39.677 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.677 
04:55:39.679 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.679     at Proxy.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:28:4383)
04:55:39.679     at async c.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:2:492)
04:55:39.680 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.680     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.680     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.681 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.681     at Proxy.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:28:4383)
04:55:39.681     at async c.initialize (.next/server/edge/chunks/src_lib_x402_server_ts_7f2754b7._.js:2:492)
04:55:39.683 [Redis] Connected
04:55:39.688 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.688 
04:55:39.702 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.703     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.703     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.703 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.703 
04:55:39.703 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.703     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.703     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.703 [Redis] Connected
04:55:39.703 [Redis] Connected
04:55:39.704 [Redis] Connected
04:55:39.711 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.711 
04:55:39.715 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.715     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.715     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.718 [Redis] Connected
04:55:39.727 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.727 
04:55:39.727 [Redis] Connected
04:55:39.737   Generating static pages using 29 workers (0/904) ...
04:55:39.758 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.758     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.758     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.810 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:39.811 
04:55:39.811 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:39.811     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:39.811     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:39.837 [Redis] Initialization successful
04:55:39.850 [Redis] Initialization successful
04:55:39.851 [Redis] Initialization successful
04:55:39.887 Tags API error: Error: Dynamic server usage: Route /api/tags couldn't be rendered statically because it used `request.url`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
04:55:39.887     at w (.next/server/chunks/[root-of-the-server]__dd9c2a4b._.js:1:4152) {
04:55:39.888   description: "Route /api/tags couldn't be rendered statically because it used `request.url`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
04:55:39.888   digest: 'DYNAMIC_SERVER_USAGE'
04:55:39.888 }
04:55:40.043 [Redis] Initialization successful
04:55:40.049 [Redis] Initialization successful
04:55:40.331 [Redis] Initialization successful
04:55:40.399 [Redis] Connected
04:55:40.406 [Redis] Initialization successful
04:55:40.445 [Redis] Initialization successful
04:55:40.469 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.469 
04:55:40.481 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.481     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.481     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.484 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.484 
04:55:40.485 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.485     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.486     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.487 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.487 
04:55:40.488 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.488     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.488     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.491 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.491 
04:55:40.492 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.492     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.492     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.494 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.494 
04:55:40.495 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.495     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.495     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.498 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.498 
04:55:40.499 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.499     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.499     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.501 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.501 
04:55:40.502 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.502     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.502     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.506 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.506 
04:55:40.507 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.508     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.508     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.511 Failed to fetch supported kinds from facilitator: Error: Facilitator getSupported failed (401): Unauthorized
04:55:40.511 
04:55:40.513 Error: Failed to initialize: no supported payment kinds loaded from any facilitator.
04:55:40.513     at Proxy.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:28:4272)
04:55:40.513     at async l.initialize (.next/server/chunks/src_lib_x402_index_ts_d4634ccb._.js:2:492)
04:55:40.518 [Redis] Initialization successful
04:55:40.520 [Redis] Initialization successful
04:55:40.549 [Redis] Initialization successful
04:55:40.640 [Redis] Initialization successful
04:55:40.842   Generating static pages using 29 workers (226/904) 
04:55:40.914 Error: MISSING_MESSAGE: ai.hubTitle (en)
04:55:40.915     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:40.915   code: 'MISSING_MESSAGE',
04:55:40.915   originalMessage: 'ai.hubTitle (en)'
04:55:40.915 }
04:55:40.915 Error: MISSING_MESSAGE: ai.hubSubtitle (en)
04:55:40.916     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:40.916   code: 'MISSING_MESSAGE',
04:55:40.916   originalMessage: 'ai.hubSubtitle (en)'
04:55:40.916 }
04:55:40.917 Error: MISSING_MESSAGE: ai.capabilities (en)
04:55:40.917     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:40.917   code: 'MISSING_MESSAGE',
04:55:40.917   originalMessage: 'ai.capabilities (en)'
04:55:40.917 }
04:55:40.917 Error: MISSING_MESSAGE: ai.ctaTitle (en)
04:55:40.917     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:40.917   code: 'MISSING_MESSAGE',
04:55:40.918   originalMessage: 'ai.ctaTitle (en)'
04:55:40.918 }
04:55:40.918 Error: MISSING_MESSAGE: ai.ctaDesc (en)
04:55:40.918     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:40.918   code: 'MISSING_MESSAGE',
04:55:40.918   originalMessage: 'ai.ctaDesc (en)'
04:55:40.918 }
04:55:40.926 Error: MISSING_MESSAGE: ai.title (en)
04:55:40.926     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:40.926   code: 'MISSING_MESSAGE',
04:55:40.926   originalMessage: 'ai.title (en)'
04:55:40.927 }
04:55:40.927 Error: MISSING_MESSAGE: ai.description (en)
04:55:40.927     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:40.927   code: 'MISSING_MESSAGE',
04:55:40.927   originalMessage: 'ai.description (en)'
04:55:40.927 }
04:55:40.959 Error: MISSING_MESSAGE: ai.hubTitle (es)
04:55:40.959     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:40.959   code: 'MISSING_MESSAGE',
04:55:40.960   originalMessage: 'ai.hubTitle (es)'
04:55:40.960 }
04:55:40.960 Error: MISSING_MESSAGE: ai.hubSubtitle (es)
04:55:40.960     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:40.960   code: 'MISSING_MESSAGE',
04:55:40.960   originalMessage: 'ai.hubSubtitle (es)'
04:55:40.960 }
04:55:40.960 Error: MISSING_MESSAGE: ai.capabilities (es)
04:55:40.960     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:40.961   code: 'MISSING_MESSAGE',
04:55:40.961   originalMessage: 'ai.capabilities (es)'
04:55:40.961 }
04:55:40.961 Error: MISSING_MESSAGE: ai.ctaTitle (es)
04:55:40.961     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:40.961   code: 'MISSING_MESSAGE',
04:55:40.961   originalMessage: 'ai.ctaTitle (es)'
04:55:40.961 }
04:55:40.961 Error: MISSING_MESSAGE: ai.ctaDesc (es)
04:55:40.962     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:40.962   code: 'MISSING_MESSAGE',
04:55:40.962   originalMessage: 'ai.ctaDesc (es)'
04:55:40.962 }
04:55:40.966 Error: MISSING_MESSAGE: ai.title (es)
04:55:40.966     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:40.966   code: 'MISSING_MESSAGE',
04:55:40.967   originalMessage: 'ai.title (es)'
04:55:40.967 }
04:55:40.967 Error: MISSING_MESSAGE: ai.description (es)
04:55:40.967     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:40.967   code: 'MISSING_MESSAGE',
04:55:40.967   originalMessage: 'ai.description (es)'
04:55:40.967 }
04:55:40.989 Error: MISSING_MESSAGE: ai.hubTitle (fr)
04:55:40.990     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:40.990   code: 'MISSING_MESSAGE',
04:55:40.990   originalMessage: 'ai.hubTitle (fr)'
04:55:40.990 }
04:55:40.990 Error: MISSING_MESSAGE: ai.hubSubtitle (fr)
04:55:40.990     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:40.990   code: 'MISSING_MESSAGE',
04:55:40.990   originalMessage: 'ai.hubSubtitle (fr)'
04:55:40.990 }
04:55:40.990 Error: MISSING_MESSAGE: ai.capabilities (fr)
04:55:40.991     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:40.991   code: 'MISSING_MESSAGE',
04:55:40.991   originalMessage: 'ai.capabilities (fr)'
04:55:40.991 }
04:55:40.991 Error: MISSING_MESSAGE: ai.ctaTitle (fr)
04:55:40.991     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:40.991   code: 'MISSING_MESSAGE',
04:55:40.991   originalMessage: 'ai.ctaTitle (fr)'
04:55:40.991 }
04:55:40.991 Error: MISSING_MESSAGE: ai.ctaDesc (fr)
04:55:40.991     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:40.991   code: 'MISSING_MESSAGE',
04:55:40.994   originalMessage: 'ai.ctaDesc (fr)'
04:55:40.994 }
04:55:40.997 Error: MISSING_MESSAGE: ai.title (fr)
04:55:40.997     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:40.997   code: 'MISSING_MESSAGE',
04:55:40.997   originalMessage: 'ai.title (fr)'
04:55:40.997 }
04:55:40.998 Error: MISSING_MESSAGE: ai.description (fr)
04:55:40.998     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:40.998   code: 'MISSING_MESSAGE',
04:55:40.998   originalMessage: 'ai.description (fr)'
04:55:40.998 }
04:55:41.023 Error: MISSING_MESSAGE: ai.hubTitle (de)
04:55:41.023     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:41.023   code: 'MISSING_MESSAGE',
04:55:41.023   originalMessage: 'ai.hubTitle (de)'
04:55:41.023 }
04:55:41.023 Error: MISSING_MESSAGE: ai.hubSubtitle (de)
04:55:41.023     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:41.023   code: 'MISSING_MESSAGE',
04:55:41.023   originalMessage: 'ai.hubSubtitle (de)'
04:55:41.024 }
04:55:41.024 Error: MISSING_MESSAGE: ai.capabilities (de)
04:55:41.024     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:41.024   code: 'MISSING_MESSAGE',
04:55:41.024   originalMessage: 'ai.capabilities (de)'
04:55:41.024 }
04:55:41.024 Error: MISSING_MESSAGE: ai.ctaTitle (de)
04:55:41.024     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:41.024   code: 'MISSING_MESSAGE',
04:55:41.024   originalMessage: 'ai.ctaTitle (de)'
04:55:41.024 }
04:55:41.024 Error: MISSING_MESSAGE: ai.ctaDesc (de)
04:55:41.024     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:41.024   code: 'MISSING_MESSAGE',
04:55:41.025   originalMessage: 'ai.ctaDesc (de)'
04:55:41.025 }
04:55:41.028 Error: MISSING_MESSAGE: ai.title (de)
04:55:41.028     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:41.028   code: 'MISSING_MESSAGE',
04:55:41.028   originalMessage: 'ai.title (de)'
04:55:41.028 }
04:55:41.029 Error: MISSING_MESSAGE: ai.description (de)
04:55:41.029     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:41.029   code: 'MISSING_MESSAGE',
04:55:41.029   originalMessage: 'ai.description (de)'
04:55:41.029 }
04:55:41.051 Error: MISSING_MESSAGE: ai.hubTitle (ja)
04:55:41.051     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:41.051   code: 'MISSING_MESSAGE',
04:55:41.051   originalMessage: 'ai.hubTitle (ja)'
04:55:41.051 }
04:55:41.052 Error: MISSING_MESSAGE: ai.hubSubtitle (ja)
04:55:41.052     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:41.052   code: 'MISSING_MESSAGE',
04:55:41.052   originalMessage: 'ai.hubSubtitle (ja)'
04:55:41.052 }
04:55:41.052 Error: MISSING_MESSAGE: ai.capabilities (ja)
04:55:41.052     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:41.052   code: 'MISSING_MESSAGE',
04:55:41.052   originalMessage: 'ai.capabilities (ja)'
04:55:41.052 }
04:55:41.052 Error: MISSING_MESSAGE: ai.ctaTitle (ja)
04:55:41.052     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:41.052   code: 'MISSING_MESSAGE',
04:55:41.052   originalMessage: 'ai.ctaTitle (ja)'
04:55:41.052 }
04:55:41.052 Error: MISSING_MESSAGE: ai.ctaDesc (ja)
04:55:41.052     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:41.052   code: 'MISSING_MESSAGE',
04:55:41.053   originalMessage: 'ai.ctaDesc (ja)'
04:55:41.053 }
04:55:41.056 Error: MISSING_MESSAGE: ai.title (ja)
04:55:41.056     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:41.056   code: 'MISSING_MESSAGE',
04:55:41.056   originalMessage: 'ai.title (ja)'
04:55:41.056 }
04:55:41.056 Error: MISSING_MESSAGE: ai.description (ja)
04:55:41.056     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:41.056   code: 'MISSING_MESSAGE',
04:55:41.056   originalMessage: 'ai.description (ja)'
04:55:41.057 }
04:55:41.103 Error: MISSING_MESSAGE: ai.hubTitle (ko)
04:55:41.103     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:41.103   code: 'MISSING_MESSAGE',
04:55:41.103   originalMessage: 'ai.hubTitle (ko)'
04:55:41.103 }
04:55:41.103 Error: MISSING_MESSAGE: ai.hubSubtitle (ko)
04:55:41.104     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:41.104   code: 'MISSING_MESSAGE',
04:55:41.104   originalMessage: 'ai.hubSubtitle (ko)'
04:55:41.104 }
04:55:41.104 Error: MISSING_MESSAGE: ai.capabilities (ko)
04:55:41.104     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:41.104   code: 'MISSING_MESSAGE',
04:55:41.104   originalMessage: 'ai.capabilities (ko)'
04:55:41.104 }
04:55:41.104 Error: MISSING_MESSAGE: ai.ctaTitle (ko)
04:55:41.104     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:41.104   code: 'MISSING_MESSAGE',
04:55:41.104   originalMessage: 'ai.ctaTitle (ko)'
04:55:41.104 }
04:55:41.104 Error: MISSING_MESSAGE: ai.ctaDesc (ko)
04:55:41.104     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:41.104   code: 'MISSING_MESSAGE',
04:55:41.104   originalMessage: 'ai.ctaDesc (ko)'
04:55:41.104 }
04:55:41.107 Error: MISSING_MESSAGE: ai.title (ko)
04:55:41.107     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:41.108   code: 'MISSING_MESSAGE',
04:55:41.108   originalMessage: 'ai.title (ko)'
04:55:41.108 }
04:55:41.108 Error: MISSING_MESSAGE: ai.description (ko)
04:55:41.108     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:41.108   code: 'MISSING_MESSAGE',
04:55:41.108   originalMessage: 'ai.description (ko)'
04:55:41.108 }
04:55:41.129 Error: MISSING_MESSAGE: ai.hubTitle (zh-CN)
04:55:41.129     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:41.129   code: 'MISSING_MESSAGE',
04:55:41.129   originalMessage: 'ai.hubTitle (zh-CN)'
04:55:41.129 }
04:55:41.129 Error: MISSING_MESSAGE: ai.hubSubtitle (zh-CN)
04:55:41.129     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:41.129   code: 'MISSING_MESSAGE',
04:55:41.129   originalMessage: 'ai.hubSubtitle (zh-CN)'
04:55:41.129 }
04:55:41.129 Error: MISSING_MESSAGE: ai.capabilities (zh-CN)
04:55:41.129     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:41.129   code: 'MISSING_MESSAGE',
04:55:41.129   originalMessage: 'ai.capabilities (zh-CN)'
04:55:41.129 }
04:55:41.130 Error: MISSING_MESSAGE: ai.ctaTitle (zh-CN)
04:55:41.130     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:41.130   code: 'MISSING_MESSAGE',
04:55:41.130   originalMessage: 'ai.ctaTitle (zh-CN)'
04:55:41.130 }
04:55:41.130 Error: MISSING_MESSAGE: ai.ctaDesc (zh-CN)
04:55:41.130     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:41.130   code: 'MISSING_MESSAGE',
04:55:41.130   originalMessage: 'ai.ctaDesc (zh-CN)'
04:55:41.130 }
04:55:41.137 Error: MISSING_MESSAGE: ai.title (zh-CN)
04:55:41.137     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:41.137   code: 'MISSING_MESSAGE',
04:55:41.138   originalMessage: 'ai.title (zh-CN)'
04:55:41.138 }
04:55:41.138 Error: MISSING_MESSAGE: ai.description (zh-CN)
04:55:41.138     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:41.138   code: 'MISSING_MESSAGE',
04:55:41.138   originalMessage: 'ai.description (zh-CN)'
04:55:41.138 }
04:55:41.152 Error: MISSING_MESSAGE: ai.hubTitle (pt)
04:55:41.153     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:41.153   code: 'MISSING_MESSAGE',
04:55:41.153   originalMessage: 'ai.hubTitle (pt)'
04:55:41.153 }
04:55:41.153 Error: MISSING_MESSAGE: ai.hubSubtitle (pt)
04:55:41.153     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:41.153   code: 'MISSING_MESSAGE',
04:55:41.153   originalMessage: 'ai.hubSubtitle (pt)'
04:55:41.153 }
04:55:41.154 Error: MISSING_MESSAGE: ai.capabilities (pt)
04:55:41.154     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:41.154   code: 'MISSING_MESSAGE',
04:55:41.155   originalMessage: 'ai.capabilities (pt)'
04:55:41.155 }
04:55:41.155 Error: MISSING_MESSAGE: ai.ctaTitle (pt)
04:55:41.155     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:41.155   code: 'MISSING_MESSAGE',
04:55:41.155   originalMessage: 'ai.ctaTitle (pt)'
04:55:41.155 }
04:55:41.156 Error: MISSING_MESSAGE: ai.ctaDesc (pt)
04:55:41.156     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:41.156   code: 'MISSING_MESSAGE',
04:55:41.156   originalMessage: 'ai.ctaDesc (pt)'
04:55:41.156 }
04:55:41.159 Error: MISSING_MESSAGE: ai.title (pt)
04:55:41.159     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:41.160   code: 'MISSING_MESSAGE',
04:55:41.160   originalMessage: 'ai.title (pt)'
04:55:41.160 }
04:55:41.160 Error: MISSING_MESSAGE: ai.description (pt)
04:55:41.160     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:41.160   code: 'MISSING_MESSAGE',
04:55:41.160   originalMessage: 'ai.description (pt)'
04:55:41.160 }
04:55:41.433   Generating static pages using 29 workers (452/904) 
04:55:41.449 Failed to set Next.js data cache for https://api.llama.fi/raises, items over 2MB can not be cached (3767160 bytes)
04:55:41.591 Error: MISSING_MESSAGE: ai.hubTitle (ru)
04:55:41.591     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:41.591   code: 'MISSING_MESSAGE',
04:55:41.591   originalMessage: 'ai.hubTitle (ru)'
04:55:41.591 }
04:55:41.591 Error: MISSING_MESSAGE: ai.hubSubtitle (ru)
04:55:41.591     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:41.591   code: 'MISSING_MESSAGE',
04:55:41.591   originalMessage: 'ai.hubSubtitle (ru)'
04:55:41.591 }
04:55:41.591 Error: MISSING_MESSAGE: ai.capabilities (ru)
04:55:41.591     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:41.592   code: 'MISSING_MESSAGE',
04:55:41.592   originalMessage: 'ai.capabilities (ru)'
04:55:41.592 }
04:55:41.592 Error: MISSING_MESSAGE: ai.ctaTitle (ru)
04:55:41.592     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:41.592   code: 'MISSING_MESSAGE',
04:55:41.592   originalMessage: 'ai.ctaTitle (ru)'
04:55:41.592 }
04:55:41.592 Error: MISSING_MESSAGE: ai.ctaDesc (ru)
04:55:41.592     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:41.592   code: 'MISSING_MESSAGE',
04:55:41.592   originalMessage: 'ai.ctaDesc (ru)'
04:55:41.592 }
04:55:41.596 Error: MISSING_MESSAGE: ai.title (ru)
04:55:41.596     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:41.596   code: 'MISSING_MESSAGE',
04:55:41.596   originalMessage: 'ai.title (ru)'
04:55:41.596 }
04:55:41.597 Error: MISSING_MESSAGE: ai.description (ru)
04:55:41.597     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:41.597   code: 'MISSING_MESSAGE',
04:55:41.597   originalMessage: 'ai.description (ru)'
04:55:41.597 }
04:55:41.625 Error: MISSING_MESSAGE: ai.hubTitle (ar)
04:55:41.625     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:8894) {
04:55:41.625   code: 'MISSING_MESSAGE',
04:55:41.625   originalMessage: 'ai.hubTitle (ar)'
04:55:41.625 }
04:55:41.625 Error: MISSING_MESSAGE: ai.hubSubtitle (ar)
04:55:41.625     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:9034) {
04:55:41.625   code: 'MISSING_MESSAGE',
04:55:41.626   originalMessage: 'ai.hubSubtitle (ar)'
04:55:41.626 }
04:55:41.626 Error: MISSING_MESSAGE: ai.capabilities (ar)
04:55:41.626     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:11569) {
04:55:41.626   code: 'MISSING_MESSAGE',
04:55:41.626   originalMessage: 'ai.capabilities (ar)'
04:55:41.626 }
04:55:41.626 Error: MISSING_MESSAGE: ai.ctaTitle (ar)
04:55:41.626     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12191) {
04:55:41.626   code: 'MISSING_MESSAGE',
04:55:41.626   originalMessage: 'ai.ctaTitle (ar)'
04:55:41.626 }
04:55:41.626 Error: MISSING_MESSAGE: ai.ctaDesc (ar)
04:55:41.626     at i (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:12338) {
04:55:41.626   code: 'MISSING_MESSAGE',
04:55:41.626   originalMessage: 'ai.ctaDesc (ar)'
04:55:41.626 }
04:55:41.630 Error: MISSING_MESSAGE: ai.title (ar)
04:55:41.631     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:6999) {
04:55:41.631   code: 'MISSING_MESSAGE',
04:55:41.631   originalMessage: 'ai.title (ar)'
04:55:41.631 }
04:55:41.631 Error: MISSING_MESSAGE: ai.description (ar)
04:55:41.631     at Module.f (.next/server/chunks/ssr/[root-of-the-server]__b86f3cfe._.js:1:7062) {
04:55:41.631   code: 'MISSING_MESSAGE',
04:55:41.631   originalMessage: 'ai.description (ar)'
04:55:41.631 }
04:55:42.235   Generating static pages using 29 workers (678/904) 
04:55:42.246 [CoinGecko] 429 received – backing off 59s
04:55:42.246 [CoinGecko] Waiting 59.0s for retry-after
04:55:42.781 Error fetching Forkast News: TypeError: fetch failed
04:55:42.781     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:42.781   [cause]: AggregateError: 
04:55:42.781       at ignore-listed frames {
04:55:42.781     code: 'ETIMEDOUT'
04:55:42.781   }
04:55:42.781 }
04:55:42.796 Error fetching Cosmos Blog: TypeError: fetch failed
04:55:42.796     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:42.796   [cause]: Error: unable to verify the first certificate; if the root CA is installed locally, try running Node.js with --use-system-ca
04:55:42.796       at ignore-listed frames {
04:55:42.796     code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
04:55:42.796   }
04:55:42.796 }
04:55:42.896 Failed to set Next.js data cache for https://cryptodaily.co.uk/feed, items over 2MB can not be cached (2290776 bytes)
04:55:43.359 Error fetching VanEck Blog: Error: Dynamic server usage: Route /[locale] couldn't be rendered statically because it used revalidate: 0 fetch https://www.vaneck.com/us/en/blogs/rss/ /[locale]. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
04:55:43.359     at ec (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:60799)
04:55:43.359     at <unknown> (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:5:12145)
04:55:43.359     at <unknown> (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:56422)
04:55:43.359     at e.with (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:1293)
04:55:43.359     at e.with (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:7027)
04:55:43.359     at e.startActiveSpan (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:14666)
04:55:43.359     at e.startActiveSpan (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:14964)
04:55:43.359     at <unknown> (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:55967)
04:55:43.359     at e.with (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:1293)
04:55:43.359     at e.with (.next/server/chunks/[root-of-the-server]__e3ecfd17._.js:1:7027) {
04:55:43.360   description: "Route /[locale] couldn't be rendered statically because it used revalidate: 0 fetch https://www.vaneck.com/us/en/blogs/rss/ /[locale]. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
04:55:43.360   digest: 'DYNAMIC_SERVER_USAGE'
04:55:43.360 }
04:55:43.674 Failed to set Next.js data cache for https://cryptodaily.co.uk/feed, items over 2MB can not be cached (2290776 bytes)
04:55:47.796 Error fetching Yearn Finance Blog: TypeError: fetch failed
04:55:47.796     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:47.796   [cause]: Error: getaddrinfo ENOTFOUND blog.yearn.finance
04:55:47.796       at ignore-listed frames {
04:55:47.796     errno: -3008,
04:55:47.796     code: 'ENOTFOUND',
04:55:47.796     syscall: 'getaddrinfo',
04:55:47.796     hostname: 'blog.yearn.finance'
04:55:47.796   }
04:55:47.796 }
04:55:47.829 Error fetching Bankless: TypeError: fetch failed
04:55:47.829     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:47.829   [cause]: Error: Hostname/IP does not match certificate's altnames: Host: newsletter.banklesshq.com. is not in the cert's altnames: DNS:dora-nyc1.krystalhosting.com
04:55:47.829       at ignore-listed frames {
04:55:47.829     code: 'ERR_TLS_CERT_ALTNAME_INVALID',
04:55:47.829     reason: "Host: newsletter.banklesshq.com. is not in the cert's altnames: DNS:dora-nyc1.krystalhosting.com",
04:55:47.829     host: 'newsletter.banklesshq.com',
04:55:47.829     cert: {
04:55:47.829       subject: [Object: null prototype],
04:55:47.829       issuer: [Object: null prototype],
04:55:47.829       subjectaltname: 'DNS:dora-nyc1.krystalhosting.com',
04:55:47.829       infoAccess: [Object: null prototype],
04:55:47.829       ca: false,
04:55:47.829       modulus: 'AD50E267D13049F5E63B0D0AFB390225BA6B94D146C9939BE00D048A531828ECBFAC718DB6429742B9757AB200CD9FD9F84F1A29967FF375FEBF39B2ADFDE109DFFC6F61C459B47C57A4F924D302328C646EB02401C7FA840F5D11A736DCC25211B1B63A29E06279B7079DA7E715745DCC382077CD71DCB5B5A6D0001BF73B7FB18810A87908843B3CFC379E408BC1FCF2F41D0EC17C52059631DE518BC3F19D2D789EC2D8FD7FDE1B5ED21186CD3435BFC9CAFE2773F4E3E6EFBCD0C1AAF185CC313924FDBD04A027FBCBCD20201D870782E6F3FDB238A3345AF8119E1C851E6F3C690D09991FE8881E179C0F4CC27F7AA60F58985615E8569B4F2DB5E477AB',
04:55:47.829       exponent: '0x10001',
04:55:47.829       pubkey: <Buffer 30 82 01 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 01 0f 00 30 82 01 0a 02 82 01 01 00 ad 50 e2 67 d1 30 49 f5 e6 3b 0d 0a fb 39 02 25 ba ... 244 more bytes>,
04:55:47.829       bits: 2048,
04:55:47.829       valid_from: 'Jan  1 00:00:00 2026 GMT',
04:55:47.829       valid_to: 'Apr  1 23:59:59 2026 GMT',
04:55:47.829       fingerprint: '52:DC:16:E0:DA:A8:D8:79:2F:E8:6A:6B:A4:16:84:56:5B:94:9D:39',
04:55:47.829       fingerprint256: 'ED:C8:8F:1C:EF:D1:EF:73:38:81:97:7F:7B:40:1E:A3:3A:C5:1C:BC:52:4C:67:C9:68:9F:43:F0:8F:80:A1:B8',
04:55:47.829       fingerprint512: 'DE:BB:E5:12:3A:11:C3:4C:BE:8F:28:F9:75:75:34:46:AD:05:B4:7A:46:10:59:09:4D:E4:3A:BF:14:A3:65:54:68:41:F2:49:B2:D7:EC:05:72:28:4D:51:E3:1C:65:3D:69:C9:1E:83:19:CF:7B:24:1E:34:AE:C6:2A:3C:D1:04',
04:55:47.829       ext_key_usage: [Array],
04:55:47.829       serialNumber: 'C1FE10750A3F0E1B0747D73D5A77535D',
04:55:47.829       raw: <Buffer 30 82 06 7c 30 82 04 64 a0 03 02 01 02 02 11 00 c1 fe 10 75 0a 3f 0e 1b 07 47 d7 3d 5a 77 53 5d 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0c 05 00 30 4b 31 ... 1614 more bytes>,
04:55:47.829       asn1Curve: undefined,
04:55:47.830       nistCurve: undefined,
04:55:47.830       issuerCertificate: [Object]
04:55:47.830     }
04:55:47.830   }
04:55:47.830 }
04:55:48.608 Error fetching Yearn Finance Blog: TypeError: fetch failed
04:55:48.608     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:48.608   [cause]: Error: getaddrinfo ENOTFOUND blog.yearn.finance
04:55:48.608       at ignore-listed frames {
04:55:48.608     errno: -3008,
04:55:48.609     code: 'ENOTFOUND',
04:55:48.609     syscall: 'getaddrinfo',
04:55:48.609     hostname: 'blog.yearn.finance'
04:55:48.609   }
04:55:48.609 }
04:55:48.641 Error fetching Bankless: TypeError: fetch failed
04:55:48.641     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:48.641   [cause]: Error: Hostname/IP does not match certificate's altnames: Host: newsletter.banklesshq.com. is not in the cert's altnames: DNS:dora-nyc1.krystalhosting.com
04:55:48.641       at ignore-listed frames {
04:55:48.641     code: 'ERR_TLS_CERT_ALTNAME_INVALID',
04:55:48.641     reason: "Host: newsletter.banklesshq.com. is not in the cert's altnames: DNS:dora-nyc1.krystalhosting.com",
04:55:48.641     host: 'newsletter.banklesshq.com',
04:55:48.641     cert: {
04:55:48.641       subject: [Object: null prototype],
04:55:48.641       issuer: [Object: null prototype],
04:55:48.641       subjectaltname: 'DNS:dora-nyc1.krystalhosting.com',
04:55:48.641       infoAccess: [Object: null prototype],
04:55:48.641       ca: false,
04:55:48.641       modulus: 'AD50E267D13049F5E63B0D0AFB390225BA6B94D146C9939BE00D048A531828ECBFAC718DB6429742B9757AB200CD9FD9F84F1A29967FF375FEBF39B2ADFDE109DFFC6F61C459B47C57A4F924D302328C646EB02401C7FA840F5D11A736DCC25211B1B63A29E06279B7079DA7E715745DCC382077CD71DCB5B5A6D0001BF73B7FB18810A87908843B3CFC379E408BC1FCF2F41D0EC17C52059631DE518BC3F19D2D789EC2D8FD7FDE1B5ED21186CD3435BFC9CAFE2773F4E3E6EFBCD0C1AAF185CC313924FDBD04A027FBCBCD20201D870782E6F3FDB238A3345AF8119E1C851E6F3C690D09991FE8881E179C0F4CC27F7AA60F58985615E8569B4F2DB5E477AB',
04:55:48.641       exponent: '0x10001',
04:55:48.641       pubkey: <Buffer 30 82 01 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 01 0f 00 30 82 01 0a 02 82 01 01 00 ad 50 e2 67 d1 30 49 f5 e6 3b 0d 0a fb 39 02 25 ba ... 244 more bytes>,
04:55:48.641       bits: 2048,
04:55:48.641       valid_from: 'Jan  1 00:00:00 2026 GMT',
04:55:48.641       valid_to: 'Apr  1 23:59:59 2026 GMT',
04:55:48.642       fingerprint: '52:DC:16:E0:DA:A8:D8:79:2F:E8:6A:6B:A4:16:84:56:5B:94:9D:39',
04:55:48.642       fingerprint256: 'ED:C8:8F:1C:EF:D1:EF:73:38:81:97:7F:7B:40:1E:A3:3A:C5:1C:BC:52:4C:67:C9:68:9F:43:F0:8F:80:A1:B8',
04:55:48.642       fingerprint512: 'DE:BB:E5:12:3A:11:C3:4C:BE:8F:28:F9:75:75:34:46:AD:05:B4:7A:46:10:59:09:4D:E4:3A:BF:14:A3:65:54:68:41:F2:49:B2:D7:EC:05:72:28:4D:51:E3:1C:65:3D:69:C9:1E:83:19:CF:7B:24:1E:34:AE:C6:2A:3C:D1:04',
04:55:48.642       ext_key_usage: [Array],
04:55:48.642       serialNumber: 'C1FE10750A3F0E1B0747D73D5A77535D',
04:55:48.642       raw: <Buffer 30 82 06 7c 30 82 04 64 a0 03 02 01 02 02 11 00 c1 fe 10 75 0a 3f 0e 1b 07 47 d7 3d 5a 77 53 5d 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0c 05 00 30 4b 31 ... 1614 more bytes>,
04:55:48.642       asn1Curve: undefined,
04:55:48.642       nistCurve: undefined,
04:55:48.642       issuerCertificate: [Object]
04:55:48.642     }
04:55:48.642   }
04:55:48.642 }
04:55:49.691 Error fetching DappRadar Blog: Error: Dynamic server usage: Route /[locale]/read couldn't be rendered statically because it used revalidate: 0 fetch https://dappradar.com/blog/feed /[locale]/read. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
04:55:49.691     at ignore-listed frames {
04:55:49.691   description: "Route /[locale]/read couldn't be rendered statically because it used revalidate: 0 fetch https://dappradar.com/blog/feed /[locale]/read. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
04:55:49.691   digest: 'DYNAMIC_SERVER_USAGE'
04:55:49.692 }
04:55:50.159 Error fetching DappRadar Blog: Error: Dynamic server usage: Route /[locale]/defi couldn't be rendered statically because it used revalidate: 0 fetch https://dappradar.com/blog/feed /[locale]/defi. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
04:55:50.160     at ignore-listed frames {
04:55:50.160   description: "Route /[locale]/defi couldn't be rendered statically because it used revalidate: 0 fetch https://dappradar.com/blog/feed /[locale]/defi. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
04:55:50.160   digest: 'DYNAMIC_SERVER_USAGE'
04:55:50.160 }
04:55:50.998 Error fetching Cosmos Blog: TypeError: fetch failed
04:55:50.998     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:50.998   [cause]: Error: unable to verify the first certificate; if the root CA is installed locally, try running Node.js with --use-system-ca
04:55:50.998       at ignore-listed frames {
04:55:50.998     code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
04:55:50.998   }
04:55:50.998 }
04:55:51.374 Error fetching VanEck Blog: Error: Dynamic server usage: Route /[locale]/read couldn't be rendered statically because it used no-store fetch https://www.vaneck.com/us/en/blogs/rss/ /[locale]/read. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
04:55:51.374     at ignore-listed frames {
04:55:51.374   description: "Route /[locale]/read couldn't be rendered statically because it used no-store fetch https://www.vaneck.com/us/en/blogs/rss/ /[locale]/read. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
04:55:51.374   digest: 'DYNAMIC_SERVER_USAGE'
04:55:51.374 }
04:55:51.383 Error fetching Kaiko Research: TypeError: fetch failed
04:55:51.383     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:51.383   [cause]: Error: getaddrinfo ENOTFOUND blog.kaiko.com
04:55:51.383       at ignore-listed frames {
04:55:51.383     errno: -3008,
04:55:51.383     code: 'ENOTFOUND',
04:55:51.383     syscall: 'getaddrinfo',
04:55:51.383     hostname: 'blog.kaiko.com'
04:55:51.383   }
04:55:51.383 }
04:55:51.396 Error fetching The Tie Research: TypeError: fetch failed
04:55:51.396     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:51.396   [cause]: Error: Hostname/IP does not match certificate's altnames: Host: blog.thetie.io. is not in the cert's altnames: DNS:*.wpengine.com, DNS:wpengine.com
04:55:51.396       at ignore-listed frames {
04:55:51.396     code: 'ERR_TLS_CERT_ALTNAME_INVALID',
04:55:51.396     reason: "Host: blog.thetie.io. is not in the cert's altnames: DNS:*.wpengine.com, DNS:wpengine.com",
04:55:51.396     host: 'blog.thetie.io',
04:55:51.396     cert: {
04:55:51.396       subject: [Object: null prototype],
04:55:51.396       issuer: [Object: null prototype],
04:55:51.396       subjectaltname: 'DNS:*.wpengine.com, DNS:wpengine.com',
04:55:51.396       infoAccess: [Object: null prototype],
04:55:51.396       ca: false,
04:55:51.396       modulus: 'CA9577A1D0629DD9B8D1723AC79F34DAEB39BAF36F92E72409EF871B24D9D3E040F4B31FD1EE88380A4C65D013FA1BC57276C21423F3895C244553486796863DCA8B17D98F89555A052C4840F7526B98492150A9EB3D85AAC223120A4592BD785D65F66299B1893B4DF5A59C7BDC360CC7F846C8188F787C45AA02152431BD86B24B9D9219BA77B1F0D5FC5576712CFB7E7C7DF0D160AD99C646C978D39BC8A696C6068ACD926F76B656806D2F7A8C30481E4FB7A4F6EBE35BA77B2529F2A7266DE34D69281533C2BD7159828C9E0E556D057D38A32AEB6D2F3CC8EB7E6B0128F64D25D90985DCDC54E88E397C8F1E1327B1F07CB7CD666B540C29F55FC5782F',
04:55:51.396       exponent: '0x10001',
04:55:51.396       pubkey: <Buffer 30 82 01 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 01 0f 00 30 82 01 0a 02 82 01 01 00 ca 95 77 a1 d0 62 9d d9 b8 d1 72 3a c7 9f 34 da eb ... 244 more bytes>,
04:55:51.396       bits: 2048,
04:55:51.396       valid_from: 'Jan 30 00:00:00 2026 GMT',
04:55:51.396       valid_to: 'Mar  2 23:59:59 2027 GMT',
04:55:51.396       fingerprint: '6F:BF:55:E2:DA:89:39:3D:7F:F9:7A:B5:5E:D6:C3:C4:87:E9:1E:BB',
04:55:51.396       fingerprint256: '1B:41:97:15:BB:D1:E2:2B:23:FF:5F:88:F7:37:79:A2:56:92:16:21:44:E8:FE:45:B1:FD:C1:C7:95:F2:4E:6E',
04:55:51.396       fingerprint512: '2D:3A:86:0A:DE:97:39:E1:45:28:06:23:50:25:C3:26:7B:69:FA:19:82:B7:AB:47:7C:5D:58:47:F5:73:93:D7:67:FA:93:7E:AB:83:CA:77:4A:84:6B:7C:8B:71:E1:D1:55:94:D5:2F:87:5B:6E:EF:D4:5C:8D:DC:87:8C:6E:A7',
04:55:51.396       ext_key_usage: [Array],
04:55:51.396       serialNumber: '0B867071854BAD31C23C79D6B4C9BD34',
04:55:51.396       raw: <Buffer 30 82 06 28 30 82 05 10 a0 03 02 01 02 02 10 0b 86 70 71 85 4b ad 31 c2 3c 79 d6 b4 c9 bd 34 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0b 05 00 30 60 31 0b ... 1530 more bytes>,
04:55:51.396       asn1Curve: undefined,
04:55:51.396       nistCurve: undefined,
04:55:51.396       issuerCertificate: [Object]
04:55:51.396     }
04:55:51.396   }
04:55:51.396 }
04:55:51.953 Error fetching Cosmos Blog: TypeError: fetch failed
04:55:51.953     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:51.953   [cause]: Error: unable to verify the first certificate; if the root CA is installed locally, try running Node.js with --use-system-ca
04:55:51.953       at ignore-listed frames {
04:55:51.953     code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
04:55:51.953   }
04:55:51.953 }
04:55:52.326 Error fetching VanEck Blog: Error: Dynamic server usage: Route /[locale]/defi couldn't be rendered statically because it used no-store fetch https://www.vaneck.com/us/en/blogs/rss/ /[locale]/defi. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
04:55:52.327     at ignore-listed frames {
04:55:52.327   description: "Route /[locale]/defi couldn't be rendered statically because it used no-store fetch https://www.vaneck.com/us/en/blogs/rss/ /[locale]/defi. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
04:55:52.327   digest: 'DYNAMIC_SERVER_USAGE'
04:55:52.327 }
04:55:52.338 Error fetching Kaiko Research: TypeError: fetch failed
04:55:52.338     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:52.338   [cause]: Error: getaddrinfo ENOTFOUND blog.kaiko.com
04:55:52.338       at ignore-listed frames {
04:55:52.338     errno: -3008,
04:55:52.338     code: 'ENOTFOUND',
04:55:52.338     syscall: 'getaddrinfo',
04:55:52.338     hostname: 'blog.kaiko.com'
04:55:52.338   }
04:55:52.338 }
04:55:52.372 Error fetching The Tie Research: TypeError: fetch failed
04:55:52.372     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:52.372   [cause]: Error: Hostname/IP does not match certificate's altnames: Host: blog.thetie.io. is not in the cert's altnames: DNS:*.wpengine.com, DNS:wpengine.com
04:55:52.372       at ignore-listed frames {
04:55:52.372     code: 'ERR_TLS_CERT_ALTNAME_INVALID',
04:55:52.372     reason: "Host: blog.thetie.io. is not in the cert's altnames: DNS:*.wpengine.com, DNS:wpengine.com",
04:55:52.372     host: 'blog.thetie.io',
04:55:52.372     cert: {
04:55:52.372       subject: [Object: null prototype],
04:55:52.372       issuer: [Object: null prototype],
04:55:52.373       subjectaltname: 'DNS:*.wpengine.com, DNS:wpengine.com',
04:55:52.373       infoAccess: [Object: null prototype],
04:55:52.373       ca: false,
04:55:52.373       modulus: 'CA9577A1D0629DD9B8D1723AC79F34DAEB39BAF36F92E72409EF871B24D9D3E040F4B31FD1EE88380A4C65D013FA1BC57276C21423F3895C244553486796863DCA8B17D98F89555A052C4840F7526B98492150A9EB3D85AAC223120A4592BD785D65F66299B1893B4DF5A59C7BDC360CC7F846C8188F787C45AA02152431BD86B24B9D9219BA77B1F0D5FC5576712CFB7E7C7DF0D160AD99C646C978D39BC8A696C6068ACD926F76B656806D2F7A8C30481E4FB7A4F6EBE35BA77B2529F2A7266DE34D69281533C2BD7159828C9E0E556D057D38A32AEB6D2F3CC8EB7E6B0128F64D25D90985DCDC54E88E397C8F1E1327B1F07CB7CD666B540C29F55FC5782F',
04:55:52.373       exponent: '0x10001',
04:55:52.373       pubkey: <Buffer 30 82 01 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 01 0f 00 30 82 01 0a 02 82 01 01 00 ca 95 77 a1 d0 62 9d d9 b8 d1 72 3a c7 9f 34 da eb ... 244 more bytes>,
04:55:52.373       bits: 2048,
04:55:52.373       valid_from: 'Jan 30 00:00:00 2026 GMT',
04:55:52.373       valid_to: 'Mar  2 23:59:59 2027 GMT',
04:55:52.373       fingerprint: '6F:BF:55:E2:DA:89:39:3D:7F:F9:7A:B5:5E:D6:C3:C4:87:E9:1E:BB',
04:55:52.373       fingerprint256: '1B:41:97:15:BB:D1:E2:2B:23:FF:5F:88:F7:37:79:A2:56:92:16:21:44:E8:FE:45:B1:FD:C1:C7:95:F2:4E:6E',
04:55:52.373       fingerprint512: '2D:3A:86:0A:DE:97:39:E1:45:28:06:23:50:25:C3:26:7B:69:FA:19:82:B7:AB:47:7C:5D:58:47:F5:73:93:D7:67:FA:93:7E:AB:83:CA:77:4A:84:6B:7C:8B:71:E1:D1:55:94:D5:2F:87:5B:6E:EF:D4:5C:8D:DC:87:8C:6E:A7',
04:55:52.373       ext_key_usage: [Array],
04:55:52.373       serialNumber: '0B867071854BAD31C23C79D6B4C9BD34',
04:55:52.373       raw: <Buffer 30 82 06 28 30 82 05 10 a0 03 02 01 02 02 10 0b 86 70 71 85 4b ad 31 c2 3c 79 d6 b4 c9 bd 34 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0b 05 00 30 60 31 0b ... 1530 more bytes>,
04:55:52.373       asn1Curve: undefined,
04:55:52.373       nistCurve: undefined,
04:55:52.373       issuerCertificate: [Object]
04:55:52.373     }
04:55:52.373   }
04:55:52.373 }
04:55:54.905 Error fetching Week in Ethereum: TypeError: fetch failed
04:55:54.905     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:54.905   [cause]: Error: Hostname/IP does not match certificate's altnames: Host: weekinethereumnews.com. is not in the cert's altnames: DNS:*.ingress-florina.ewp.live, DNS:ingress-florina.ewp.live
04:55:54.905       at ignore-listed frames {
04:55:54.905     code: 'ERR_TLS_CERT_ALTNAME_INVALID',
04:55:54.905     reason: "Host: weekinethereumnews.com. is not in the cert's altnames: DNS:*.ingress-florina.ewp.live, DNS:ingress-florina.ewp.live",
04:55:54.905     host: 'weekinethereumnews.com',
04:55:54.905     cert: {
04:55:54.905       subject: [Object: null prototype],
04:55:54.905       issuer: [Object: null prototype],
04:55:54.905       subjectaltname: 'DNS:*.ingress-florina.ewp.live, DNS:ingress-florina.ewp.live',
04:55:54.906       infoAccess: [Object: null prototype],
04:55:54.906       ca: false,
04:55:54.906       modulus: 'DE56A7B122BAAD10FA9A2D8EE1E68FD2DFD0000C85883E436F1915B8291697A382FAC59561284BAE95CEA356E4A453DDD17D203C0DF4666DB861323E195C551EFD86FF37B4275900944DE5080087145C0F632DE502641E374E3CFBA1F5BD1801B54F9C1E903FA6C45721FF4CF7BCB1C722D727A8AE165FD8CDAD2CED6934F1119D8C23A026B068C3345505D12851F11A288FBA3F5D62F9DD584A137F4BC4CA32C1300E741A4D947C43CE1E34A967F8020B57EAD76B52D8F98B57D3F69EE2092C7C5D29EB9E57ACFB402D414A5E2AF91FA33B8B81548052FBC225550F19A98CDBACD3C47FFA544809CF7329EC40F5B6EB453DAC032527763D8765F0C2775C4203',
04:55:54.906       exponent: '0x10001',
04:55:54.906       pubkey: <Buffer 30 82 01 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 01 0f 00 30 82 01 0a 02 82 01 01 00 de 56 a7 b1 22 ba ad 10 fa 9a 2d 8e e1 e6 8f d2 df ... 244 more bytes>,
04:55:54.906       bits: 2048,
04:55:54.906       valid_from: 'May  9 00:00:00 2025 GMT',
04:55:54.906       valid_to: 'Jun  4 23:59:59 2026 GMT',
04:55:54.906       fingerprint: '4F:05:7D:88:E1:CB:0D:68:E1:39:26:7D:6E:61:74:10:DA:18:71:4C',
04:55:54.906       fingerprint256: '99:47:94:B7:E6:C3:DE:28:F5:50:7E:F1:26:29:65:2A:AC:83:3A:70:3B:5A:31:0B:64:8C:7B:08:0F:12:B2:A3',
04:55:54.906       fingerprint512: 'B3:38:0F:C8:9F:86:8B:38:E0:31:36:BC:37:7E:33:AB:10:88:51:DC:62:19:0C:3D:76:A1:2D:2C:5C:54:E8:4F:56:F5:9C:93:67:6D:49:38:BB:46:C0:B7:A8:90:27:8B:A7:C9:72:BE:AE:CB:17:FF:2E:92:23:D9:7D:AF:29:49',
04:55:54.906       ext_key_usage: [Array],
04:55:54.906       serialNumber: '9765D2F940A4BCBE72CB5407C2BC9A46',
04:55:54.906       raw: <Buffer 30 82 06 59 30 82 05 41 a0 03 02 01 02 02 11 00 97 65 d2 f9 40 a4 bc be 72 cb 54 07 c2 bc 9a 46 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0b 05 00 30 81 8f ... 1579 more bytes>,
04:55:54.906       asn1Curve: undefined,
04:55:54.906       nistCurve: undefined,
04:55:54.906       issuerCertificate: [Object]
04:55:54.906     }
04:55:54.906   }
04:55:54.906 }
04:55:57.335 Error fetching Week in Ethereum: TypeError: fetch failed
04:55:57.335     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:57.335   [cause]: Error: Hostname/IP does not match certificate's altnames: Host: weekinethereumnews.com. is not in the cert's altnames: DNS:*.ingress-florina.ewp.live, DNS:ingress-florina.ewp.live
04:55:57.335       at ignore-listed frames {
04:55:57.335     code: 'ERR_TLS_CERT_ALTNAME_INVALID',
04:55:57.335     reason: "Host: weekinethereumnews.com. is not in the cert's altnames: DNS:*.ingress-florina.ewp.live, DNS:ingress-florina.ewp.live",
04:55:57.335     host: 'weekinethereumnews.com',
04:55:57.335     cert: {
04:55:57.335       subject: [Object: null prototype],
04:55:57.336       issuer: [Object: null prototype],
04:55:57.336       subjectaltname: 'DNS:*.ingress-florina.ewp.live, DNS:ingress-florina.ewp.live',
04:55:57.336       infoAccess: [Object: null prototype],
04:55:57.336       ca: false,
04:55:57.336       modulus: 'DE56A7B122BAAD10FA9A2D8EE1E68FD2DFD0000C85883E436F1915B8291697A382FAC59561284BAE95CEA356E4A453DDD17D203C0DF4666DB861323E195C551EFD86FF37B4275900944DE5080087145C0F632DE502641E374E3CFBA1F5BD1801B54F9C1E903FA6C45721FF4CF7BCB1C722D727A8AE165FD8CDAD2CED6934F1119D8C23A026B068C3345505D12851F11A288FBA3F5D62F9DD584A137F4BC4CA32C1300E741A4D947C43CE1E34A967F8020B57EAD76B52D8F98B57D3F69EE2092C7C5D29EB9E57ACFB402D414A5E2AF91FA33B8B81548052FBC225550F19A98CDBACD3C47FFA544809CF7329EC40F5B6EB453DAC032527763D8765F0C2775C4203',
04:55:57.336       exponent: '0x10001',
04:55:57.336       pubkey: <Buffer 30 82 01 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 01 0f 00 30 82 01 0a 02 82 01 01 00 de 56 a7 b1 22 ba ad 10 fa 9a 2d 8e e1 e6 8f d2 df ... 244 more bytes>,
04:55:57.336       bits: 2048,
04:55:57.336       valid_from: 'May  9 00:00:00 2025 GMT',
04:55:57.336       valid_to: 'Jun  4 23:59:59 2026 GMT',
04:55:57.336       fingerprint: '4F:05:7D:88:E1:CB:0D:68:E1:39:26:7D:6E:61:74:10:DA:18:71:4C',
04:55:57.336       fingerprint256: '99:47:94:B7:E6:C3:DE:28:F5:50:7E:F1:26:29:65:2A:AC:83:3A:70:3B:5A:31:0B:64:8C:7B:08:0F:12:B2:A3',
04:55:57.336       fingerprint512: 'B3:38:0F:C8:9F:86:8B:38:E0:31:36:BC:37:7E:33:AB:10:88:51:DC:62:19:0C:3D:76:A1:2D:2C:5C:54:E8:4F:56:F5:9C:93:67:6D:49:38:BB:46:C0:B7:A8:90:27:8B:A7:C9:72:BE:AE:CB:17:FF:2E:92:23:D9:7D:AF:29:49',
04:55:57.336       ext_key_usage: [Array],
04:55:57.336       serialNumber: '9765D2F940A4BCBE72CB5407C2BC9A46',
04:55:57.336       raw: <Buffer 30 82 06 59 30 82 05 41 a0 03 02 01 02 02 11 00 97 65 d2 f9 40 a4 bc be 72 cb 54 07 c2 bc 9a 46 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0b 05 00 30 81 8f ... 1579 more bytes>,
04:55:57.336       asn1Curve: undefined,
04:55:57.336       nistCurve: undefined,
04:55:57.336       issuerCertificate: [Object]
04:55:57.336     }
04:55:57.336   }
04:55:57.336 }
04:55:57.677 Error fetching DailyFX: TypeError: fetch failed
04:55:57.677     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:55:57.677   [cause]: Error: getaddrinfo ENOTFOUND rss.dailyfx.com
04:55:57.677       at ignore-listed frames {
04:55:57.677     errno: -3008,
04:55:57.677     code: 'ENOTFOUND',
04:55:57.677     syscall: 'getaddrinfo',
04:55:57.677     hostname: 'rss.dailyfx.com'
04:55:57.677   }
04:55:57.677 }
04:55:57.728 Error fetching Federal Reserve: RangeError: Invalid time value
04:55:57.728     at Date1.toISOString (<anonymous>)
04:55:57.728     at <unknown> (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:34182)
04:55:57.728     at <unknown> (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:34253)
04:56:00.301 Error fetching DailyFX: TypeError: fetch failed
04:56:00.302     at async (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:32853) {
04:56:00.302   [cause]: Error: getaddrinfo ENOTFOUND rss.dailyfx.com
04:56:00.302       at ignore-listed frames {
04:56:00.302     errno: -3008,
04:56:00.302     code: 'ENOTFOUND',
04:56:00.302     syscall: 'getaddrinfo',
04:56:00.302     hostname: 'rss.dailyfx.com'
04:56:00.302   }
04:56:00.302 }
04:56:00.361 Error fetching Federal Reserve: RangeError: Invalid time value
04:56:00.361     at Date1.toISOString (<anonymous>)
04:56:00.361     at <unknown> (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:34182)
04:56:00.361     at <unknown> (.next/server/chunks/ssr/src_lib_crypto-news_ts_be52be65._.js:1:34253)
04:56:41.979 Failed to build /[locale]/markets/exchanges/page: /en/markets/exchanges (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
04:56:41.979 Failed to build /[locale]/markets/exchanges/page: /fr/markets/exchanges (attempt 1 of 3) because it took more than 60 seconds. Retrying again shortly.
04:56:43.355   Generating static pages using 29 workers (903/904) 
04:56:45.344 ✓ Generating static pages using 29 workers (904/904) in 66s
04:56:49.368   Finalizing page optimization ...
04:56:50.183 
04:56:50.190 Route (app)                                  Revalidate  Expire
04:56:50.190 ┌ ○ /_not-found
04:56:50.191 ├ ƒ /.well-known/agents.json
04:56:50.191 ├ ƒ /.well-known/ai-plugin.json
04:56:50.191 ├ ƒ /.well-known/x402
04:56:50.191 ├ ƒ /[locale]                                        5m      1y
04:56:50.191 ├ ● /[locale]                                        5m      1y
04:56:50.191 │ ├ /es                                              5m      1y
04:56:50.191 │ ├ /fr                                              5m      1y
04:56:50.191 │ ├ /de                                              5m      1y
04:56:50.191 │ └ [+6 more paths]
04:56:50.191 ├ ● /[locale]/about
04:56:50.191 │ ├ /en/about
04:56:50.191 │ ├ /es/about
04:56:50.191 │ ├ /fr/about
04:56:50.191 │ └ [+7 more paths]
04:56:50.191 ├ ● /[locale]/admin
04:56:50.191 │ ├ /en/admin
04:56:50.191 │ ├ /es/admin
04:56:50.191 │ ├ /fr/admin
04:56:50.191 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/ai
04:56:50.192 │ ├ /en/ai
04:56:50.192 │ ├ /es/ai
04:56:50.192 │ ├ /fr/ai
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/ai-agent
04:56:50.192 │ ├ /en/ai-agent
04:56:50.192 │ ├ /es/ai-agent
04:56:50.192 │ ├ /fr/ai-agent
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ƒ /[locale]/ai/brief
04:56:50.192 ├ ● /[locale]/ai/counter
04:56:50.192 │ ├ /en/ai/counter
04:56:50.192 │ ├ /es/ai/counter
04:56:50.192 │ ├ /fr/ai/counter
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/ai/debate
04:56:50.192 │ ├ /en/ai/debate
04:56:50.192 │ ├ /es/ai/debate
04:56:50.192 │ ├ /fr/ai/debate
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/ai/oracle
04:56:50.192 │ ├ /en/ai/oracle
04:56:50.192 │ ├ /es/ai/oracle
04:56:50.192 │ ├ /fr/ai/oracle
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/analytics
04:56:50.192 │ ├ /en/analytics
04:56:50.192 │ ├ /es/analytics
04:56:50.192 │ ├ /fr/analytics
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/analytics/headlines
04:56:50.192 │ ├ /en/analytics/headlines
04:56:50.192 │ ├ /es/analytics/headlines
04:56:50.192 │ ├ /fr/analytics/headlines
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/arbitrage
04:56:50.192 │ ├ /en/arbitrage
04:56:50.192 │ ├ /es/arbitrage
04:56:50.192 │ ├ /fr/arbitrage
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/article
04:56:50.192 │ ├ /en/article
04:56:50.192 │ ├ /es/article
04:56:50.192 │ ├ /fr/article
04:56:50.192 │ └ [+7 more paths]
04:56:50.192 ├ ● /[locale]/article/[id]
04:56:50.192 ├ ƒ /[locale]/article/[id]/opengraph-image
04:56:50.192 ├ ● /[locale]/backtest
04:56:50.193 │ ├ /en/backtest
04:56:50.193 │ ├ /es/backtest
04:56:50.193 │ ├ /fr/backtest
04:56:50.193 │ └ [+7 more paths]
04:56:50.193 ├ ● /[locale]/billing
04:56:50.193 │ ├ /en/billing
04:56:50.193 │ ├ /es/billing
04:56:50.193 │ ├ /fr/billing
04:56:50.193 │ └ [+7 more paths]
04:56:50.193 ├ ● /[locale]/blog                                   1h      1y
04:56:50.193 │ ├ /en/blog                                         1h      1y
04:56:50.193 │ ├ /es/blog                                         1h      1y
04:56:50.193 │ ├ /fr/blog                                         1h      1y
04:56:50.193 │ └ [+7 more paths]
04:56:50.193 ├ ○ /[locale]/blog/[slug]
04:56:50.193 ├ ○ /[locale]/blog/category/[category]
04:56:50.193 ├ ○ /[locale]/blog/tag/[tag]
04:56:50.193 ├ ● /[locale]/bookmarks
04:56:50.193 │ ├ /en/bookmarks
04:56:50.193 │ ├ /es/bookmarks
04:56:50.193 │ ├ /fr/bookmarks
04:56:50.193 │ └ [+7 more paths]
04:56:50.193 ├ ● /[locale]/buzz
04:56:50.193 │ ├ /en/buzz
04:56:50.193 │ ├ /es/buzz
04:56:50.193 │ ├ /fr/buzz
04:56:50.193 │ └ [+7 more paths]
04:56:50.193 ├ ● /[locale]/calculator
04:56:50.193 │ ├ /en/calculator
04:56:50.193 │ ├ /es/calculator
04:56:50.193 │ ├ /fr/calculator
04:56:50.193 │ └ [+7 more paths]
04:56:50.193 ├ ● /[locale]/category
04:56:50.193 │ ├ /en/category
04:56:50.193 │ ├ /es/category
04:56:50.193 │ ├ /fr/category
04:56:50.193 │ └ [+7 more paths]
04:56:50.193 ├ ● /[locale]/category/[category]
04:56:50.193 ├ ● /[locale]/charts
04:56:50.193 │ ├ /en/charts
04:56:50.193 │ ├ /es/charts
04:56:50.193 │ ├ /fr/charts
04:56:50.193 │ └ [+7 more paths]
04:56:50.193 ├ ● /[locale]/citations
04:56:50.193 │ ├ /en/citations
04:56:50.193 │ ├ /es/citations
04:56:50.193 │ ├ /fr/citations
04:56:50.193 │ └ [+7 more paths]
04:56:50.194 ├ ● /[locale]/claims
04:56:50.194 │ ├ /en/claims
04:56:50.194 │ ├ /es/claims
04:56:50.194 │ ├ /fr/claims
04:56:50.194 │ └ [+7 more paths]
04:56:50.194 ├ ● /[locale]/clickbait
04:56:50.194 │ ├ /en/clickbait
04:56:50.194 │ ├ /es/clickbait
04:56:50.194 │ ├ /fr/clickbait
04:56:50.194 │ └ [+7 more paths]
04:56:50.194 ├ ● /[locale]/coin
04:56:50.194 │ ├ /en/coin
04:56:50.194 │ ├ /es/coin
04:56:50.194 │ ├ /fr/coin
04:56:50.194 │ └ [+7 more paths]
04:56:50.194 ├ ● /[locale]/coin/[coinId]
04:56:50.194 ├ ƒ /[locale]/coin/[coinId]/opengraph-image
04:56:50.194 ├ ● /[locale]/compare
04:56:50.194 │ ├ /en/compare
04:56:50.194 │ ├ /es/compare
04:56:50.194 │ ├ /fr/compare
04:56:50.194 │ └ [+7 more paths]
04:56:50.194 ├ ● /[locale]/correlation
04:56:50.194 │ ├ /en/correlation
04:56:50.195 │ ├ /es/correlation
04:56:50.195 │ ├ /fr/correlation
04:56:50.195 │ └ [+7 more paths]
04:56:50.195 ├ ● /[locale]/coverage-gap
04:56:50.195 │ ├ /en/coverage-gap
04:56:50.195 │ ├ /es/coverage-gap
04:56:50.195 │ ├ /fr/coverage-gap
04:56:50.195 │ └ [+7 more paths]
04:56:50.195 ├ ƒ /[locale]/defi                                   1m      1y
04:56:50.195 ├ ● /[locale]/defi                                   1m      1y
04:56:50.195 │ ├ /es/defi                                         1m      1y
04:56:50.195 │ ├ /fr/defi                                         1m      1y
04:56:50.195 │ ├ /de/defi                                         1m      1y
04:56:50.195 │ └ [+6 more paths]
04:56:50.195 ├ ● /[locale]/defi/chain/[slug]
04:56:50.195 ├ ● /[locale]/defi/protocol/[slug]
04:56:50.195 ├ ● /[locale]/developers
04:56:50.195 │ ├ /en/developers
04:56:50.195 │ ├ /es/developers
04:56:50.195 │ ├ /fr/developers
04:56:50.195 │ └ [+7 more paths]
04:56:50.195 ├ ƒ /[locale]/digest
04:56:50.195 ├ ● /[locale]/dominance                              5m      1y
04:56:50.195 │ ├ /en/dominance                                    5m      1y
04:56:50.195 │ ├ /es/dominance                                    5m      1y
04:56:50.195 │ ├ /fr/dominance                                    5m      1y
04:56:50.195 │ └ [+7 more paths]
04:56:50.195 ├ ● /[locale]/entities
04:56:50.195 │ ├ /en/entities
04:56:50.195 │ ├ /es/entities
04:56:50.195 │ ├ /fr/entities
04:56:50.195 │ └ [+7 more paths]
04:56:50.195 ├ ● /[locale]/factcheck
04:56:50.195 │ ├ /en/factcheck
04:56:50.195 │ ├ /es/factcheck
04:56:50.195 │ ├ /fr/factcheck
04:56:50.195 │ └ [+7 more paths]
04:56:50.195 ├ ● /[locale]/fear-greed
04:56:50.195 │ ├ /en/fear-greed
04:56:50.195 │ ├ /es/fear-greed
04:56:50.195 │ ├ /fr/fear-greed
04:56:50.195 │ └ [+7 more paths]
04:56:50.195 ├ ● /[locale]/funding
04:56:50.195 │ ├ /en/funding
04:56:50.195 │ ├ /es/funding
04:56:50.195 │ ├ /fr/funding
04:56:50.195 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/gas
04:56:50.196 │ ├ /en/gas
04:56:50.196 │ ├ /es/gas
04:56:50.196 │ ├ /fr/gas
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/heatmap                                2m      1y
04:56:50.196 │ ├ /en/heatmap                                      2m      1y
04:56:50.196 │ ├ /es/heatmap                                      2m      1y
04:56:50.196 │ ├ /fr/heatmap                                      2m      1y
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/influencers
04:56:50.196 │ ├ /en/influencers
04:56:50.196 │ ├ /es/influencers
04:56:50.196 │ ├ /fr/influencers
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/install
04:56:50.196 │ ├ /en/install
04:56:50.196 │ ├ /es/install
04:56:50.196 │ ├ /fr/install
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/liquidations
04:56:50.196 │ ├ /en/liquidations
04:56:50.196 │ ├ /es/liquidations
04:56:50.196 │ ├ /fr/liquidations
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ƒ /[locale]/markets
04:56:50.196 ├ ● /[locale]/markets/categories
04:56:50.196 │ ├ /en/markets/categories
04:56:50.196 │ ├ /es/markets/categories
04:56:50.196 │ ├ /fr/markets/categories
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/markets/categories/[id]
04:56:50.196 ├ ● /[locale]/markets/exchanges                      5m      1y
04:56:50.196 │ ├ /en/markets/exchanges                            5m      1y
04:56:50.196 │ ├ /es/markets/exchanges                            5m      1y
04:56:50.196 │ ├ /fr/markets/exchanges                            5m      1y
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/markets/exchanges/[id]
04:56:50.196 ├ ● /[locale]/markets/gainers                        1m      1y
04:56:50.196 │ ├ /en/markets/gainers                              1m      1y
04:56:50.196 │ ├ /es/markets/gainers                              1m      1y
04:56:50.196 │ ├ /fr/markets/gainers                              1m      1y
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/markets/losers                         1m      1y
04:56:50.196 │ ├ /en/markets/losers                               1m      1y
04:56:50.196 │ ├ /es/markets/losers                               1m      1y
04:56:50.196 │ ├ /fr/markets/losers                               1m      1y
04:56:50.196 │ └ [+7 more paths]
04:56:50.196 ├ ● /[locale]/markets/new                            1m      1y
04:56:50.196 │ ├ /en/markets/new                                  1m      1y
04:56:50.197 │ ├ /es/markets/new                                  1m      1y
04:56:50.197 │ ├ /fr/markets/new                                  1m      1y
04:56:50.197 │ └ [+7 more paths]
04:56:50.197 ├ ● /[locale]/markets/trending                       1m      1y
04:56:50.197 │ ├ /en/markets/trending                             1m      1y
04:56:50.197 │ ├ /es/markets/trending                             1m      1y
04:56:50.197 │ ├ /fr/markets/trending                             1m      1y
04:56:50.197 │ └ [+7 more paths]
04:56:50.197 ├ ● /[locale]/movers                                 1m      1y
04:56:50.197 │ ├ /en/movers                                       1m      1y
04:56:50.197 │ ├ /es/movers                                       1m      1y
04:56:50.197 │ ├ /fr/movers                                       1m      1y
04:56:50.197 │ └ [+7 more paths]
04:56:50.197 ├ ● /[locale]/narratives
04:56:50.197 │ ├ /en/narratives
04:56:50.197 │ ├ /es/narratives
04:56:50.197 │ ├ /fr/narratives
04:56:50.197 │ └ [+7 more paths]
04:56:50.197 ├ ● /[locale]/offline
04:56:50.197 │ ├ /en/offline
04:56:50.197 │ ├ /es/offline
04:56:50.197 │ ├ /fr/offline
04:56:50.197 │ └ [+7 more paths]
04:56:50.197 ├ ● /[locale]/onchain
04:56:50.197 │ ├ /en/onchain
04:56:50.197 │ ├ /es/onchain
04:56:50.197 │ ├ /fr/onchain
04:56:50.197 │ └ [+7 more paths]
04:56:50.197 ├ ● /[locale]/options
04:56:50.197 │ ├ /en/options
04:56:50.197 │ ├ /es/options
04:56:50.197 │ ├ /fr/options
04:56:50.197 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/oracle
04:56:50.198 │ ├ /en/oracle
04:56:50.198 │ ├ /es/oracle
04:56:50.198 │ ├ /fr/oracle
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/orderbook
04:56:50.198 │ ├ /en/orderbook
04:56:50.198 │ ├ /es/orderbook
04:56:50.198 │ ├ /fr/orderbook
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/origins
04:56:50.198 │ ├ /en/origins
04:56:50.198 │ ├ /es/origins
04:56:50.198 │ ├ /fr/origins
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/portfolio
04:56:50.198 │ ├ /en/portfolio
04:56:50.198 │ ├ /es/portfolio
04:56:50.198 │ ├ /fr/portfolio
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/predictions
04:56:50.198 │ ├ /en/predictions
04:56:50.198 │ ├ /es/predictions
04:56:50.198 │ ├ /fr/predictions
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/pricing
04:56:50.198 │ ├ /en/pricing
04:56:50.198 │ ├ /es/pricing
04:56:50.198 │ ├ /fr/pricing
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/pricing/premium
04:56:50.198 │ ├ /en/pricing/premium
04:56:50.198 │ ├ /es/pricing/premium
04:56:50.198 │ ├ /fr/pricing/premium
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/pricing/upgrade
04:56:50.198 │ ├ /en/pricing/upgrade
04:56:50.198 │ ├ /es/pricing/upgrade
04:56:50.198 │ ├ /fr/pricing/upgrade
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ● /[locale]/protocol-health
04:56:50.198 │ ├ /en/protocol-health
04:56:50.198 │ ├ /es/protocol-health
04:56:50.198 │ ├ /fr/protocol-health
04:56:50.198 │ └ [+7 more paths]
04:56:50.198 ├ ƒ /[locale]/read                                   5m      1y
04:56:50.198 ├ ● /[locale]/read                                   5m      1y
04:56:50.198 │ ├ /es/read                                         5m      1y
04:56:50.198 │ ├ /fr/read                                         5m      1y
04:56:50.198 │ ├ /de/read                                         5m      1y
04:56:50.198 │ └ [+6 more paths]
04:56:50.198 ├ ƒ /[locale]/regulatory
04:56:50.199 ├ ● /[locale]/saved
04:56:50.199 │ ├ /en/saved
04:56:50.199 │ ├ /es/saved
04:56:50.199 │ ├ /fr/saved
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ● /[locale]/screener                               2m      1y
04:56:50.199 │ ├ /en/screener                                     2m      1y
04:56:50.199 │ ├ /es/screener                                     2m      1y
04:56:50.199 │ ├ /fr/screener                                     2m      1y
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ƒ /[locale]/search
04:56:50.199 ├ ƒ /[locale]/sentiment
04:56:50.199 ├ ● /[locale]/settings
04:56:50.199 │ ├ /en/settings
04:56:50.199 │ ├ /es/settings
04:56:50.199 │ ├ /fr/settings
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ƒ /[locale]/share
04:56:50.199 ├ ● /[locale]/signals
04:56:50.199 │ ├ /en/signals
04:56:50.199 │ ├ /es/signals
04:56:50.199 │ ├ /fr/signals
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ● /[locale]/source
04:56:50.199 │ ├ /en/source
04:56:50.199 │ ├ /es/source
04:56:50.199 │ ├ /fr/source
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ● /[locale]/source/[source]
04:56:50.199 ├ ● /[locale]/sources                                5m      1y
04:56:50.199 │ ├ /en/sources                                      5m      1y
04:56:50.199 │ ├ /es/sources                                      5m      1y
04:56:50.199 │ ├ /fr/sources                                      5m      1y
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ƒ /[locale]/status
04:56:50.199 ├ ● /[locale]/tags
04:56:50.199 │ ├ /en/tags
04:56:50.199 │ ├ /es/tags
04:56:50.199 │ ├ /fr/tags
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ● /[locale]/tags/[slug]
04:56:50.199 ├ ● /[locale]/topic
04:56:50.199 │ ├ /en/topic
04:56:50.199 │ ├ /es/topic
04:56:50.199 │ ├ /fr/topic
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ● /[locale]/topic/[topic]
04:56:50.199 ├ ƒ /[locale]/topic/[topic]/opengraph-image
04:56:50.199 ├ ● /[locale]/topics
04:56:50.199 │ ├ /en/topics
04:56:50.199 │ ├ /es/topics
04:56:50.199 │ ├ /fr/topics
04:56:50.199 │ └ [+7 more paths]
04:56:50.199 ├ ƒ /[locale]/trending
04:56:50.199 ├ ● /[locale]/watchlist
04:56:50.199 │ ├ /en/watchlist
04:56:50.200 │ ├ /es/watchlist
04:56:50.200 │ ├ /fr/watchlist
04:56:50.200 │ └ [+7 more paths]
04:56:50.200 ├ ● /[locale]/whales
04:56:50.200 │ ├ /en/whales
04:56:50.200 │ ├ /es/whales
04:56:50.200 │ ├ /fr/whales
04:56:50.200 │ └ [+7 more paths]
04:56:50.200 ├ ○ /admin/blog
04:56:50.200 ├ ƒ /api/.well-known/x402
04:56:50.200 ├ ƒ /api/academic
04:56:50.200 ├ ƒ /api/admin
04:56:50.200 ├ ƒ /api/admin/analytics
04:56:50.200 ├ ƒ /api/admin/keys
04:56:50.200 ├ ƒ /api/admin/licenses
04:56:50.200 ├ ƒ /api/admin/metrics
04:56:50.200 ├ ƒ /api/admin/stats
04:56:50.200 ├ ƒ /api/ai
04:56:50.200 ├ ƒ /api/ai-anchor
04:56:50.200 ├ ƒ /api/ai/agent
04:56:50.200 ├ ƒ /api/ai/blog-generator
04:56:50.200 ├ ƒ /api/ai/brief
04:56:50.200 ├ ƒ /api/ai/correlation
04:56:50.200 ├ ƒ /api/ai/counter
04:56:50.200 ├ ƒ /api/ai/cross-lingual
04:56:50.200 ├ ƒ /api/ai/debate
04:56:50.200 ├ ƒ /api/ai/digest
04:56:50.200 ├ ƒ /api/ai/entities
04:56:50.200 ├ ƒ /api/ai/explain
04:56:50.200 ├ ƒ /api/ai/flash-briefing
04:56:50.200 ├ ƒ /api/ai/narratives
04:56:50.200 ├ ƒ /api/ai/oracle
04:56:50.200 ├ ƒ /api/ai/portfolio-news
04:56:50.200 ├ ƒ /api/ai/relationships
04:56:50.200 ├ ƒ /api/ai/research
04:56:50.200 ├ ƒ /api/ai/social
04:56:50.200 ├ ƒ /api/ai/source-quality
04:56:50.200 ├ ƒ /api/ai/summarize
04:56:50.200 ├ ƒ /api/ai/summarize/stream
04:56:50.200 ├ ƒ /api/ai/synthesize
04:56:50.201 ├ ƒ /api/alerts
04:56:50.201 ├ ƒ /api/alerts/[id]
04:56:50.201 ├ ƒ /api/alexa
04:56:50.201 ├ ƒ /api/analytics/anomalies
04:56:50.201 ├ ƒ /api/analytics/causality
04:56:50.201 ├ ƒ /api/analytics/credibility
04:56:50.201 ├ ƒ /api/analytics/forensics
04:56:50.201 ├ ƒ /api/analytics/gaps
04:56:50.201 ├ ƒ /api/analytics/headlines
04:56:50.201 ├ ƒ /api/analytics/influencers
04:56:50.201 ├ ƒ /api/analytics/news-onchain
04:56:50.201 ├ ƒ /api/analytics/usage
04:56:50.201 ├ ƒ /api/analyze
04:56:50.201 ├ ƒ /api/arbitrage
04:56:50.201 ├ ƒ /api/article
04:56:50.201 ├ ƒ /api/articles
04:56:50.201 ├ ƒ /api/ask
04:56:50.201 ├ ƒ /api/atom
04:56:50.201 ├ ƒ /api/backtest
04:56:50.201 ├ ƒ /api/billing
04:56:50.201 ├ ƒ /api/billing/usage
04:56:50.201 ├ ƒ /api/bitcoin
04:56:50.201 ├ ƒ /api/blog/posts
04:56:50.201 ├ ƒ /api/breaking
04:56:50.201 ├ ƒ /api/cache
04:56:50.201 ├ ƒ /api/charts
04:56:50.201 ├ ƒ /api/citations
04:56:50.201 ├ ƒ /api/claims
04:56:50.201 ├ ƒ /api/classify
04:56:50.201 ├ ƒ /api/clickbait
04:56:50.201 ├ ƒ /api/compare
04:56:50.201 ├ ƒ /api/coverage-gap
04:56:50.201 ├ ƒ /api/cron/archive-kv
04:56:50.201 ├ ƒ /api/cron/coverage-gap
04:56:50.201 ├ ƒ /api/cron/digest
04:56:50.201 ├ ƒ /api/cron/enrich-articles
04:56:50.201 ├ ƒ /api/cron/expire-subscriptions
04:56:50.201 ├ ƒ /api/cron/predictions
04:56:50.201 ├ ƒ /api/cron/tag-scores
04:56:50.201 ├ ƒ /api/cron/x-sentiment
04:56:50.201 ├ ƒ /api/defi
04:56:50.201 ├ ƒ /api/defi/protocol-health
04:56:50.201 ├ ƒ /api/derivatives
04:56:50.201 ├ ƒ /api/detect/ai-content
04:56:50.201 ├ ƒ /api/digest
04:56:50.201 ├ ƒ /api/entities
04:56:50.201 ├ ○ /api/exchange-rates                              5m      1y
04:56:50.201 ├ ƒ /api/export
04:56:50.201 ├ ƒ /api/export/jobs
04:56:50.201 ├ ƒ /api/export/jobs/[jobId]
04:56:50.201 ├ ƒ /api/exports
04:56:50.201 ├ ƒ /api/exports/[id]
04:56:50.201 ├ ƒ /api/extract
04:56:50.201 ├ ƒ /api/factcheck
04:56:50.201 ├ ƒ /api/fear-greed
04:56:50.201 ├ ƒ /api/flows
04:56:50.201 ├ ƒ /api/frames
04:56:50.201 ├ ƒ /api/frames/image
04:56:50.201 ├ ƒ /api/funding
04:56:50.201 ├ ƒ /api/gas
04:56:50.201 ├ ƒ /api/gateway
04:56:50.201 ├ ○ /api/global                                      2m      1y
04:56:50.201 ├ ƒ /api/graphql
04:56:50.201 ├ ƒ /api/health
04:56:50.201 ├ ƒ /api/i18n/translate
04:56:50.201 ├ ƒ /api/influencers
04:56:50.201 ├ ƒ /api/integrations/tradingview
04:56:50.202 ├ ƒ /api/keys
04:56:50.202 ├ ƒ /api/liquidations
04:56:50.202 ├ ƒ /api/llms-full.txt
04:56:50.202 ├ ƒ /api/llms.txt
04:56:50.202 ├ ƒ /api/market/categories
04:56:50.202 ├ ƒ /api/market/categories/[id]
04:56:50.202 ├ ƒ /api/market/coins
04:56:50.202 ├ ƒ /api/market/compare
04:56:50.202 ├ ƒ /api/market/defi
04:56:50.202 ├ ƒ /api/market/derivatives
04:56:50.202 ├ ƒ /api/market/exchanges
04:56:50.202 ├ ƒ /api/market/exchanges/[id]
04:56:50.202 ├ ƒ /api/market/history/[coinId]
04:56:50.202 ├ ƒ /api/market/ohlc/[coinId]
04:56:50.202 ├ ƒ /api/market/orderbook
04:56:50.202 ├ ƒ /api/market/search
04:56:50.202 ├ ƒ /api/market/snapshot/[coinId]
04:56:50.202 ├ ƒ /api/market/social/[coinId]
04:56:50.202 ├ ƒ /api/market/tickers/[coinId]
04:56:50.202 ├ ƒ /api/metrics
04:56:50.202 ├ ƒ /api/narratives
04:56:50.202 ├ ƒ /api/news
04:56:50.202 ├ ƒ /api/news/categories
04:56:50.202 ├ ƒ /api/news/extract
04:56:50.202 ├ ƒ /api/news/international
04:56:50.202 ├ ƒ /api/newsletter
04:56:50.202 ├ ƒ /api/newsletter/subscribe
04:56:50.202 ├ ƒ /api/nostr
04:56:50.202 ├ ƒ /api/og
04:56:50.202 ├ ƒ /api/og/coin
04:56:50.202 ├ ƒ /api/og/market
04:56:50.202 ├ ƒ /api/ohlc
04:56:50.202 ├ ƒ /api/onchain/correlate
04:56:50.202 ├ ƒ /api/onchain/events
04:56:50.202 ├ ƒ /api/openapi.json
04:56:50.203 ├ ƒ /api/opml
04:56:50.203 ├ ƒ /api/options
04:56:50.203 ├ ƒ /api/oracle
04:56:50.203 ├ ƒ /api/oracle/chainlink
04:56:50.203 ├ ƒ /api/orderbook
04:56:50.203 ├ ƒ /api/orderbook/stream
04:56:50.203 ├ ƒ /api/origins
04:56:50.203 ├ ƒ /api/portfolio
04:56:50.203 ├ ƒ /api/portfolio/holding
04:56:50.203 ├ ƒ /api/portfolio/performance
04:56:50.203 ├ ƒ /api/portfolio/tax
04:56:50.203 ├ ƒ /api/portfolio/tax-report
04:56:50.203 ├ ƒ /api/predictions
04:56:50.203 ├ ○ /api/predictions/history                         1h      1y
04:56:50.203 ├ ƒ /api/predictions/markets
04:56:50.203 ├ ƒ /api/premium
04:56:50.203 ├ ƒ /api/premium/ai/analyze
04:56:50.203 ├ ƒ /api/premium/ai/compare
04:56:50.203 ├ ƒ /api/premium/ai/sentiment
04:56:50.203 ├ ƒ /api/premium/ai/signals
04:56:50.203 ├ ƒ /api/premium/ai/summary
04:56:50.203 ├ ƒ /api/premium/alerts/custom
04:56:50.203 ├ ƒ /api/premium/alerts/whales
04:56:50.203 ├ ƒ /api/premium/analytics/screener
04:56:50.203 ├ ƒ /api/premium/api-keys
04:56:50.203 ├ ƒ /api/premium/defi/protocols
04:56:50.203 ├ ƒ /api/premium/export/portfolio
04:56:50.203 ├ ƒ /api/premium/market/coins
04:56:50.203 ├ ƒ /api/premium/market/history
04:56:50.203 ├ ƒ /api/premium/portfolio/analytics
04:56:50.203 ├ ƒ /api/premium/screener/advanced
04:56:50.203 ├ ƒ /api/premium/smart-money
04:56:50.203 ├ ƒ /api/premium/streams/prices
04:56:50.203 ├ ƒ /api/premium/whales/alerts
04:56:50.203 ├ ƒ /api/premium/whales/transactions
04:56:50.203 ├ ƒ /api/prices
04:56:50.203 ├ ƒ /api/push
04:56:50.203 ├ ƒ /api/rag
04:56:50.203 ├ ƒ /api/rag/ask
04:56:50.203 ├ ƒ /api/rag/batch
04:56:50.203 ├ ƒ /api/rag/eval
04:56:50.203 ├ ƒ /api/rag/feedback
04:56:50.204 ├ ƒ /api/rag/metrics
04:56:50.204 ├ ƒ /api/rag/personalization
04:56:50.204 ├ ƒ /api/rag/search
04:56:50.204 ├ ƒ /api/rag/similar/[id]
04:56:50.204 ├ ƒ /api/rag/stats
04:56:50.204 ├ ƒ /api/rag/stream
04:56:50.204 ├ ƒ /api/rag/summary/[crypto]
04:56:50.204 ├ ƒ /api/rag/timeline
04:56:50.204 ├ ƒ /api/register
04:56:50.204 ├ ƒ /api/regulatory
04:56:50.204 ├ ƒ /api/relationships
04:56:50.204 ├ ƒ /api/research/backtest
04:56:50.204 ├ ƒ /api/rss
04:56:50.204 ├ ƒ /api/search
04:56:50.204 ├ ƒ /api/search/semantic
04:56:50.204 ├ ƒ /api/sentiment
04:56:50.204 ├ ƒ /api/signals
04:56:50.204 ├ ƒ /api/signals/narrative
04:56:50.204 ├ ƒ /api/social
04:56:50.204 ├ ƒ /api/social/discord
04:56:50.204 ├ ƒ /api/social/influencer-score
04:56:50.204 ├ ƒ /api/social/monitor
04:56:50.204 ├ ƒ /api/social/trending-narratives
04:56:50.204 ├ ƒ /api/social/x/lists
04:56:50.204 ├ ƒ /api/social/x/sentiment
04:56:50.204 ├ ƒ /api/sources
04:56:50.204 ├ ƒ /api/sse
04:56:50.204 ├ ƒ /api/stats
04:56:50.204 ├ ƒ /api/storage/cas
04:56:50.204 ├ ƒ /api/summarize
04:56:50.204 ├ ƒ /api/tags
04:56:50.204 ├ ƒ /api/tags/[slug]
04:56:50.204 ├ ƒ /api/trading/arbitrage
04:56:50.204 ├ ƒ /api/trading/options
04:56:50.205 ├ ƒ /api/trading/orderbook
04:56:50.205 ├ ƒ /api/tradingview
04:56:50.205 ├ ƒ /api/translate
04:56:50.205 ├ ƒ /api/trending
04:56:50.205 ├ ƒ /api/unlocks
04:56:50.205 ├ ƒ /api/upgrade
04:56:50.205 ├ ○ /api/v1                                          1h      1y
04:56:50.205 ├ ƒ /api/v1/alerts
04:56:50.205 ├ ƒ /api/v1/assets
04:56:50.205 ├ ƒ /api/v1/assets/[assetId]/history
04:56:50.205 ├ ƒ /api/v1/coin/[coinId]
04:56:50.205 ├ ƒ /api/v1/coins
04:56:50.205 ├ ƒ /api/v1/defi
04:56:50.205 ├ ƒ /api/v1/exchanges
04:56:50.205 ├ ƒ /api/v1/export
04:56:50.205 ├ ƒ /api/v1/gas
04:56:50.205 ├ ƒ /api/v1/global
04:56:50.205 ├ ƒ /api/v1/historical/[coinId]
04:56:50.205 ├ ƒ /api/v1/market-data
04:56:50.205 ├ ƒ /api/v1/search
04:56:50.205 ├ ƒ /api/v1/trending
04:56:50.205 ├ ƒ /api/v1/usage
04:56:50.206 ├ ƒ /api/v1/x402
04:56:50.206 ├ ƒ /api/views
04:56:50.206 ├ ƒ /api/watchlist
04:56:50.206 ├ ƒ /api/webhooks
04:56:50.206 ├ ƒ /api/webhooks/queue
04:56:50.206 ├ ƒ /api/webhooks/test
04:56:50.206 ├ ƒ /api/whale-alerts
04:56:50.206 ├ ƒ /api/whale-alerts/context
04:56:50.206 ├ ƒ /api/whales
04:56:50.206 ├ ƒ /api/ws
04:56:50.206 ├ ƒ /api/yields
04:56:50.206 ├ ○ /ask
04:56:50.206 ├ ○ /blog
04:56:50.206 ├ ○ /blog/feed.xml                                   1h      1y
04:56:50.206 ├ ƒ /feed.xml
04:56:50.206 ├ ƒ /google[token].html
04:56:50.206 ├ ƒ /news-sitemap.xml
04:56:50.206 ├ ○ /robots.txt
04:56:50.206 └ ○ /sitemap.xml
04:56:50.206 
04:56:50.206 
04:56:50.206 ƒ Proxy (Middleware)
04:56:50.209 
04:56:50.209 ○  (Static)   prerendered as static content
04:56:50.209 ●  (SSG)      prerendered as static HTML (uses generateStaticParams)
04:56:50.209 ƒ  (Dynamic)  server-rendered on demand
04:56:50.209 
04:56:51.731 Traced Next.js server files in: 27.852ms
04:56:52.483 WARNING: Unable to find source file for page /[locale]/article/[id]/opengraph-image/route with extensions: tsx, ts, jsx, js, this can cause functions config from `vercel.json` to not be applied
04:56:52.483 WARNING: Unable to find source file for page /[locale]/coin/[coinId]/opengraph-image/route with extensions: tsx, ts, jsx, js, this can cause functions config from `vercel.json` to not be applied
04:56:52.484 WARNING: Unable to find source file for page /[locale]/topic/[topic]/opengraph-image/route with extensions: tsx, ts, jsx, js, this can cause functions config from `vercel.json` to not be applied
04:56:52.533 Created all serverless functions in: 801.77ms
04:56:58.219 Collected static files (public/, static/, .next/static): 10.143ms
04:57:00.812 Build Completed in /vercel/output [2m]
04:57:02.426 Deploying outputs...
04:57:53.910 Error: A duplicated cron job with the same schedule (0 8 * * *) and path (/api/cron/digest) was found. Please remove the duplicated entry.