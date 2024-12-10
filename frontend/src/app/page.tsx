export default function Home() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-2xl text-center px-8 py-12 bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl">
        <div className="inline-block mb-6 p-3 bg-indigo-50 rounded-full">
          <span className="text-4xl">👋</span>
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Your Dashboard
        </h1>
        <div className="space-y-4 text-gray-600">
          <p className="text-xl leading-relaxed">
            Manage your e-commerce business with comprehensive dashboard, 
            streamlined product and order management, 
            and essential analytics — all in one place.
          </p>
          <p className="text-lg leading-relaxed">
            Get started by selecting an option from the sidebar, or check out our{' '}
            <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium border-b-2 border-indigo-200 hover:border-indigo-600 transition-colors">
              quick start guide
            </span>{' '}
            to learn more about the dashboard features.
          </p>
        </div>
      </div>
    </div>
  );
}