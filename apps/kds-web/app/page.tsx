const lanes = ["New", "Preparing", "Ready"];

export default function KdsHomePage() {
  return (
    <main className="kds-shell">
      <header className="kds-topbar">
        <strong>ToniOS KDS</strong>
        <span>Station: Kitchen</span>
      </header>
      <section className="lanes">
        {lanes.map((lane) => (
          <article className="lane" key={lane}>
            <header>
              <h1>{lane}</h1>
              <span>0</span>
            </header>
            <div className="empty-state">No tickets</div>
          </article>
        ))}
      </section>
    </main>
  );
}
