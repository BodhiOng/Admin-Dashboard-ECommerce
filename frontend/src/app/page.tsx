export default function Home() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-2xl text-center px-8 py-12 rounded-2xl">

        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-left">
          Welcome to Your Admin Dashboard
        </h1>
        <div className="space-y-4 text-gray-600">
          <p className="text-xl leading-normal text-left">
            One dashboard to run your e-commerce business:
            seamless management, real-time analytics.
          </p>
          <p className="text-sm leading-normal text-left">
            Your business insights await!
            Choose a section from the navigation to unlock
            powerful analytics and management tools.
          </p>
        </div>
      </div>
    </div>
  );
}