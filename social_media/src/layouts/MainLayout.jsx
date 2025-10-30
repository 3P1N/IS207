import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <header>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/message">Message</NavLink>
          <NavLink to="/profile">Profile</NavLink>

        </nav>
      </header>

      <main>
        <Outlet />   {/* Nơi hiển thị page con */}
      </main>

    </div>
  );
}
