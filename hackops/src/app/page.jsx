"use client";
import React from "react";

function MainComponent() {
  // const { data: user } = useUser();
  const user = { name: "John Doe", email: "john@example.com" };
  const stats = [
    { number: "500+", label: "Startups Matched", icon: "fa-handshake" },
    { number: "$50M+", label: "Capital Raised", icon: "fa-dollar-sign" },
    { number: "200+", label: "Active Investors", icon: "fa-users" },
    { number: "95%", label: "Success Rate", icon: "fa-chart-line" },
  ];

  const testimonials = [
    {
      quote:
        "Found our Series A lead investor within weeks of joining the platform.",
      author: "Sarah Chen",
      role: "CEO, TechFlow",
      image: "/testimonial1.jpg",
    },
    {
      quote: "The quality of startups and match accuracy has been exceptional.",
      author: "Michael Ross",
      role: "Partner, Acme Ventures",
      image: "/testimonial2.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl">
                Where Innovative Startups Meet Strategic Investors
              </h1>
              <p className="text-xl text-gray-600">
                Our AI-powered platform connects promising startups with the
                right investors, making fundraising smarter and more efficient
                than ever.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                {!user && (
                  <>
                    <a
                      href="/account/signup"
                      className="rounded-lg bg-[#357AFF] px-8 py-3 text-center font-medium text-white transition-colors hover:bg-[#2E69DE]"
                    >
                      Get Started
                    </a>
                    <a
                      href="/account/signin"
                      className="rounded-lg border border-[#357AFF] px-8 py-3 text-center font-medium text-[#357AFF] transition-colors hover:bg-blue-50"
                    >
                      Sign In
                    </a>
                  </>
                )}
                {user && (
                  <a
                    href="/dashboard"
                    className="rounded-lg bg-[#357AFF] px-8 py-3 text-center font-medium text-white transition-colors hover:bg-[#2E69DE]"
                  >
                    Go to Dashboard
                  </a>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-white p-8 shadow-xl">
                <img
                  src="https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Platform interface showing startup and investor matching"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 text-center shadow-lg"
              >
                <i
                  className={`fas ${stat.icon} mb-4 text-3xl text-[#357AFF]`}
                ></i>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Success Stories
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-xl bg-white p-8 shadow-lg">
                <div className="mb-6 text-lg text-gray-600">
                  <i className="fas fa-quote-left mr-2 text-[#357AFF]"></i>
                  {testimonial.quote}
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Ready to Transform Your Fundraising Journey?
            </h2>
            <p className="mb-8 text-xl text-gray-600">
              Join hundreds of successful startups and investors who have
              already found their perfect match.
            </p>
            {!user && (
              <a
                href="/account/signup"
                className="inline-block rounded-lg bg-[#357AFF] px-8 py-3 font-medium text-white transition-colors hover:bg-[#2E69DE]"
              >
                Get Started Now
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainComponent;