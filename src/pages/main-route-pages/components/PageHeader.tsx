import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 shadow-md border-b border-blue-500/20">
      <div className="flex items-center justify-between min-h-[75px] py-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-white leading-tight">{title}</h1>
          {description && <p className="text-blue-100 text-xs leading-tight">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}
