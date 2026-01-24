import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

interface TableSkeletonProps {
    rowCount?: number;
}

export function TableSkeleton({ rowCount = 7 }: Readonly<TableSkeletonProps>) {
    const skeletonIds = useMemo(() =>
        Array.from({ length: rowCount }).map(() => crypto.randomUUID()),
        [rowCount]);

    return (
        <div className="w-full">
            {/* Table Header Skeleton */}
            <div className="flex items-center gap-4 py-3 px-4 bg-gray-50/50 border-b mb-2">
                <Skeleton className="h-6 w-full max-w-[150px]" />
                <Skeleton className="h-6 w-full max-w-[150px]" />
                <Skeleton className="h-6 w-full max-w-[150px]" />
                <Skeleton className="h-6 w-full" />
            </div>

            {/* Table Rows Skeleton */}
            <div className="space-y-4 px-4 mt-4">
                {skeletonIds.map((id) => (
                    <div key={id} className="flex items-center gap-4 py-2">
                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4 w-[30%]" />
                            <Skeleton className="h-3 w-[20%]" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
}
