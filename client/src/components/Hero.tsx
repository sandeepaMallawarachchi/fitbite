export default function Hero() {
  return (
    <section
      className="min-h-screen bg-white bg-cover  items-start text-left justify-start "
      style={{
        backgroundImage: "url('/home-page-hero1.png')",
      }}
    >
      <div className="max-w-2xl px-12 pt-60">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-20 mb-16 ">
          Fuel Your
          <br />
          Fitness Journey
        </h1>

        <p className="text-xl md:text-[28px] text-gray-600 mb-18 font-semibold ">
          Track Your Meals, Hit Your Goals,
          <br />
          Get Expert Guidance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#" className="inline-block transition-transform hover:scale-105">
            <img src="/app-store.png?height=60&width=180" alt="Download on the App Store" className="h-14 md:h-16" />
          </a>
          <a href="#" className="inline-block transition-transform hover:scale-105">
            <img src="/google-play.png?height=60&width=180" alt="Get it on Google Play" className="h-14 md:h-16" />
          </a>
        </div>
      </div>
    </section>
  )
}
