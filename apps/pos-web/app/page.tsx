const categories = ["Combos", "Burgers", "Sides", "Drinks", "Desserts"];
const products = ["Classic Combo", "Double Burger", "Fries", "Iced Tea", "Kids Meal", "Sauce"];

export default function PosHomePage() {
  return (
    <main className="pos-shell">
      <header className="pos-topbar">
        <strong>ToniOS POS</strong>
        <div className="signals">
          <span>Branch: Main</span>
          <span>Cash: Closed</span>
          <span>Sync: Ready</span>
        </div>
      </header>
      <section className="category-rail" aria-label="Product categories">
        {categories.map((category) => (
          <button key={category} type="button">
            {category}
          </button>
        ))}
      </section>
      <section className="product-grid" aria-label="Products">
        {products.map((product) => (
          <button className="product" key={product} type="button">
            <span>{product}</span>
            <strong>$0.00</strong>
          </button>
        ))}
      </section>
      <aside className="order-panel">
        <div>
          <p>Current Order</p>
          <h1>$0.00</h1>
        </div>
        <div className="order-empty">No items</div>
        <button className="pay-button" type="button">
          Charge
        </button>
      </aside>
    </main>
  );
}
