import {
  BarChart3,
  Droplet,
  Droplets,
  History,
  LayoutDashboard,
  LogOut,
  Pill,
  Settings,
  Syringe,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router";

import {
  clearToken,
} from "../../services/api";


type SidebarProps = {
  userName?: string;
};


export default function Sidebar({
  userName,
}: SidebarProps) {
  const navigate = useNavigate();

  const displayName =
    userName?.trim() || "Usuário";

  const firstName =
    displayName
      .split(/\s+/)[0];

  const initial =
    firstName
      .charAt(0)
      .toUpperCase();


  function handleLogout() {
    clearToken();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }


  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/insulinas",
      label: "Insulinas",
      icon: Pill,
    },
    {
      to: "/aplicacoes",
      label: "Aplicações",
      icon: Syringe,
    },
    {
      to: "/estoque",
      label: "Estoque",
      icon: Droplets,
    },
    {
      to: "/historico",
      label: "Histórico",
      icon: History,
    },
    {
      to: "/relatorios",
      label: "Relatórios",
      icon: BarChart3,
    },
    {
      to: "/settings",
      label: "Configurações",
      icon: Settings,
    },
  ];


  return (
    <aside className="sidebar">

      <div>
        <div className="sidebar-brand">

          <div className="sidebar-logo">
            <Droplet
              size={23}
              strokeWidth={2.3}
            />
          </div>

          <div>
            <h1>
              Insulinet
            </h1>

            <p>
              Estoque e autonomia
            </p>
          </div>

        </div>


        <nav className="sidebar-nav">
          {navItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({
                    isActive,
                  }) =>
                    isActive
                      ? "sidebar-link active"
                      : "sidebar-link"
                  }
                >
                  <Icon
                    size={18}
                    strokeWidth={2}
                  />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            }
          )}
        </nav>
      </div>


      <div className="sidebar-footer">

        <NavLink
          to="/settings"
          className="sidebar-user"
        >
          <div className="sidebar-avatar">
            {initial}
          </div>

          <div className="sidebar-user-info">
            <strong>
              {firstName}
            </strong>

            <span>
              Minha conta
            </span>
          </div>
        </NavLink>


        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut
            size={16}
            strokeWidth={2}
          />

          <span>
            Sair
          </span>
        </button>

      </div>

    </aside>
  );
}