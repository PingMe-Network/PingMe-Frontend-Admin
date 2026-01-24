import { Outlet } from "react-router-dom";
import AdminNavigation from "./components/AdminNavigation";
import { PageHeader } from "./components/PageHeader";

export default function AdminPage() {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <AdminNavigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <PageHeader />
        <div className="flex-1 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
