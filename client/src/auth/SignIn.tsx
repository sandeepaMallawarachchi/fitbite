export default function SignIn() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat z-0"
        style={{ backgroundImage: `url('/common-bg.png')` }}
      />
      <div className="p-8">
        <a href="/">
          <img
            src="/vite.png"
            alt="fite bite Logo"
            className="h-10 w-auto cursor-pointer"
          />
        </a>
      </div>
    </section>
  );
}
