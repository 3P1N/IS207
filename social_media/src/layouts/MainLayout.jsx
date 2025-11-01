import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../shared/components/Navbar";
export default function MainLayout() {
  return (
    <div>
      <header>
        <Navbar/>
      </header>

      <main>
        <Outlet />   {/* Nơi hiển thị page con */}
      </main>

    </div>
  );
}
