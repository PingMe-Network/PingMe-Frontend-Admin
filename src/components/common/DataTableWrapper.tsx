import type { ReactNode } from "react";
import LoadingSpinner from "@/components/custom/LoadingSpinner";

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
}: DataTableWrapperProps) {
    if (isLoading) {
        return (
            <div className={`flex justify-center py-10 ${className}`}>
                <LoadingSpinner />
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
