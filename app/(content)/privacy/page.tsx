import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
     "Dillinger's privacy policy. Documents are handled locally and saved to files on your computer.",
  alternates: { canonical: "https://dillinger.io/privacy" },
};

const LAST_UPDATED = "May 10, 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-text-muted text-sm mb-12">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-10 text-text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text-primary">The short version</h2>
          <p>
             Dillinger is a local desktop markdown editor. Your documents are saved
             directly to files on your computer. We do not sell your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text-primary">What we store</h2>
          <p>
             <strong className="text-text-primary">On your computer:</strong> the
             files you explicitly open or save, plus transient editor state while
             the app is running.
          </p>
          <p>
             <strong className="text-text-primary">On our servers:</strong> nothing
             tied to your identity. Dillinger has no account or cloud-storage
             system and does not persist your document contents.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text-primary">Analytics and ads</h2>
          <p>
            We use privacy-respecting analytics to understand aggregate usage of
            the site (page views, traffic sources). Dillinger may also display a
            single Carbon ad on the landing page; Carbon serves a contextual ad
            based on the page itself, not on your personal profile.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text-primary">Exports and uploads</h2>
          <p>
             HTML and PDF exports are generated locally by the desktop app. Your
             markdown is not sent to a cloud provider for export.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text-primary">Children</h2>
          <p>
            Dillinger is a general-audience tool and is not directed at children
            under 13.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text-primary">Changes</h2>
          <p>
            If this policy changes in a way that affects how we handle your data,
            we will update the &quot;Last updated&quot; date above and, where
            appropriate, surface a notice in the editor.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text-primary">Contact</h2>
          <p>
            Questions? Open an issue at{" "}
            <a
              href="https://github.com/joemccann/dillinger"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plum hover:underline"
            >
              github.com/joemccann/dillinger
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-border-light text-center">
        <Link
          href="/"
          className="inline-block bg-plum text-bg-sidebar px-6 py-3 rounded font-medium hover:opacity-90 transition-opacity"
        >
          Back to the Editor
        </Link>
      </div>
    </div>
  );
}
