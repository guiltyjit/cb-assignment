'use client';

import { useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { z } from 'zod';

type SearchFormValues = {
  keywordSearch: string;
};

const schema = z.object({
  keywordSearch: z.string()
});

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keywordSearch = searchParams.get('keywordSearch') || '';
  const [isPending, startTransition] = useTransition();
  const { register, reset } = useForm<SearchFormValues>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (keywordSearch) {
      reset({
        keywordSearch: keywordSearch
      });
    }
  }, [keywordSearch, reset]);

  function searchAction(formData: FormData) {
    const value = formData.get('q') as string;
    const params = new URLSearchParams({ q: value });
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        {...register('keywordSearch')}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
      {isPending && <Spinner />}
    </form>
  );
}
