import type { ReactNode } from "react";
import { TableSkeleton } from "@/components/custom/TableSkeleton";

interface DataTableWrapperProps {
    isLoading: boolean;
    isEmpty: boolean;
    emptyMessage?: string;
    children: ReactNode;
    className?: string;
}

export function DataTableWrapper({
    isLoading,
    isEmpty,
    emptyMessage = "Không tìm thấy kết quả nào.",
    children,
    className = "",
}: Readonly<DataTableWrapperProps>) {
    if (isLoading) {
        return (
            <div className={`w-full ${className}`}>
                <TableSkeleton rowCount={7} />
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className={`text-center py-10 text-gray-500 ${className}`}>
                {emptyMessage}
            </div>
        );
    }

    return <>{children}</>;
}
