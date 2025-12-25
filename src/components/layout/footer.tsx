import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground transition-colors duration-500">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* 🏫 Brand Section */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-3xl font-extrabold tracking-tight flex flex-col sm:flex-row sm:items-baseline gap-1"
            >
              <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Luta
              </span>
              <span className="text-foreground">ZedApp</span>
              <span className="text-muted-foreground text-sm sm:ml-2 font-medium">
                E-learning Platform
              </span>
            </Link>

            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Empowering learners worldwide with interactive, high-quality, and
              accessible education experiences built for the digital era.
            </p>

            {/* 🌍 Social Links */}
            <div className="flex gap-4 mt-6">
              {[
                { href: "https://facebook.com", icon: Facebook },
                { href: "https://twitter.com", icon: Twitter },
                { href: "https://instagram.com", icon: Instagram },
                { href: "https://linkedin.com", icon: Linkedin },
                { href: "https://youtube.com", icon: Youtube },
              ].map(({ href, icon: Icon }, index) => (
                <Link
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-border hover:border-red-500 hover:bg-red-500/10 transition-all duration-300"
                >
                  <Icon className="h-5 w-5 text-muted-foreground hover:text-red-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* 🧭 Platform Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/browse", label: "Browse Classes" },
                { href: "/subjects", label: "Subjects" },
                { href: "/pricing", label: "Pricing" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-foreground/80 hover:text-red-500 transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 💬 Support Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/help", label: "Help Center" },
                { href: "/contact", label: "Contact Us" },
                { href: "/faq", label: "FAQ" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-foreground/80 hover:text-red-500 transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ⚖️ Legal Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-foreground/80 hover:text-red-500 transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ⚫ Divider */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent font-semibold">
              Luta
            </span>
            <span className="text-foreground font-semibold">ZedApp</span>. All
            rights reserved.
          </p>

          <div className="flex gap-6 mt-4 sm:mt-0 text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-red-500 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-red-500 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-red-500 transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
