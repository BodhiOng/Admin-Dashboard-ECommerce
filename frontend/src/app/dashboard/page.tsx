"use client";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-800">$24,780</p>
          <span className="text-green-600 text-sm">+12% from last month</span>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div>
                <p className="font-medium text-gray-700">New order #1234{item}</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                Completed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
