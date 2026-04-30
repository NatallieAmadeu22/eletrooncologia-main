import { useState, useEffect } from 'react'
import Field from '../components/Field'
import Modal from '../components/Modal'
import SaveToast from '../components/SaveToast'
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/api'

const EMPTY = () => ({
  nome: '', tipo: '', cidade: '', pais: 'Brasil',
  responsavel: '', cargo: '', telefone: '', email: '',
  cancer_mais_tratado: '', volume_pacientes: '', interesse: '',
})

const TAG_INTERESSE = { 'Alto':'tag-green','Contrato ativo':'tag-green','Em negociação':'tag-blue','Médio':'tag-blue','Baixo':'tag-gray' }

function ClienteModal({ item, onClose, onSave }) {
  const [d, setD] = useState(item ?? EMPTY())
  const [saving, setSaving] = useState(false)
  const chg = (e) => setD((p) => ({ ...p, [e.target.name]: e.target.value }))
  const handleSave = async () => { setSaving(true); await onSave(d); setSaving(false) }

  return (
    <Modal title={item ? 'Editar Instituição' : 'Nova Instituição'} subtitle="Cliente / Instituição parceira" onClose={onClose}>
      <div className="field-group-title">Dados da Instituição</div>
      <div className="row g-3">
        <div className="col-md-6"><Field label="Nome da instituição" name="nome"   value={d.nome}   onChange={chg} required /></div>
        <div className="col-md-6">
          <Field label="Tipo" name="tipo" value={d.tipo} onChange={chg} as="select"
            options={['Hospital','Clínica','Laboratório','Centro de pesquisa','Outro']} />
        </div>
        <div className="col-md-6"><Field label="Cidade" name="cidade" value={d.cidade} onChange={chg} /></div>
        <div className="col-md-6"><Field label="País"   name="pais"   value={d.pais}   onChange={chg} /></div>
      </div>
      <div className="divider" />
      <div className="field-group-title">Responsável</div>
      <div className="row g-3">
        <div className="col-md-6"><Field label="Nome do responsável" name="responsavel" value={d.responsavel} onChange={chg} /></div>
        <div className="col-md-6"><Field label="Cargo"               name="cargo"       value={d.cargo}       onChange={chg} /></div>
        <div className="col-md-6"><Field label="Telefone"            name="telefone"    value={d.telefone}    onChange={chg} /></div>
        <div className="col-md-6"><Field label="E-mail"              name="email"       value={d.email}       onChange={chg} type="email" /></div>
      </div>
      <div className="divider" />
      <div className="field-group-title">Necessidade da Instituição</div>
      <div className="row g-3">
        <div className="col-md-4"><Field label="Câncer mais tratado"    name="cancer_mais_tratado" value={d.cancer_mais_tratado} onChange={chg} /></div>
        <div className="col-md-4"><Field label="Volume de pacientes"    name="volume_pacientes"    value={d.volume_pacientes}    onChange={chg} /></div>
        <div className="col-md-4">
          <Field label="Interesse na tecnologia" name="interesse" value={d.interesse} onChange={chg} as="select"
            options={['Alto','Médio','Baixo','Em negociação','Contrato ativo']} />
        </div>
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

export default function ClientePage() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [toast, setToast]     = useState(false)
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    getClientes().then((r) => setList(r.data)).catch(() => setError('Erro ao carregar clientes.')).finally(() => setLoading(false))
  }, [])

  const handleSave = async (d) => {
    try {
      if (d.id) { const r = await updateCliente(d.id, d); setList((p) => p.map((x) => x.id === d.id ? r.data : x)) }
      else       { const r = await createCliente(d);       setList((p) => [...p, r.data]) }
      setModal(null); setToast(true)
    } catch { setError('Erro ao salvar cliente.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta instituição?')) return
    try { await deleteCliente(id); setList((p) => p.filter((x) => x.id !== id)) }
    catch { setError('Erro ao excluir.') }
  }

  const filtered = list.filter((c) =>
    [c.nome, c.cidade, c.responsavel].some((f) => (f||'').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
        <div><div className="section-title">Clientes / Instituições</div><div className="section-sub">Hospitais, clínicas e laboratórios com interesse no Oncochip</div></div>
        <button className="btn-primary-custom" onClick={() => setModal('new')}><i className="bi bi-plus-lg" /> Nova instituição</button>
      </div>
      {error && <div className="alert mb-3" style={{ background:'rgba(180,30,30,.1)', border:'1px solid rgba(180,30,30,.3)', color:'var(--clr-danger)', borderRadius:10 }}><i className="bi bi-exclamation-triangle me-2" />{error}</div>}

      {list.length > 0 && (
        <div className="mb-3" style={{ maxWidth:340, position:'relative' }}>
          <i className="bi bi-search" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--clr-muted)', fontSize:'.85rem' }} />
          <input className="form-control" placeholder="Buscar por nome, cidade ou responsável…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft:36 }} />
        </div>
      )}

      <div className="card-dark">
        {loading ? <div style={{ color:'var(--clr-muted)', padding:40, textAlign:'center' }}>Carregando…</div>
        : filtered.length === 0 ? (
          <div className="empty-state"><i className="bi bi-hospital" /><p>{search ? 'Nenhum resultado.' : 'Nenhuma instituição cadastrada.'}</p>
            {!search && <button className="btn-ghost mt-3" onClick={() => setModal('new')}><i className="bi bi-plus-lg" /> Adicionar</button>}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-dark-custom">
              <thead><tr><th>Instituição</th><th>Tipo</th><th>Cidade / País</th><th>Responsável</th><th>Interesse</th><th></th></tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight:500 }}>{c.nome||'—'}</td>
                    <td><span className="tag tag-gray">{c.tipo||'—'}</span></td>
                    <td>{[c.cidade,c.pais].filter(Boolean).join(' / ')||'—'}</td>
                    <td>
                      <div>{c.responsavel||'—'}</div>
                      {c.cargo && <div style={{ fontSize:'.72rem', color:'var(--clr-muted)' }}>{c.cargo}</div>}
                    </td>
                    <td><span className={`tag ${TAG_INTERESSE[c.interesse]||'tag-gray'}`}>{c.interesse||'—'}</span></td>
                    <td><div className="d-flex gap-2">
                      <button className="btn-ghost btn-sm-edit" onClick={() => setModal(c)}><i className="bi bi-pencil" /> Editar</button>
                      <button className="btn-danger-ghost" onClick={() => handleDelete(c.id)}><i className="bi bi-trash" /> Excluir</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && <ClienteModal item={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {toast && <SaveToast onHide={() => setToast(false)} />}
    </div>
  )
}
