# How to Add More D1 Databases

To add more D1 databases to the MCP worker, you need to add them to `wrangler.toml`.

## Format

Add each database using this format:

```toml
[[d1_databases]]
binding = "YOUR_BINDING_NAME"
database_name = "your-database-name"
database_id = "your-database-uuid"
```

## Required Information

For each database, you need:

1. **Binding Name**: A unique identifier (e.g., `DB`, `SAAS_DB`, `MY_DB`)
   - Use uppercase with underscores
   - This is how you'll reference it in code

2. **Database Name**: The actual name of your D1 database
   - Found in Cloudflare Dashboard ? D1 ? Your Database

3. **Database ID**: The UUID of your D1 database
   - Found in Cloudflare Dashboard ? D1 ? Your Database ? Settings
   - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## How to Find Your Database Info

### Option 1: Cloudflare Dashboard
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Navigate to **Workers & Pages** ? **D1**
4. Click on your database
5. Go to **Settings** tab
6. You'll see:
   - **Database Name**: At the top
   - **Database ID**: In the settings (UUID format)

### Option 2: Using Wrangler CLI
```bash
wrangler d1 list
```

This will show all your D1 databases with their names and IDs.

### Option 3: From Another wrangler.toml
If you have another worker that uses the database, check its `wrangler.toml` file for the configuration.

## Example

Here's how to add a database called "my-app-db":

```toml
[[d1_databases]]
binding = "MY_APP_DB"
database_name = "my-app-db"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

## Current Databases

The worker currently has these databases configured:

1. **DB** (`meaux-work-db`)
   - ID: `2a3a763a-92f1-4633-849e-268ddb31998f`

2. **meauxxbility** (`meauxbility-api-db`)
   - ID: `49b16b7d-ecb9-4cc4-b337-559f94854757`

3. **SAAS_DB** (`meauxstack-saas-db`)
   - ID: `ee3e3adb-da99-457d-8c2c-390ff19f6435`

4. **INNERANIMAL_DB** (`inneranimalmedia-assets`)
   - ID: `e0ec00b8-4e3c-422e-abba-70b7548c1f87`

## After Adding

1. Save `wrangler.toml`
2. Deploy the worker: `wrangler deploy`
3. The new database will automatically appear in:
   - The dashboard (D1 Databases view)
   - MCP tools (`list_d1_databases`)
   - Available for queries

## Quick Add Template

To add a new database, just provide:
- Binding name (how you want to reference it)
- Database name (from Cloudflare)
- Database ID (UUID from Cloudflare)

Example format to share:
```
Binding: MY_NEW_DB
Name: my-new-database
ID: 12345678-1234-1234-1234-123456789abc
```

I'll add it to `wrangler.toml` and deploy it for you!
