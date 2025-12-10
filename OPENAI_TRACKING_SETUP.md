# ? OpenAI Usage Tracking System

## ?? Overview

Complete tracking system for OpenAI API usage with:
- ? Automatic logging of all API calls
- ? User identification and tracking
- ? Token usage tracking (prompt, completion, total)
- ? Cost calculation based on model pricing
- ? Weekly email summaries
- ? Budget monitoring (20% of $0.20 = $0.04/week)

## ?? What's Tracked

For every OpenAI API call, we log:
- **User:** Email or identifier
- **Model:** Which model was used (gpt-4o, gpt-4-turbo, etc.)
- **Tokens:** Prompt, completion, and total tokens
- **Cost:** Calculated based on OpenAI pricing
- **Output Length:** Character count of response
- **Timestamp:** When the request was made
- **Prompt Preview:** First 200 characters

## ?? Storage

All usage data is stored in **KV_NOTIFICATIONS** namespace:
- Individual records: `openai:usage:{id}`
- Daily index: `openai:daily:{YYYY-MM-DD}`
- User index: `openai:user:{email}:{YYYY-MM-DD}`
- Retention: 90 days

## ?? Weekly Email Summary

**Automatic:** Every Monday at 9:00 AM UTC
**Recipient:** sam@meauxbility.org
**Includes:**
- Total requests, tokens, and cost
- Breakdown by model
- Breakdown by user
- Budget percentage

## ?? API Endpoints

### Get Weekly Summary
```bash
GET /api/openai/summary
```
Returns JSON with usage statistics for the last 7 days.

### Manually Send Summary
```bash
POST /api/openai/send-summary
Content-Type: application/json

{
  "recipient": "sam@meauxbility.org"  // optional, defaults to sam@meauxbility.org
}
```

## ?? Cost Calculation

Based on OpenAI pricing (per 1M tokens):

| Model | Input | Output |
|-------|-------|--------|
| gpt-4o | $2.50 | $10.00 |
| gpt-4-turbo | $10.00 | $30.00 |
| gpt-4 | $30.00 | $60.00 |
| gpt-3.5-turbo | $0.50 | $1.50 |

Formula: `(prompt_tokens / 1M * input_price) + (completion_tokens / 1M * output_price)`

## ?? Scheduled Trigger

Configured in `wrangler.toml`:
```toml
[triggers]
crons = ["0 9 * * 1"]  # Every Monday at 9:00 AM UTC
```

## ?? User Identification

Users are identified from:
1. `X-User-Email` header (if set)
2. `user` field in request body
3. Default: `anonymous@meauxbility.org`

**To track specific users**, update the dashboard to send user email in requests.

## ?? Example Weekly Summary

The email includes:
- **Overall Statistics:** Total requests, tokens, cost
- **By Model:** Breakdown showing which models were used most
- **By User:** Who used the system and how much
- **Budget Alert:** Percentage of weekly budget used

## ? Status

- ? Tracking system implemented
- ? Automatic logging on all ChatGPT calls
- ? Weekly cron job configured
- ? Email summary system ready
- ? Cost calculation accurate
- ? 90-day data retention

## ?? Testing

**Test manual summary:**
```bash
curl -X POST https://meauxxx.com/api/openai/send-summary \
  -H "Content-Type: application/json" \
  -d '{"recipient": "sam@meauxbility.org"}'
```

**View current summary:**
```bash
curl https://meauxxx.com/api/openai/summary
```

## ?? Next Steps

1. **First summary will be sent:** Next Monday at 9 AM UTC
2. **Track usage:** All ChatGPT calls are now automatically logged
3. **Monitor budget:** Weekly emails show budget percentage

**System is live and tracking all OpenAI usage!** ??
