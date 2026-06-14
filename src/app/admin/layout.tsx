import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BTI lead admin",
  robots: { index: false, follow: false }
};

// Auth is enforced by src/proxy.ts (HTTP Basic). This layout is a plain,
// dependency-light shell for the staff lead views — intentionally separate from
// the public [locale] layout (no marketing header/footer).
export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb" }}>
      <header
        style={{
          background: "#171448",
          color: "#fff",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Link
          href="/admin/leads"
          style={{ color: "#fff", fontWeight: 800, textDecoration: "none" }}
        >
          BTI Lead Admin
        </Link>
        <span style={{ fontSize: 13, opacity: 0.8 }}>Internal — not public</span>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {children}
      </main>
    </div>
  );
}
