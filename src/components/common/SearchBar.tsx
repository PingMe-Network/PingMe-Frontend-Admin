import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    filters?: ReactNode;
    actions?: ReactNode; // Action buttons to show below search
    className?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Tìm kiếm...",
    filters,
    actions,
    className = "",
}: Readonly<SearchBarProps>) {
    return (
        <div className={`p-8 ${className}`}>
            <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1"
                    />
                </div>
                {filters && <div className="flex items-center gap-2">{filters}</div>}
            </div>
            {actions && <div className="mt-4 flex items-center justify-end gap-2">{actions}</div>}
        </div>
    );
}
