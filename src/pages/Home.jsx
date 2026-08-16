import {
  Store,
  Star,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: Star,
      title: "Normal users",
      description:
        "Browse every registered store, search by name or address, and submit or update your rating anytime.",
    },
    {
      icon: Users,
      title: "Store owners",
      description:
        "See your store's average rating and the full list of customers who rated it.",
    },
    {
      icon: ShieldCheck,
      title: "Administrators",
      description:
        "Add stores and users, and filter or sort every listing by name, email, address, and role.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f5] text-slate-800">
      {/* Main container */}
      <div className="mx-auto max-w-[1060px] px-6">

        {/* Navbar */}
        <header className="flex h-[84px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ee922c]">
              <Store
                size={19}
                strokeWidth={2.2}
                className="text-slate-800"
              />
            </div>

            <span className="text-[20px] font-semibold tracking-[-0.3px]">
              Storefront
            </span>
          </div>

          {/* Sign in */}
          <button
            type="button"
            className="rounded-xl bg-[#203953] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#172d45]"
          >
            Sign in
          </button>
        </header>

        {/* Hero */}
        <main>
          <section className="pt-[64px]">
            {/* Small heading */}
            <p className="mb-4 text-[16px] font-medium text-[#ed861e]">
              Store ratings platform
            </p>

            {/* Main heading */}
            <h1 className="max-w-[790px] text-[52px] font-semibold leading-[1.05] tracking-[-2px] text-[#182230]">
              Honest store ratings, from one to five stars.
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[780px] text-[20px] leading-[1.55] text-[#536b86]">
              Shoppers rate the stores they visit, owners watch their
              reputation in real time, and administrators keep the directory
              clean — all behind a single sign-in.
            </p>

            {/* CTA */}
            <div className="mt-9 flex items-center gap-3">
              <Link
  to="/auth"
  className="rounded-xl bg-[#203953] px-9 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#172d45]"
>
  Create an account
</Link>

<Link
  to="/auth"
  className="rounded-xl border border-[#dedbd3] bg-white px-9 py-3.5 text-[15px] font-medium text-slate-800 shadow-sm transition hover:bg-[#f7f6f2]"
>
  Sign in
</Link>
            </div>
          </section>

          {/* Feature cards */}
          <section className="mt-[72px] grid grid-cols-1 gap-4 pb-16 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="min-h-[204px] rounded-[17px] border border-[#e1ded5] bg-[#f7f5ed] p-7 transition hover:-translate-y-1 hover:shadow-sm"
                >
                  {/* Icon */}
                  <div className="mb-5">
                    <Icon
                      size={23}
                      strokeWidth={1.9}
                      className="text-[#ed8b25]"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="text-[19px] font-semibold tracking-[-0.3px] text-[#172333]">
                    {feature.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-3 text-[15.5px] leading-[1.5] text-[#58708b]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;