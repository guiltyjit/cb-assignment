'use client';

import { TableHead } from '@/components/ui/table';
import type { SortingKey, OrderState } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import Link from 'next/link';

const mapperNameToLabel: Record<SortingKey, string> = {
  due_date: 'Due date',
  created_on: 'Created date'
};

export default function TaskSortingHead({ sortKey }: { sortKey: SortingKey }) {
  const searchParams = useSearchParams();
  const allParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    allParams[key] = value;
  });
  const orderBy: OrderState = allParams?.['orderBy'] === 'acs' ? 'desc' : 'acs';

  return (
      <TableHead className="hidden md:table-cell">
        <Link
          className="flex items-center min-h-[25px] gap-3"
          href={{
            pathname: '/',
            query: { ...allParams, sortBy: sortKey, orderBy }
          }}
        >
          {mapperNameToLabel[sortKey]}
          {allParams?.['orderBy'] === 'desc' &&
            allParams?.['sortBy'] === sortKey && <ArrowBigDown />}
          {allParams?.['orderBy'] === 'acs' &&
            allParams?.['sortBy'] === sortKey && <ArrowBigUp />}
        </Link>
      </TableHead>
  );
}
