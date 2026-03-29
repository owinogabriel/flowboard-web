"use client"; 

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
 
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered "fresh" for 1 minute before it becomes stale
            staleTime: 60 * 1000,
            // If a query fails, it will attempt to refetch 1 additional time before erroring
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
    
      {children}
      
      {/* Visual debugging tool for managing cache/queries in development */}
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}