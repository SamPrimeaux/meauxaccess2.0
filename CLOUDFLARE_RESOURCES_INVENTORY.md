# ?? Complete Cloudflare Resources Inventory

**Account ID:** `ede6590ac0d2fb7daf155b35653457b2`  
**Generated:** December 6, 2024

---

## ??? D1 Databases (15+ databases)

### Production Databases

1. **meaux-work-db**
   - ID: `2a3a763a-92f1-4633-849e-268ddb31998f`
   - Used by: damnsam, inneranimalappcenter, meauxbility-org-clean, decentdashboardversion, saas-dashboard, websocket/meauxwork, meauxbility-org-pages, meauxbilityonly, madelinemydawg-docs
   - Binding: `DB`

2. **meauxbility-api-db**
   - ID: `49b16b7d-ecb9-4cc4-b337-559f94854757`
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
   - Binding: `meauxxbility`

3. **meauxstack-saas-db**
   - ID: `ee3e3adb-da99-457d-8c2c-390ff19f6435`
   - Used by: damnsam, inneranimalappcenter, meauxbility-org-clean, decentdashboardversion, saas-dashboard, meauxstack-components
   - Binding: `SAAS_DB`

4. **fred-instantaccess-db**
   - ID: `f927faff-2929-4521-ab1e-3ef34be4c117`
   - Used by: fred-instantaccess
   - Binding: `DB`

5. **connor-iautodidact-db**
   - ID: `aed43e4a-4c02-46c9-8087-b42567326f32`
   - Used by: connor-iautodidact
   - Binding: `DB`

6. **meauxphoto-db**
   - ID: `f1968266-1017-43f8-8572-caf2b0d63c4c`
   - Used by: meauxphoto
   - Binding: `DB`

7. **meauxwork-db**
   - ID: `7a8dbae8-9c9c-4872-8824-9dc6fbc62fb2`
   - Used by: websocket/meauxwork
   - Binding: `DB`

8. **southernpetsanimalrescue**
   - Used by: southernpets-worker
   - Binding: `DB`

9. **evergreen-landscaping-db**
   - Used by: evergreen-landscaping
   - Binding: `DB`

10. **inneranimalmedia-assets**
    - Used by: inneranimalmedia-dashboard, BUILD_INNERANIMALMEDIA_OPTIMIZED
    - Binding: `DB`

11. **meauxbilityorg**
    - Used by: meauxbility-nextjs
    - Binding: `DB`

12. **automeaux-db**
    - Used by: apps/m-web
    - Binding: `DB`

---

## ?? R2 Buckets (50+ buckets)

### Primary/Production Buckets

1. **meauxbilityorgfinal**
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
   - Binding: `R2_WEBSITE`
   - Purpose: Primary website bucket - stores HTML pages, React app, static assets

2. **meauxstack-components**
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion, meauxstack-components
   - Binding: `R2_COMPONENTS`
   - Purpose: Shared components bucket

3. **meauxbility-recordings**
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
   - Binding: `R2_RECORDINGS`
   - Purpose: Audio/video recordings storage

4. **meauxbility-3d-models**
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
   - Binding: `R2_3D_MODELS`
   - Purpose: 3D models and CAD files

5. **splineicons**
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
   - Binding: `R2_SPLINEICONS`
   - Purpose: Spline icon assets

6. **meauxbility-docs**
   - Used by: damnsam, inneranimalappcenter, meauxbility-org-clean, decentdashboardversion, cloudflare-mcp-worker, r2-dashboard-worker
   - Binding: `R2_DOCS`
   - Purpose: Documentation storage

7. **samicloudbackups**
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
   - Binding: `R2_SAMI_BACKUPS`
   - Purpose: Backup storage

8. **meaux-deploy-vault**
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
   - Binding: `R2_DEPLOY_VAULT`
   - Purpose: Deployment artifacts

9. **autorag-meauxbility-chatbot**
   - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
   - Binding: `R2_AUTORAG`
   - Purpose: AutoRAG chatbot data

10. **meaux-work-storage**
    - Used by: damnsam, meauxbility-org-clean, decentdashboardversion
    - Binding: `STORAGE`
    - Purpose: General storage for AI/Workers

### Client/Personal Buckets

11. **connor-mcneely**
    - Used by: damnsam, connor-mcneely-worker, decentdashboardversion, asset-management-system
    - Binding: `R2_CONNOR`
    - Purpose: Connor's personal storage

