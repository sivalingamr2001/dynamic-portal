import { useState } from "react"

// Mock Data matching your image
const metricData = {
  approvedLines: { value: 7, sub: "active items" },
  approvedQty: { value: "38,725", sub: "total units" },
  allocated: { value: "51,695", sub: "133% fill rate", color: "text-green-600" },
  unallocated: { value: "-12,970", sub: "-33% remaining", color: "text-amber-600" },
  acknowledgements: { value: 15, sub: "linked to items" },
}

const tableData = [
  { code: "PCB-001", name: "PCB Assembly Rev3", customer: "ABC Electronics", region: "Maharashtra", qty: "480", allocated: "450", progress: 94, status: "Partial" },
  { code: "RES-010K", name: "Resistor 10K 1%", customer: "ABC Electronics", region: "Maharashtra", qty: "10,000", allocated: "10,000", progress: 100, status: "Fulfilled" },
  { code: "MOT-DC12", name: "DC Motor 12V 100RPM", customer: "Delta Manufact...", region: "Tamil Nadu", qty: "200", allocated: "200", progress: 100, status: "Fulfilled" },
  { code: "PWR-24V", name: "Power Supply 24V 5A", customer: "Delta Manufact...", region: "Tamil Nadu", qty: "45", allocated: "45", progress: 100, status: "Fulfilled" },
  { code: "IC-555", name: "IC Timer NE555P", customer: "Open Pool", region: "—", qty: "5,000", allocated: "5,000", progress: 100, status: "Fulfilled" },
  { code: "LED-RED", name: "LED Red 5mm 20mA", customer: "Open Pool", region: "—", qty: "18,000", allocated: "18,000", progress: 100, status: "Fulfilled" },
]

export const DashboardPage = () => {
  const [filter, setFilter] = useState("All")

  return (
    <div className="min-h-screen bg-slate-50 py-2 font-sans text-slate-800">
      {/* 1. Top Metrics Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <MetricCard title="Approved Lines" value={metricData.approvedLines.value} sub={metricData.approvedLines.sub} textColor={undefined} />
        <MetricCard title="Approved Qty" value={metricData.approvedQty.value} sub={metricData.approvedQty.sub} textColor={undefined} />
        <MetricCard title="Allocated (QA)" value={metricData.allocated.value} sub={metricData.allocated.sub} textColor={metricData.allocated.color} />
        <MetricCard title="Unallocated" value={metricData.unallocated.value} sub={metricData.unallocated.sub} textColor={metricData.unallocated.color} />
        <MetricCard title="Order Acknowledgements" value={metricData.acknowledgements.value} sub={metricData.acknowledgements.sub} textColor={undefined} />
      </div>

      {/* 2. Filter Table Toolbar */}
      <div className="bg-white rounded-t-xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
        <div className="text-sm font-semibold text-slate-500">7 line(s)</div>
        <div className="flex items-center gap-2">
          {["All", "Fulfilled", "Partial", "Open"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${filter === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3">Item Code</th>
              <th className="p-3">Item Name</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Region</th>
              <th className="p-3 text-right">Appr. Qty</th>
              <th className="p-3 text-right">Allocated</th>
              <th className="p-3">Fill Progress</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableData.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-semibold text-blue-600 cursor-pointer">{row.code}</td>
                <td className="p-3 text-slate-600">{row.name}</td>
                <td className="p-3 text-slate-500">{row.customer}</td>
                <td className="p-3 text-slate-400">{row.region}</td>
                <td className="p-3 text-right font-bold">{row.qty}</td>
                <td className="p-3 text-right font-bold text-slate-700">{row.allocated}</td>
                <td className="p-3 w-32">
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-8">{row.progress}%</span>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${row.progress === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${row.status === "Fulfilled"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                    }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Reusable Metric Card Sub-Component
const MetricCard = ({ title, value, sub, textColor = "text-slate-800" }: { title: string, value: any, sub: any, textColor: any }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</div>
    <div className="mt-2">
      <div className={`text-2xl font-black tracking-tight ${textColor}`}>{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
    </div>
  </div>
)
