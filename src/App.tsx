import { useEffect, useState } from "react";
import { fetchSubscriptions, calculateMonthlyCost, getUpcomingRenewals } from "./notion";
import type { Subscription } from "./notion";
import { CreditCard, Calendar, AlertTriangle, TrendingUp, Loader2, ExternalLink } from "lucide-react";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading subscriptions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={loadSubscriptions}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Subscription Tracker</h1>
          </div>
          <a 
            href="https://notion.so" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            Open Notion <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Monthly Cost</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${monthlyCost.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-medium">Yearly Cost</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${yearlyCost.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Upcoming (30d)</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{upcomingRenewals.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">Action Needed</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{actionItems.length}</p>
          </div>
        </div>

        {/* Alerts Section */}
        {actionItems.length > 0 && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Action Items
            </h2>
            <div className="space-y-2">
              {actionItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border border-amber-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.notes}</p>
                  </div>
                  <span className="text-amber-600 font-medium">
                    ${item.cost}/{item.billingCycle === "Yearly" ? "yr" : "mo"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Renewals */}
        {upcomingRenewals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Renewals (Next 30 Days)</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Renewal Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cost</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingRenewals.map(sub => (
                    <tr key={sub.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{sub.name}</td>
                      <td className="px-4 py-3 text-gray-600">{sub.nextRenewal}</td>
                      <td className="px-4 py-3 text-gray-900">
                        ${sub.cost} <span className="text-gray-500 text-sm">/{sub.billingCycle === "Yearly" ? "yr" : "mo"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                          {sub.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Subscriptions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Subscriptions ({subscriptions.length})</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cost</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Next Renewal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{sub.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {sub.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      ${sub.cost} <span className="text-gray-500 text-sm">/{sub.billingCycle === "Yearly" ? "yr" : "mo"}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{sub.nextRenewal || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sub.status === "Active" ? "bg-green-100 text-green-700" :
                        sub.status === "Trial" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
