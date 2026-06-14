import Link from "next/link";
import type { DeliveryStatus } from "@/types/leads";
import { prismaLeadRepository } from "@/services/lead-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pageSize = 50;
const statusFilters: (DeliveryStatus | "all")[] = [
  "all",
  "queued",
  "delivered",
  "failed-delivery"
];

const cellStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #e5e7ee",
  textAlign: "left",
  fontSize: 13,
  verticalAlign: "top"
};

function statusColor(status: string) {
  if (status === "delivered") return "#176b5a";
  if (status === "failed-delivery") return "#b51f36";
  return "#b98b2f";
}

function contactSummary(record: {
  email?: string | null;
  phone?: string | null;
}) {
  return [record.email, record.phone].filter(Boolean).join(" · ") || "—";
}

export default async function AdminLeadsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status =
    params.status && statusFilters.includes(params.status as DeliveryStatus)
      ? (params.status as DeliveryStatus)
      : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const { records, total } = await prismaLeadRepository.list({
    status,
    limit: pageSize,
    offset: (page - 1) * pageSize
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap"
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#171448", margin: 0 }}>
          Enquiries ({total})
        </h1>
        {/* File download endpoint, not client-side page navigation — a plain
            anchor with the API route is correct here. */}
        <a
          href="/api/admin/export"
          download
          style={{
            background: "#b51f36",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none"
          }}
        >
          Download CSV
        </a>
      </div>

      <div style={{ margin: "16px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {statusFilters.map((filter) => {
          const active =
            (filter === "all" && !status) || filter === status;
          const href =
            filter === "all" ? "/admin/leads" : `/admin/leads?status=${filter}`;
          return (
            <Link
              key={filter}
              href={href}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid #e5e7ee",
                background: active ? "#171448" : "#fff",
                color: active ? "#fff" : "#171448"
              }}
            >
              {filter}
            </Link>
          );
        })}
      </div>

      {records.length === 0 ? (
        <p style={{ color: "#5e6472" }}>No enquiries yet.</p>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7ee",
            borderRadius: 10,
            overflow: "hidden"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f6f7fb" }}>
                <th style={cellStyle}>Reference</th>
                <th style={cellStyle}>Received</th>
                <th style={cellStyle}>Type</th>
                <th style={cellStyle}>Name</th>
                <th style={cellStyle}>Contact</th>
                <th style={cellStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td style={cellStyle}>
                    <Link
                      href={`/admin/leads/${record.id}`}
                      style={{ color: "#b51f36", fontWeight: 700 }}
                    >
                      {record.publicReference}
                    </Link>
                  </td>
                  <td style={cellStyle}>
                    {record.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td style={cellStyle}>{record.leadType}</td>
                  <td style={cellStyle}>{record.fullName}</td>
                  <td style={cellStyle}>{contactSummary(record)}</td>
                  <td style={{ ...cellStyle, color: statusColor(record.deliveryStatus), fontWeight: 700 }}>
                    {record.deliveryStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
          {page > 1 ? (
            <Link href={`/admin/leads?${status ? `status=${status}&` : ""}page=${page - 1}`}>
              ← Previous
            </Link>
          ) : null}
          <span style={{ fontSize: 13, color: "#5e6472" }}>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/admin/leads?${status ? `status=${status}&` : ""}page=${page + 1}`}>
              Next →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
