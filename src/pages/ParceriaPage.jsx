import { useState, useEffect } from 'react'
import Field from '../components/Field'
import Modal from '../components/Modal'
import SaveToast from '../components/SaveToast'
import { getParcerias, createParceria, updateParceria, deleteParceria } from '../services/api'

const EMPTY = () => ({ nome: '', tipo: '', area: '', data_inicio: '', objetivo: '', resultados: '' })

const TAG_TIPO = { 'Pesquisa científica':'tag-blue','Distribuição comercial':'tag-green','Investimento':'tag-green','Piloto clínico':'tag-blue','Regulatória':'tag-gray','Tecnológica':'tag-blue' }

function ParceriaModal({ item, onClose, onSave }) {
  const [d, setD] = useState(item ?? EMPTY())
  const [saving, setSaving] = useState(false)
  const chg = (e) => setD((p) => ({ ...p, [e.target.name]: e.target.value }))
  const handleSave = async () => { setSaving(true); await onSave(d); setSaving(false) }

  return (
    <Modal title={item ? 'Editar Parceria' : 'Nova Parceria'} subtitle="Instituição parceira e dados da colaboração" onClose={onClose}>
      <div className="field-group-title">Dados da Parceria</div>
      <div className="row g-3">
        <div className="col-md-6"><Field label="Nome da instituição parceira" name="nome" value={d.nome} onChange={chg} required /></div>
        <div className="col-md-6">
          <Field label="Tipo de parceria" name="tipo" value={d.tipo} onChange={chg} as="select"
            options={['Pesquisa científica','Distribuição comercial','Investimento','Piloto clínico','Regulatória','Tecnológica']} />
        </div>
        <div className="col-12"><Field label="Área de colaboração"  name="area"        value={d.area}       onChange={chg} /></div>
        <div className="col-md-4"><Field label="Data de início"     name="data_inicio"  value={d.data_inicio} onChange={chg} type="date" /></div>
        <div className="col-md-8"><Field label="Objetivo da parceria" name="objetivo"  value={d.objetivo}   onChange={chg} as="textarea" /></div>
        <div className="col-12"><Field label="Resultados esperados" name="resultados"  value={d.resultados} onChange={chg} as="textarea" /></div>
      </div>
      <div className="divider" />
      <div className="d-flex justify-content-end gap-2">
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn-primary-custom" onClick={handleSave} disabled={saving}>
          {saving ? <><i className="bi bi-arrow-repeat" style={{animation:'spin 1s linear infinite'}} /> Salvando…</> : <><i className="bi bi-floppy" /> Salvar</>}
        </button>
      </div>
    </Modal>
  )
}

export default function ParceriaPage() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [toast, setToast]     = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getParcerias().then((r) => setList(r.data)).catch(() => setError('Erro ao carregar parcerias.')).finally(() => setLoading(false))
  }, [])

  const handleSave = async (d) => {
    try {
      if (d.id) { const r = await updateParceria(d.id, d); setList((p) => p.map((x) => x.id === d.id ? r.data : x)) }
      else       { const r = await createParceria(d);       setList((p) => [...p, r.data]) }
      setModal(null); setToast(true)
    } catch { setError('Erro ao salvar parceria.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta parceria?')) return
    try { await deleteParceria(id); setList((p) => p.filter((x) => x.id !== id)) }
    catch { setError('Erro ao excluir.') }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
        <div><div className="section-title">Parcerias</div><div className="section-sub">Instituições parceiras e colaborações estratégicas</div></div>
        <button className="btn-primary-custom" onClick={() => setModal('new')}><i className="bi bi-plus-lg" /> Nova parceria</button>
      </div>
      {error && <div className="alert mb-3" style={{ background:'rgba(180,30,30,.1)', border:'1px solid rgba(180,30,30,.3)', color:'var(--clr-danger)', borderRadius:10 }}><i className="bi bi-exclamation-triangle me-2" />{error}</div>}
      <div className="card-dark">
        {loading ? <div style={{ color:'var(--clr-muted)', padding:40, textAlign:'center' }}>Carregando…</div>
        : list.length === 0 ? (
          <div className="empty-state"><i className="bi bi-diagram-3" /><p>Nenhuma parceria cadastrada.</p>
            <button className="btn-ghost mt-3" onClick={() => setModal('new')}><i className="bi bi-plus-lg" /> Adicionar</button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-dark-custom">
              <thead><tr><th>Instituição</th><th>Tipo</th><th>Área</th><th>Início</th><th>Objetivo</th><th></th></tr></thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight:500 }}>{p.nome||'—'}</td>
                    <td><span className={`tag ${TAG_TIPO[p.tipo]||'tag-gray'}`}>{p.tipo||'—'}</span></td>
                    <td>{p.area||'—'}</td>
                    <td>{p.data_inicio||'—'}</td>
                    <td style={{ maxWidth:180 }}>
                      <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'var(--clr-muted)', fontSize:'.82rem' }}>{p.objetivo||'—'}</div>
                    </td>
                    <td><div className="d-flex gap-2">
                      <button className="btn-ghost btn-sm-edit" onClick={() => setModal(p)}><i className="bi bi-pencil" /> Editar</button>
                      <button className="btn-danger-ghost" onClick={() => handleDelete(p.id)}><i className="bi bi-trash" /> Excluir</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && <ParceriaModal item={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {toast && <SaveToast onHide={() => setToast(false)} />}
    </div>
  )
}
