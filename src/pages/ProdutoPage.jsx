import { useState, useEffect } from 'react'
import Field from '../components/Field'
import Modal from '../components/Modal'
import SaveToast from '../components/SaveToast'
import { getProdutos, createProduto, updateProduto, deleteProduto } from '../services/api'

const EMPTY = () => ({
  nome: '', empresa: 'Eletrooncologia', categoria: '', versao: '',
  finalidade: '', problema: '', tecnologia: '', diferenciais: '',
  diagnostico: '', tempo_diagnostico: '', procedimento: '', tempo_tratamento: '',
  aceleracao: '', diagnostico_precoce: '', reducao_custos: '', precisao: '',
})

function ProdutoModal({ item, onClose, onSave }) {
  const [d, setD] = useState(item ?? EMPTY())
  const [saving, setSaving] = useState(false)
  const chg = (e) => setD((p) => ({ ...p, [e.target.name]: e.target.value }))
  const handleSave = async () => { setSaving(true); await onSave(d); setSaving(false) }

  return (
    <Modal title={item ? 'Editar Produto' : 'Novo Produto'} subtitle="Oncochip e dispositivos desenvolvidos" onClose={onClose}>
      <div className="field-group-title">Informações Básicas</div>
      <div className="row g-3">
        <div className="col-md-6"><Field label="Nome do produto" name="nome" value={d.nome} onChange={chg} required /></div>
        <div className="col-md-6"><Field label="Empresa desenvolvedora" name="empresa" value={d.empresa} onChange={chg} /></div>
        <div className="col-md-6">
          <Field label="Categoria" name="categoria" value={d.categoria} onChange={chg} as="select"
            options={['Dispositivo médico','Software médico','Plataforma diagnóstica','Nanodispositivo']} />
        </div>
        <div className="col-md-6"><Field label="Versão do dispositivo" name="versao" value={d.versao} onChange={chg} /></div>
      </div>
      <div className="divider" />
      <div className="field-group-title">Descrição do Produto</div>
      <div className="row g-3">
        <div className="col-md-6"><Field label="Finalidade do dispositivo"  name="finalidade"   value={d.finalidade}   onChange={chg} as="textarea" /></div>
        <div className="col-md-6"><Field label="Problema que resolve"       name="problema"     value={d.problema}     onChange={chg} as="textarea" /></div>
        <div className="col-md-6"><Field label="Descrição da tecnologia"    name="tecnologia"   value={d.tecnologia}   onChange={chg} as="textarea" /></div>
        <div className="col-md-6"><Field label="Diferenciais do produto"    name="diferenciais" value={d.diferenciais} onChange={chg} as="textarea" /></div>
      </div>
      <div className="divider" />
      <div className="field-group-title">Características Técnicas</div>
      <div className="row g-3">
        <div className="col-md-6"><Field label="Tipo de diagnóstico"          name="diagnostico"       value={d.diagnostico}       onChange={chg} /></div>
        <div className="col-md-6"><Field label="Tempo médio de diagnóstico"   name="tempo_diagnostico" value={d.tempo_diagnostico} onChange={chg} /></div>
        <div className="col-md-6">
          <Field label="Tipo de procedimento" name="procedimento" value={d.procedimento} onChange={chg} as="select"
            options={['Indolor','Minimamente invasivo','Invasivo']} />
        </div>
        <div className="col-md-6"><Field label="Tempo estimado de tratamento" name="tempo_tratamento" value={d.tempo_tratamento} onChange={chg} /></div>
      </div>
      <div className="divider" />
      <div className="field-group-title">Benefícios</div>
      <div className="row g-3">
        <div className="col-md-6"><Field label="Aceleração do processo de cura"  name="aceleracao"          value={d.aceleracao}          onChange={chg} /></div>
        <div className="col-md-6"><Field label="Diagnóstico precoce"             name="diagnostico_precoce" value={d.diagnostico_precoce} onChange={chg} /></div>
        <div className="col-md-6"><Field label="Redução de custos hospitalares"  name="reducao_custos"      value={d.reducao_custos}      onChange={chg} /></div>
        <div className="col-md-6"><Field label="Maior precisão médica"           name="precisao"            value={d.precisao}            onChange={chg} /></div>
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

export default function ProdutoPage() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [toast, setToast]     = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getProdutos().then((r) => setList(r.data)).catch(() => setError('Erro ao carregar produtos.')).finally(() => setLoading(false))
  }, [])

  const handleSave = async (d) => {
    try {
      if (d.id) { const r = await updateProduto(d.id, d); setList((p) => p.map((x) => x.id === d.id ? r.data : x)) }
      else       { const r = await createProduto(d);       setList((p) => [...p, r.data]) }
      setModal(null); setToast(true)
    } catch { setError('Erro ao salvar produto.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este produto?')) return
    try { await deleteProduto(id); setList((p) => p.filter((x) => x.id !== id)) }
    catch { setError('Erro ao excluir.') }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
        <div><div className="section-title">Produto — Oncochip</div><div className="section-sub">Dispositivos e tecnologias desenvolvidas</div></div>
        <button className="btn-primary-custom" onClick={() => setModal('new')}><i className="bi bi-plus-lg" /> Novo produto</button>
      </div>
      {error && <div className="alert mb-3" style={{ background:'rgba(180,30,30,.1)', border:'1px solid rgba(180,30,30,.3)', color:'var(--clr-danger)', borderRadius:10 }}><i className="bi bi-exclamation-triangle me-2" />{error}</div>}
      <div className="card-dark">
        {loading ? <div style={{ color:'var(--clr-muted)', padding:40, textAlign:'center' }}>Carregando…</div>
        : list.length === 0 ? (
          <div className="empty-state"><i className="bi bi-cpu" /><p>Nenhum produto cadastrado.</p>
            <button className="btn-ghost mt-3" onClick={() => setModal('new')}><i className="bi bi-plus-lg" /> Adicionar</button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-dark-custom">
              <thead><tr><th>Nome</th><th>Categoria</th><th>Versão</th><th>Procedimento</th><th></th></tr></thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight:500 }}>{p.nome||'—'}</td>
                    <td><span className="tag tag-blue">{p.categoria||'—'}</span></td>
                    <td>{p.versao||'—'}</td>
                    <td><span className="tag tag-green">{p.procedimento||'—'}</span></td>
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
      {modal && <ProdutoModal item={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {toast && <SaveToast onHide={() => setToast(false)} />}
    </div>
  )
}
