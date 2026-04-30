// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FAKE_USER = { email: 'admin@eletrooncologia.com', senha: 'onco123' }

export default function LoginPage({ theme, toggleTheme }) {
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    if (email === FAKE_USER.email && senha === FAKE_USER.senha) {
      localStorage.setItem('auth', 'true')
      navigate('/')
    } else {
      setError('E-mail ou senha incorretos.')
    }
    setLoading(false)
  }

  const dark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: dark ? '#060b14' : '#e8f4f8',
      transition: 'background .3s',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 12, height: 12, borderRadius: '50%',
          background: '#00c8b4',
          boxShadow: '0 0 10px #00c8b4',
          display: 'inline-block',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '1.6rem',
          fontWeight: 800,
          color: dark ? '#e2eaf4' : '#0d2137',
          letterSpacing: '-0.02em',
        }}>
          Eletrooncologia
        </span>
      </div>

      {/* Credenciais de teste */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: dark ? 'rgba(0,200,180,.08)' : 'rgba(0,200,180,.1)',
        border: `1px solid ${dark ? 'rgba(0,200,180,.2)' : 'rgba(0,200,180,.35)'}`,
        borderRadius: 12,
        padding: '14px 20px',
        marginBottom: 16,
        fontSize: '.78rem',
        color: dark ? '#7a93af' : '#4a6a80',
      }}>
        <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8, color: dark ? '#00c8b4' : '#008f80' }}>
          Credenciais de Teste
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>Usuário:</span>
          <span style={{ color: dark ? '#e2eaf4' : '#0d2137', fontWeight: 500 }}>admin@eletrooncologia.com</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Senha:</span>
          <span style={{ color: dark ? '#e2eaf4' : '#0d2137', fontWeight: 500 }}>onco123</span>
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: dark ? '#111e30' : '#ffffff',
        border: `1px solid ${dark ? 'rgba(0,200,180,.15)' : 'rgba(0,0,0,.08)'}`,
        borderRadius: 18,
        padding: '32px',
        boxShadow: dark ? '0 20px 60px rgba(0,0,0,.5)' : '0 8px 40px rgba(0,0,0,.1)',
        transition: 'background .3s, border-color .3s',
      }}>

        {/* Header card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.3rem', fontWeight: 700,
              color: dark ? '#e2eaf4' : '#0d2137',
              marginBottom: 4,
            }}>Bem-Vindo</div>
            <div style={{ fontSize: '.82rem', color: dark ? '#7a93af' : '#6a8a9f' }}>
              Acesse o sistema interno do Oncochip
            </div>
          </div>

          {/* Toggle dark/light */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              border: `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.12)'}`,
              borderRadius: 99,
              background: 'transparent',
              color: dark ? '#7a93af' : '#6a8a9f',
              fontSize: '.78rem', fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all .2s',
              flexShrink: 0,
            }}
          >
            {dark
              ? <><i className="bi bi-sun" /> Light</>
              : <><i className="bi bi-moon-stars" /> Dark</>
            }
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: 'block', marginBottom: 6,
              fontSize: '.75rem', fontWeight: 500,
              color: dark ? '#7a93af' : '#6a8a9f',
              textTransform: 'uppercase', letterSpacing: '.08em',
            }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              style={{
                width: '100%', padding: '11px 14px',
                border: `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.12)'}`,
                borderRadius: 10,
                background: dark ? 'rgba(255,255,255,.04)' : '#f5f9fb',
                color: dark ? '#e2eaf4' : '#0d2137',
                fontSize: '.9rem',
                outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'border-color .2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#00c8b4'}
              onBlur={(e) => e.target.style.borderColor = dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.12)'}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block', marginBottom: 6,
              fontSize: '.75rem', fontWeight: 500,
              color: dark ? '#7a93af' : '#6a8a9f',
              textTransform: 'uppercase', letterSpacing: '.08em',
            }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="••••••"
              style={{
                width: '100%', padding: '11px 14px',
                border: `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.12)'}`,
                borderRadius: 10,
                background: dark ? 'rgba(255,255,255,.04)' : '#f5f9fb',
                color: dark ? '#e2eaf4' : '#0d2137',
                fontSize: '.9rem',
                outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'border-color .2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#00c8b4'}
              onBlur={(e) => e.target.style.borderColor = dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.12)'}
            />
          </div>

          {/* Erro */}
          {error && (
            <div style={{
              marginBottom: 16,
              padding: '10px 14px',
              background: 'rgba(255,75,110,.1)',
              border: '1px solid rgba(255,75,110,.3)',
              borderRadius: 8,
              color: '#ff4b6e',
              fontSize: '.82rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="bi bi-exclamation-circle" /> {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: '#00c8b4',
              border: 'none', borderRadius: 10,
              color: '#060b14',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: '.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? .8 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity .2s, transform .2s',
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.opacity = '.88' }}
            onMouseLeave={(e) => { e.target.style.opacity = loading ? '.8' : '1' }}
          >
            {loading
              ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} /> Entrando…</>
              : <><i className="bi bi-shield-check" /> Entrar</>
            }
          </button>

          <div style={{
            textAlign: 'center', marginTop: 14,
            fontSize: '.74rem', color: dark ? '#7a93af' : '#8aaaaf',
          }}>
            Use as credenciais fake acima para acessar.
          </div>
        </form>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; box-shadow: 0 0 8px #00c8b4; }
          50% { opacity:.5; box-shadow: 0 0 18px #00c8b4; }
        }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
