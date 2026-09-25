"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListPaginationProps {
  page: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function ListPagination({
  page,
  hasNextPage,
  onPageChange,
}: ListPaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>
      <span className="text-sm text-foreground/60">Page {page}</span>
      <Button
        variant="outline"
        size="sm"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
