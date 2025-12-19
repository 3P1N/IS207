import { Outlet, NavLink, useLocation } from "react-router-dom";
import Navbar from "../shared/components/Navbar";
export default function MainLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: isAdminPage ? '100vh' : 'auto',
      overflow: isAdminPage ? 'hidden' : 'visible'
    }}>
      <header style={{ flexShrink: 0 }}>
        <Navbar/>
      </header>

      <main style={{ 
        flex: isAdminPage ? 1 : 'none',
        overflow: isAdminPage ? 'hidden' : 'visible',
        minHeight: isAdminPage ? 0 : 'auto'
      }}>
        <Outlet />   {/* Nơi hiển thị page con */}
      </main>

    </div>
  );
}
