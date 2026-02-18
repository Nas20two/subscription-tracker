import { Client } from "@notionhq/client";

const NOTION_TOKEN = import.meta.env.VITE_NOTION_TOKEN;
const DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("Missing Notion credentials");
}

export const notion = new Client({ auth: NOTION_TOKEN });

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  billingCycle: string;
  nextRenewal: string;
  category: string;
  status: string;
  actionNeeded: boolean;
  notes: string;
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  try {
    // @ts-ignore - Notion client types issue
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Status",
        select: {
          does_not_equal: "Cancelled"
        }
      },
      sorts: [
        {
          property: "Next Renewal",
          direction: "ascending"
        }
      ]
    });

    // @ts-ignore
    return response.results.map((page: any) => ({
      id: page.id,
      name: page.properties.Name?.title[0]?.plain_text || "Untitled",
      cost: page.properties.Cost?.number || 0,
      currency: page.properties.Currency?.select?.name || "USD",
      billingCycle: page.properties["Billing Cycle"]?.select?.name || "Monthly",
      nextRenewal: page.properties["Next Renewal"]?.date?.start || "",
      category: page.properties.Category?.select?.name || "Other",
      status: page.properties.Status?.select?.name || "Active",
      actionNeeded: page.properties["Action Needed"]?.checkbox || false,
      notes: page.properties.Notes?.rich_text[0]?.plain_text || ""
    }));
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
}

export function calculateMonthlyCost(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, sub) => {
    const cost = sub.cost || 0;
    if (sub.billingCycle === "Yearly") {
      return total + cost / 12;
    }
    return total + cost;
  }, 0);
}

export function getUpcomingRenewals(subscriptions: Subscription[], days: number = 30): Subscription[] {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(now.getDate() + days);
  
  return subscriptions.filter(sub => {
    if (!sub.nextRenewal) return false;
    const renewal = new Date(sub.nextRenewal);
    return renewal >= now && renewal <= cutoff;
  });
}
