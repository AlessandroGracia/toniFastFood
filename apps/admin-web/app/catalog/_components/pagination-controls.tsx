"use client";

import { Button } from "@tonios/ui";
import type { PaginationMeta } from "@tonios/contracts";

interface PaginationControlsProps {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ meta, onPageChange }: PaginationControlsProps) {
  if (!meta) {
    return null;
  }

  return (
    <div className="catalog-pagination">
      <span>
        Page {meta.page} of {Math.max(meta.pageCount, 1)} · {meta.total} records
      </span>
      <div>
        <Button
          type="button"
          variant="secondary"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={meta.page >= meta.pageCount}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
