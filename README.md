# Subscription Tracker

Personal dashboard to track all your subscriptions, costs, and renewal dates. Built with React + TypeScript + Notion API.

## 🚀 Features

- **Cost Summary**: Monthly and yearly spending totals
- **Renewal Alerts**: See upcoming renewals (30-day window)
- **Action Items**: Flag subscriptions that need attention (cancel, review)
- **Category Breakdown**: Organize by type (Dev Tools, Hosting, etc.)
- **Notion Integration**: Data stored in Notion - update anywhere

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite
- Notion API
- Tailwind CSS
- Lucide Icons

## 📊 Notion Database Setup

1. Create a new database in Notion (Table view)
2. Name it "Subscriptions" or similar
3. Add these columns:

| Column | Type | Example |
|--------|------|---------|
| Name | Title | "Lovable" |
| Cost | Number | 40 |
| Currency | Select | USD |
| Billing Cycle | Select | Monthly / Yearly |
| Next Renewal | Date | 2026-03-08 |
| Category | Select | Dev Tools / Hosting / Design |
| Status | Select | Active / Cancelled / Trial |
| Action Needed | Checkbox | ☑️ |
| Notes | Text | "Cancel before March 8" |

4. Get your Database ID from the URL:
   - `https://www.notion.so/workspace/DATABASE_ID?v=...`
   - Copy the DATABASE_ID part

## 🔐 Environment Variables

Create `.env` file:

```bash
VITE_NOTION_TOKEN=your_notion_integration_token
VITE_NOTION_DATABASE_ID=your_database_id
```

## 🚀 Deployment

### Local Development
```bash
npm install
npm run dev
```

### Deploy to Vercel
```bash
npm run build
npx vercel --prod
```

Add environment variables in Vercel dashboard before deploying.

## 💡 Usage Tips

1. **Track Everything**: Add all subscriptions, even free ones
2. **Set Renewal Dates**: Get alerts before you're charged
3. **Use Action Needed**: Mark subscriptions to cancel or review
4. **Review Monthly**: Check total spend and upcoming renewals

## 📱 PWA Support

Install as app on your phone:
- **iOS**: Safari → Share → Add to Home Screen
- **Android**: Chrome → Menu → Add to Home Screen

## 🔒 Security

- Notion token has workspace access - keep it secret
- Database is private by default
- No data stored in frontend or third-party servers
