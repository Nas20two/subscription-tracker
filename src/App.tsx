import { useEffect, useState } from "react";
import { fetchSubscriptions, calculateMonthlyCost, getUpcomingRenewals } from "./notion";
import type { Subscription } from "./notion";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Badge } from "./components/ui/Badge";
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  ExternalLink,
  Wallet,
  Bell,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import "./App.css";

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await fetchSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const monthlyCost = calculateMonthlyCost(subscriptions);
  const yearlyCost = monthlyCost * 12;
  const upcomingRenewals = getUpcomingRenewals(subscriptions, 30);
  const actionItems = subscriptions.filter(s => s.actionNeeded);
  const activeCount = subscriptions.filter(s => s.status === "Active").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-slate-400">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card variant="glass" padding="lg" className="max-w-md text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={loadSubscriptions} variant="primary">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Subscription Tracker</h1>
                <p className="text-white/70 text-sm">Never miss a renewal</p>
              </div>
            </div>
            <a 
              href="https://notion.so" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 transition-colors text-sm"
            >
              Open Notion <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="glass" padding="lg" className="animate-fade-in">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Monthly</span>
            </div>
            <p className="text-2xl font-bold text-white">${monthlyCost.toFixed(2)}</p>
            <p className="text-slate-400 text-xs mt-1">AUD equivalent</p>
          </Card>

          <Card variant="glass" padding="lg" className="animate-fade-in" style={{animationDelay: "0.1s"}}>
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-medium">Yearly</span>
            </div>
            <p className="text-2xl font-bold text-white">${yearlyCost.toFixed(0)}</p>
            <p className="text-slate-400 text-xs mt-1">Projected cost</p>
          </Card>

          <Card variant="glass" padding="lg" className="animate-fade-in" style={{animationDelay: "0.2s"}}>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-white">{activeCount}</p>
            <p className="text-slate-400 text-xs mt-1">Subscriptions</p>
          </Card>

          <Card variant="glass" padding="lg" className="animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Due Soon</span>
            </div>
            <p className="text-2xl font-bold text-white">{upcomingRenewals.length}</p>
            <p className="text-slate-400 text-xs mt-1">Next 30 days</p>
          </Card>
        </div>

        {/* Action Items */}
        {actionItems.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <Card variant="default" padding="lg" className="border-l-4 border-amber-500">
              <h2 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Action Required
              </h2>
              <div className="space-y-3">
                {actionItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-slate-400 text-sm">{item.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-bold">${item.cost}</p>
                      <p className="text-slate-500 text-xs">{item.billingCycle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* All Subscriptions */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">All Subscriptions ({subscriptions.length})</h2>
          <Card variant="glass" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Cost</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map(sub => (
                    <tr key={sub.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{sub.name}</p>
                        {sub.notes && <p className="text-slate-500 text-xs">{sub.notes}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="neutral">{sub.category}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white font-medium">${sub.cost}</p>
                        <p className="text-slate-500 text-xs">{sub.billingCycle}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={sub.status === "Active" ? "success" : sub.status === "Trial" ? "info" : "neutral"}>
                          {sub.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
