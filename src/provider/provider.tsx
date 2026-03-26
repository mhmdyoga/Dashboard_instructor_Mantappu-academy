import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";


export default function Provider({children}: {children: React.ReactNode}) {
    const [queryClient] = useState(() => 
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000, // 30s
                retry: 1
            }
        }
    })
);


return (
    <QueryClientProvider client={queryClient}>
        {children}
        
    </QueryClientProvider>
)
}