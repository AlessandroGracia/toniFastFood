import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@tonios/ui";

export default function CatalogPage() {
  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Catalog v1</p>
          <h1>Catalog</h1>
        </div>
      </header>
      <div className="catalog-grid">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage menu structure for POS and future KDS routing.</p>
            <Link className="tonios-button tonios-button--default" href="/catalog/categories">
              Open categories
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage sellable items, pricing, active state and images.</p>
            <Link className="tonios-button tonios-button--default" href="/catalog/products">
              Open products
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
