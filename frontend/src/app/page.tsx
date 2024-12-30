export default function Home() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-2xl text-center px-8 py-12 rounded-2xl">
        <div className="inline-block mb-6 p-3 bg-indigo-50 rounded-full">
          <span className="text-4xl">👋</span>
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Your Dashboard
        </h1>
        <div className="space-y-4 text-gray-600">
          <p className="text-xl leading-relaxed">
            Manage an e-commerce business with a comprehensive dashboard,
            streamlined product and order management,
            and essential analytics — all in one place.
          </p>
          <p className="text-sm">
            Start by clicking "Dashboard" or another item on the navigation bar.
          </p>
        </div>
      </div>
    </div>
  );
}