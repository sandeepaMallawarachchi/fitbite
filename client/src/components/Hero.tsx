export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat z-0"
        style={{ backgroundImage: `url('/home-page-hero1.png')` }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-2xl px-6 pt-40 md:pt-60 mx-auto md:ml-12 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-10">
          Fuel Your
          <br />
          Fitness Journey
        </h1>

        <p className="text-xl md:text-[28px] text-gray-600 font-semibold mb-10">
          Track Your Meals, Hit Your Goals,
          <br />
          Get Expert Guidance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start items-center sm:items-start">
          <a href="#" className="inline-block transition-transform hover:scale-105">
            <img
              src="/app-store.png?height=60&width=180"
              alt="Download on the App Store"
              className="h-14 md:h-16"
            />
          </a>
          <a href="#" className="inline-block transition-transform hover:scale-105">
            <img
              src="/google-play.png?height=60&width=180"
              alt="Get it on Google Play"
              className="h-14 md:h-16"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
