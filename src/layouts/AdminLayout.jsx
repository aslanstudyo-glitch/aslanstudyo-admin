import Sidebar from "../components/Sidebar";

function AdminLayout({ children, activePage, setActivePage }) {
  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="admin-main">{children}</main>
    </div>
  );
}

export default AdminLayout;