import { useState, useEffect } from 'react'
import { getProdutos, getAplicacoes, getClientes, getParcerias } from '../services/api'

const KpiCard = ({ label, value, icon, color }) => (
  <div className="col-6 col-lg-3">
    <div className="kpi-card">
      <div className="d-flex align-items-center gap-2 mb-2">
        <div className={`icon-circle icon-circle-${color}`}><i className={`bi ${icon}`} /></div>
        <span className="kpi-label" style={{ marginBottom: 0 }}>{label}</span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">registros ativos</div>
    </div>
  </div>
)

export default function Dashboard() {
  const [counts, setCounts] = useState({ produtos: 0, aplicacoes: 0, clientes: 0, parcerias: 0 })

  useEffect(() => {
    Promise.allSettled([getProdutos(), getAplicacoes(), getClientes(), getParcerias()])
      .then(([p, a, c, pa]) => setCounts({
        produtos:   p.status  === 'fulfilled' ? p.value.data.length  : 0,
        aplicacoes: a.status  === 'fulfilled' ? a.value.data.length  : 0,
        clientes:   c.status  === 'fulfilled' ? c.value.data.length  : 0,
        parcerias:  pa.status === 'fulfilled' ? pa.value.data.length : 0,
      }))
  }, [])

  const kpis = [
    { label: 'Produtos cadastrados',    value: counts.produtos,   icon: 'bi-cpu',       color: 'green' },
    { label: 'Aplicações registradas',  value: counts.aplicacoes, icon: 'bi-activity',  color: 'blue'  },
    { label: 'Clientes / Instituições', value: counts.clientes,   icon: 'bi-hospital',  color: 'green' },
    { label: 'Parcerias ativas',        value: counts.parcerias,  icon: 'bi-diagram-3', color: 'blue'  },
  ]

  return (
    <div>
      <div className="section-title">Painel Geral</div>
      <div className="section-sub"><span className="glow-dot" />Sistema Eletrooncologia — visão consolidada</div>

      <div className="row g-3 mb-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card-dark h-100">
            <div className="field-group-title"><i className="bi bi-building me-2" />Sobre a empresa</div>
            <p style={{ fontSize: '.88rem', color: 'var(--clr-muted)', lineHeight: 1.7 }}>
              A <strong style={{ color: 'var(--clr-text)' }}>Eletrooncologia</strong> é uma empresa brasileira de tecnologia médica focada em transformar o tratamento do câncer por meio do{' '}
              <strong style={{ color: 'var(--clr-accent)' }}>Oncochip</strong>, dispositivo de micro-sensores que libera nanorrobôs no sistema sanguíneo para atuação direta no tratamento oncológico.
            </p>
            <div className="divider" />
            <div className="row g-2">
              {[['Cidade','São Paulo / Brasil'],['Fundação','2020'],['Área','Nanomedicina'],['Produto','Oncochip']].map(([l,v]) => (
                <div key={l} className="col-6">
                  <div style={{ fontSize: '.7rem', color: 'var(--clr-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</div>
                  <div style={{ fontSize: '.88rem', color: 'var(--clr-text)', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card-dark h-100">
            <div className="field-group-title"><i className="bi bi-lightning-charge me-2" />Tecnologia central</div>
            <div className="d-flex flex-column gap-3">
              {[
                { icon: 'bi-cpu-fill',       title: 'Micro-Sensores',    desc: 'Dispositivos de alta precisão integrados ao Oncochip para captura de dados em tempo real' },
                { icon: 'bi-robot',          title: 'Nanorrobôs',        desc: 'Liberados no sistema sanguíneo para atuação direta no tecido oncológico' },
                { icon: 'bi-graph-up-arrow', title: 'Diagnóstico Precoce', desc: 'Identificação antecipada e monitoramento contínuo do tratamento' },
              ].map((t) => (
                <div key={t.title} className="d-flex gap-3 align-items-start">
                  <div className="icon-circle icon-circle-green"><i className={`bi ${t.icon}`} /></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{t.title}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--clr-muted)', marginTop: 2 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