12. **fred-williams**
    - Used by: damnsam, decentdashboardversion, inneranimalmedia-dashboard, asset-management-system
    - Binding: `R2_FRED`
    - Purpose: Fred's personal storage

13. **amber-nicole**
    - Used by: damnsam, decentdashboardversion
    - Binding: `R2_AMBER`
    - Purpose: Amber's personal storage

14. **inneranimalmedia-assets**
    - Used by: inneranimalappcenter, inneranimalv2-worker, cloudflare-mcp-worker, asset-management-system
    - Binding: `R2_ASSETS`
    - Purpose: Inner Animal Media assets

### Project-Specific Buckets

15. **fred-instantaccess-content**
    - Used by: fred-instantaccess
    - Binding: `R2_CONTENT`
    - Public URL: `https://pub-0adb58416fdb442bb772e0602edce64f.r2.dev`

16. **connor-iautodidact-ebooks**
    - Used by: connor-iautodidact
    - Binding: `R2_EBOOKS`
    - Purpose: Ebooks and learning materials

17. **meauxphoto-content**
    - Used by: meauxphoto
    - Binding: `R2_CONTENT`
    - Purpose: Photo content storage

18. **grantwriting**
    - Used by: grantwriting-worker
    - Binding: `R2_GRANTWRITING`
    - Purpose: Grant writing documents

19. **meauxwork-assets**
    - Used by: websocket/meauxwork
    - Binding: `ASSETS`
    - Purpose: MeauxWork assets

20. **southernpetsanimalrescue**
    - Used by: southernpets-worker
    - Binding: `R2_STORAGE`

21. **evergreen-landscaping**
    - Used by: evergreen-landscaping
    - Binding: `R2_STORAGE`

### Additional Buckets

22. **meauxbility-dashboard**
    - Used by: r2-dashboard-worker
    - Binding: `R2_STORAGE`

23. **meauxstack-assets**
    - Used by: madelinemydawg-docs
    - Binding: `R2_ASSETS`

24. **megamonorepo**
    - Used by: madelinemydawg-docs, meauxbility-org-pages, meauxbility-dev-spa, apps/m-web
    - Binding: `R2_STORAGE` / `R2_BUCKET`

25. **meaux-builds-backups**
    - Used by: meauxstack-components, madelinemydawg-docs, meauxbility-org-pages, apps/m-web
    - Binding: `R2_BACKUPS`

26. **meauxbility-secrets**
    - Used by: meauxbility-org-pages
    - Binding: `R2_SECRETS`

27. **meauxaccess-bucket**
    - Used by: meauxbility-dev-spa
    - Binding: `R2_ACCESS`

28. **entirebrandedhtmlwebapps**
    - Used by: meauxbility-dev-spa
    - Binding: `R2_WEBAPPS`

29. **inneranimal**
    - Used by: asset-management-system
    - Binding: `R2_INNERANIMAL`

30. **inneranimalmedia**
    - Used by: asset-management-system, BUILD_INNERANIMALMEDIA_OPTIMIZED
    - Binding: `R2_IAM`

31. **iautodidact**
    - Used by: asset-management-system
    - Binding: `R2_IAUTODIDACT`

32. **meauxbility**
    - Used by: asset-management-system, meauxbility-nextjs
    - Binding: `R2_MEAUXBILITY`

33. **sam-primeaux**
    - Used by: asset-management-system
    - Binding: `R2_SAM`

34. **southern-pets**
    - Used by: asset-management-system
    - Binding: `R2_SOUTHERNPETS`

35. **leadership-legacy**
    - Used by: asset-management-system
    - Binding: `R2_LEADERSHIP`

---

## ?? Cloudflare Workers (40+ workers)

### Production Workers

1. **damnsam** (Main Production)
   - URL: `meauxbility.org`, `www.meauxbility.org`
   - Databases: meaux-work-db, meauxbility-api-db, meauxstack-saas-db
   - Buckets: 12+ buckets
   - Features: Durable Objects, Analytics, Workers AI, Cron triggers

2. **meauxmcp** (MCP Server)
   - URL: `meauxmcp.meauxbility.workers.dev`
   - Purpose: Model Context Protocol server
   - Databases: meaux-work-db, meauxstack-saas-db
   - Buckets: inneranimalmedia-assets, meauxbility-docs

3. **inneranimalappcenter**
   - URL: `app.inneranimalmedia.com`
   - Databases: meaux-work-db, meauxstack-saas-db
   - Buckets: inneranimalmedia-assets, meauxbility-docs

