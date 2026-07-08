import Sidebar from "../components/Sidebar";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;