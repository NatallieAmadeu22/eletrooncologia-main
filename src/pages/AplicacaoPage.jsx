import { useState, useEffect } from 'react'
import Field from '../components/Field'
import Modal from '../components/Modal'
import SaveToast from '../components/SaveToast'
import { getAplicacoes, createAplicacao, updateAplicacao, deleteAplicacao } from '../services/api'

const EMPTY = () => ({
  cancer: '', exame: '', metodo: '', profissionais: '',
  tempo_analise: '', taxa_precisao: '', tempo_recuperacao: '',
})

function AplicacaoModal({ item, onClose, onSave }) {
  const [d, setD] = useState(item ?? EMPTY())
  const [saving, setSaving] = useState(false)
  const chg = (e) => setD((p) => ({ ...p, [e.target.name]: e.target.value }))
  const handleSave = async () => { setSaving(true); await onSave(d); setSaving(false) }

  return (
    <Modal title={item ? 'Editar Aplicação' : 'Nova Aplicação'} subtitle="Uso médico e resultados esperados" onClose={onClose}>
      <div className="field-group-title">Uso Médico</div>
      <div className="row g-3">
        <div className="col-md-6">
          <Field label="Tipo de câncer analisado" name="cancer" value={d.cancer} onChange={chg} as="select"
            options={['Mama','Próstata','Pulmão','Cólon','Leucemia','Melanoma','Pâncreas','Fígado','Estômago','Outro']} />
        </div>
        <div className="col-md-6"><Field label="Tipo de exame realizado"  name="exame"          value={d.exame}          onChange={chg} /></div>
        <div className="col-md-6"><Field label="Método de aplicação"      name="metodo"         value={d.metodo}         onChange={chg} /></div>
        <div className="col-md-6"><Field label="Profissionais necessários" name="profissionais" value={d.profissionais}  onChange={chg} /></div>
      </div>
      <div className="divider" />
      <div className="field-group-title">Resultados Esperados</div>
      <div className="row g-3">
        <div className="col-md-4"><Field label="Tempo médio de análise"        name="tempo_analise"     value={d.tempo_analise}     onChange={chg} /></div>
        <div className="col-md-4"><Field label="Taxa de precisão"              name="taxa_precisao"     value={d.taxa_precisao}     onChange={chg} /></div>
        <div className="col-md-4"><Field label="Tempo estimado de recuperação" name="tempo_recuperacao" value={d.tempo_recuperacao} onChange={chg} /></div>
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

export default function AplicacaoPage() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [toast, setToast]     = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getAplicacoes().then((r) => setList(r.data)).catch(() => setError('Erro ao carregar aplicações.')).finally(() => setLoading(false))
  }, [])

  const handleSave = async (d) => {
    try {
      if (d.id) { const r = await updateAplicacao(d.id, d); setList((p) => p.map((x) => x.id === d.id ? r.data : x)) }
      else       { const r = await createAplicacao(d);       setList((p) => [...p, r.data]) }
      setModal(null); setToast(true)
    } catch { setError('Erro ao salvar aplicação.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta aplicação?')) return
    try { await deleteAplicacao(id); setList((p) => p.filter((x) => x.id !== id)) }
    catch { setError('Erro ao excluir.') }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
        <div><div className="section-title">Aplicação do Produto</div><div className="section-sub">Uso clínico e resultados esperados por tipo de câncer</div></div>
        <button className="btn-primary-custom" onClick={() => setModal('new')}><i className="bi bi-plus-lg" /> Nova aplicação</button>
      </div>
      {error && <div className="alert mb-3" style={{ background:'rgba(180,30,30,.1)', border:'1px solid rgba(180,30,30,.3)', color:'var(--clr-danger)', borderRadius:10 }}><i className="bi bi-exclamation-triangle me-2" />{error}</div>}
      <div className="card-dark">
        {loading ? <div style={{ color:'var(--clr-muted)', padding:40, textAlign:'center' }}>Carregando…</div>
        : list.length === 0 ? (
          <div className="empty-state"><i className="bi bi-activity" /><p>Nenhuma aplicação registrada.</p>
            <button className="btn-ghost mt-3" onClick={() => setModal('new')}><i className="bi bi-plus-lg" /> Adicionar</button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-dark-custom">
              <thead><tr><th>Tipo de câncer</th><th>Exame</th><th>Taxa de precisão</th><th>T. análise</th><th>T. recuperação</th><th></th></tr></thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight:500 }}>{a.cancer||'—'}</td>
                    <td>{a.exame||'—'}</td>
                    <td><span className="tag tag-green">{a.taxa_precisao||'—'}</span></td>
                    <td>{a.tempo_analise||'—'}</td>
                    <td>{a.tempo_recuperacao||'—'}</td>
                    <td><div className="d-flex gap-2">
                      <button className="btn-ghost btn-sm-edit" onClick={() => setModal(a)}><i className="bi bi-pencil" /> Editar</button>
                      <button className="btn-danger-ghost" onClick={() => handleDelete(a.id)}><i className="bi bi-trash" /> Excluir</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && <AplicacaoModal item={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {toast && <SaveToast onHide={() => setToast(false)} />}
    </div>
  )
}
