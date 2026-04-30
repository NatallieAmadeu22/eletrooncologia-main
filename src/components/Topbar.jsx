// src/components/Topbar.jsx
import { useLocation, useNavigate } from 'react-router-dom'

const TITLES = {
  '/':          { label: 'Dashboard',               icon: 'bi-grid-1x2' },
  '/empresa':   { label: 'Empresa',                 icon: 'bi-building' },
  '/produto':   { label: 'Produto — Oncochip',      icon: 'bi-cpu' },
  '/aplicacao': { label: 'Aplicação do Produto',    icon: 'bi-activity' },
  '/cliente':   { label: 'Clientes / Instituições', icon: 'bi-hospital' },
  '/parceria':  { label: 'Parcerias',               icon: 'bi-diagram-3' },
}

export default function Topbar({ theme, toggleTheme }) {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const page  = TITLES[pathname] ?? { label: pathname, icon: 'bi-circle' }
  const dark  = theme === 'dark'

  const logout = () => {
    localStorage.removeItem('auth')
    navigate('/login')
  }

  return (
    <div className="topbar">
      <i className={`bi ${page.icon}`} style={{ color: 'var(--clr-accent)' }} />
      <h5 className="topbar-title" style={{ flex: 1 }}>{page.label}</h5>

      {pathname === '/' && <span className="badge-version">Oncochip</span>}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn-ghost"
        style={{ padding: '6px 14px', fontSize: '.8rem' }}
        title={dark ? 'Modo claro' : 'Modo escuro'}
      >
        <i className={`bi ${dark ? 'bi-sun' : 'bi-moon-stars'}`} />
        {dark ? 'Light' : 'Dark'}
      </button>

      {/* Logout */}
      <button
        onClick={logout}
        className="btn-ghost"
        style={{ padding: '6px 12px', fontSize: '.8rem', color: 'var(--clr-danger)', borderColor: 'rgba(255,75,110,.25)' }}
        title="Sair"
      >
        <i className="bi bi-box-arrow-left" />
      </button>
    </div>
  )
}
