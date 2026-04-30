// src/components/Sidebar.jsx
import { useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  {
    group: 'Visão Geral',
    items: [
      { path: '/',          label: 'Dashboard',  icon: 'bi-grid-1x2' },
    ],
  },
  {
    group: 'Cadastros',
    items: [
      { path: '/empresa',   label: 'Empresa',    icon: 'bi-building' },
      { path: '/produto',   label: 'Produto',    icon: 'bi-cpu' },
      { path: '/aplicacao', label: 'Aplicação',  icon: 'bi-activity' },
      { path: '/cliente',   label: 'Clientes',   icon: 'bi-hospital' },
      { path: '/parceria',  label: 'Parcerias',  icon: 'bi-diagram-3' },
    ],
  },
]

export default function Sidebar({ theme, toggleTheme }) {
  const navigate   = useNavigate()
  const { pathname } = useLocation()
  const dark = theme === 'dark'

  const logout = () => {
    localStorage.removeItem('auth')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-name">Eletro<br />oncologia</div>
        <div className="sidebar-brand-sub">Sistema interno v1.0</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((grp) => (
          <div key={grp.group}>
            <div className="nav-group-label">{grp.group}</div>
            {grp.items.map((item) => (
              <button
                key={item.path}
                className={`nav-item-btn ${pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <i className={`bi ${item.icon}`} />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="nav-item-btn"
          style={{ marginBottom: 6 }}
        >
          <i className={`bi ${dark ? 'bi-sun' : 'bi-moon-stars'}`} />
          {dark ? 'Modo claro' : 'Modo escuro'}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="nav-item-btn"
          style={{ color: 'var(--clr-danger)' }}
        >
          <i className="bi bi-box-arrow-left" />
          Sair
        </button>
      </div>
    </aside>
  )
}
