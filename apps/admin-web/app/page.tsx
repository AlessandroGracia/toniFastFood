const metrics = [
  { label: "Sales Today", value: "$0.00", tone: "strong" },
  { label: "Open Branches", value: "0", tone: "neutral" },
  { label: "Sync Health", value: "Ready", tone: "good" },
  { label: "Cash Alerts", value: "0", tone: "neutral" }
];

export default function AdminHomePage() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">ToniOS</p>
          <h1>Command Center</h1>
        </div>
        <nav aria-label="Admin navigation">
          <a href="#">Overview</a>
          <a href="#">Branches</a>
          <a href="#">Catalog</a>
          <a href="#">Inventory</a>
          <a href="#">Reports</a>
          <a href="#">Settings</a>
        </nav>
      </aside>
      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Enterprise SaaS</p>
            <h2>Operational Overview</h2>
          </div>
          <span className="status">Foundation Ready</span>
        </header>
        <div className="metrics">
          {metrics.map((metric) => (
            <article className="metric" data-tone={metric.tone} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
        <section className="panel">
          <div>
            <p className="eyebrow">Next Build Slice</p>
            <h3>Tenant, branch and device setup</h3>
          </div>
          <p>
            The admin shell is ready for SaaS setup, role-based navigation and operational
            dashboards.
          </p>
        </section>
      </section>
    </main>
  );
}