4. **inneranimalv2**
   - URL: `www.inneranimalmedia.com`
   - Databases: meaux-work-db
   - Buckets: inneranimalmedia-assets

5. **meauxbility-org-clean**
   - Databases: meaux-work-db, meauxbility-api-db, meauxstack-saas-db
   - Buckets: 12+ buckets
   - Features: Durable Objects

6. **decentdashboardversion**
   - Databases: meaux-work-db, meauxbility-api-db, meauxstack-saas-db
   - Buckets: 12+ buckets

### Client/Personal Workers

7. **fred-instantaccess**
   - URL: `fred-instantaccess.meauxbility.workers.dev`
   - Database: fred-instantaccess-db
   - Bucket: fred-instantaccess-content

8. **connor-iautodidact**
   - URL: `connor-iautodidact.meauxbility.workers.dev`
   - Database: connor-iautodidact-db
   - Bucket: connor-iautodidact-ebooks

9. **connor-mcneely**
   - Bucket: connor-mcneely

10. **meauxphoto**
    - URL: `meauxphoto.meauxbility.workers.dev`
    - Database: meauxphoto-db
    - Bucket: meauxphoto-content

11. **grantwriting**
    - Bucket: grantwriting

12. **meauxwork**
    - URL: `meauxwork.inneranimals.com`
    - Database: meauxwork-db
    - Bucket: meauxwork-assets
    - Features: Durable Objects, Analytics, Queues

### Project Workers

13. **southernpetsanimalrescue**
    - URL: `southernpetsanimalrescue.com`
    - Database: southernpetsanimalrescue
    - Bucket: southernpetsanimalrescue

14. **evergreen-landscaping**
    - Database: evergreen-landscaping-db
    - Bucket: evergreen-landscaping

15. **saas-dashboard**
    - Databases: meauxstack-saas-db, meaux-work-db

16. **meauxbility-app-library**
    - Preview: meauxbility-app-library-preview

17. **r2-dashboard**
    - Bucket: meauxbility-dashboard

18. **madelinemydawg-docs**
    - Database: meaux-work-db
    - Buckets: meauxstack-assets, megamonorepo, meaux-builds-backups

19. **meauxbility-org-pages**
    - Database: meaux-work-db
    - Buckets: megamonorepo, meauxbility-secrets, meaux-builds-backups

20. **meauxbility-dev-spa**
    - Database: meaux-work-db
    - Buckets: megamonorepo, meauxaccess-bucket, entirebrandedhtmlwebapps

21. **meauxstack-components**
    - Databases: meaux-work-db, meauxstack-saas-db
    - Buckets: meauxstack-components, meaux-builds-backups

22. **asset-management-system**
    - Buckets: 10+ buckets (inneranimal, inneranimalmedia, iautodidact, meauxbility, sam-primeaux, southern-pets, leadership-legacy, fred-williams, connor-mcneely)

### Additional Workers

23. **webhooks**
24. **edge-api**
25. **content-automation**
26. **meaux-ai-worker**
27. **inneranimalmedia-app** (Pages)
28. **meauxaccess** (Pages)
29. **meauxbilityfinalversion** (Next.js)
30. **meaux-portfolio-hub**
31. **meauxphotos-optimizer**
32. **meaux-work** (multiple instances)
33. **inneranimalmedia** (multiple instances)

---

## ?? Summary Statistics

- **D1 Databases:** 12+ unique databases
- **R2 Buckets:** 35+ unique buckets
- **Workers:** 40+ workers
- **KV Namespaces:** 10+ namespaces
- **Durable Objects:** RealtimeServer, CommunicationsHub
- **Analytics:** meauxbility-analytics dataset
- **Workers AI:** Enabled on multiple workers

---

## ?? Key URLs

- **Main Production:** `https://www.meauxbility.org`
- **Inner Animal Media:** `https://www.inneranimalmedia.com`
- **App Center:** `https://app.inneranimalmedia.com`
- **MCP Server:** `https://meauxmcp.meauxbility.workers.dev`
- **R2 Endpoint:** `https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com`

---

## ?? Notes

- Some buckets are shared across multiple workers
- Database `meaux-work-db` is the most commonly used
- `damnsam` worker has the most comprehensive resource bindings
- Many workers are in development/preview stages
- Some configurations use environment variables for dynamic resource names
