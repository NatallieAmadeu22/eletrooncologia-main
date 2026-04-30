import { useState, useEffect } from 'react'
import Field from '../components/Field'
import SaveToast from '../components/SaveToast'
import { getEmpresa, updateEmpresa } from '../services/api'

const EMPTY = { nome:'', area:'', pais:'', cidade:'', ano:'', missao:'', visao:'', valores:'', descricao:'', pesquisa:'', tecnologia:'', projetos:'', produtos:'', email:'', telefone:'', endereco:'', site:'' }

export default function EmpresaPage() {
  const [data, setData]     = useState(EMPTY)
  const [toast, setToast]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getEmpresa().then((r) => setData(r.data)).catch(() => setError('Erro ao carregar dados.')).finally(() => setLoading(false))
  }, [])

  const onChange = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }))
  const onSave = async () => {
    setSaving(true)
    try { await updateEmpresa(data); setToast(true) }
    catch { setError('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  if (loading) return <div style={{ color: 'var(--clr-muted)', padding: 40 }}>Carregando…</div>

  return (
    <div>
      <div className="section-title">Empresa</div>
      <div className="section-sub">Informações institucionais da Eletrooncologia</div>
      {error && <div className="alert mb-3" style={{ background: 'rgba(180,30,30,.1)', border: '1px solid rgba(180,30,30,.3)', color: 'var(--clr-danger)', borderRadius: 10 }}><i className="bi bi-exclamation-triangle me-2" />{error}</div>}

      <div className="card-dark">
        <div className="field-group-title">📋 Informações Institucionais</div>
        <div className="row g-3">
          <div className="col-md-6"><Field label="Nome da empresa" name="nome"   value={data.nome}   onChange={onChange} /></div>
          <div className="col-md-6"><Field label="Área de atuação" name="area"   value={data.area}   onChange={onChange} /></div>
          <div className="col-md-4"><Field label="País"            name="pais"   value={data.pais}   onChange={onChange} /></div>
          <div className="col-md-4"><Field label="Cidade"          name="cidade" value={data.cidade} onChange={onChange} /></div>
          <div className="col-md-4"><Field label="Ano de fundação" name="ano"    value={data.ano}    onChange={onChange} /></div>
        </div>
        <div className="divider" />
        <div className="field-group-title">🎯 Descrição da Empresa</div>
        <div className="row g-3">
          <div className="col-md-6"><Field label="Missão"                  name="missao"    value={data.missao}    onChange={onChange} as="textarea" /></div>
          <div className="col-md-6"><Field label="Visão"                   name="visao"     value={data.visao}     onChange={onChange} as="textarea" /></div>
          <div className="col-md-6"><Field label="Valores"                 name="valores"   value={data.valores}   onChange={onChange} as="textarea" /></div>
          <div className="col-md-6"><Field label="Descrição institucional" name="descricao" value={data.descricao} onChange={onChange} as="textarea" /></div>
        </div>
        <div className="divider" />
        <div className="field-group-title">🔬 Inovação e Tecnologia</div>
        <div className="row g-3">
          <div className="col-md-6"><Field label="Área de pesquisa"       name="pesquisa"   value={data.pesquisa}   onChange={onChange} /></div>
          <div className="col-md-6"><Field label="Tipo de tecnologia"     name="tecnologia" value={data.tecnologia} onChange={onChange} /></div>
          <div className="col-md-6"><Field label="Projetos ativos"        name="projetos"   value={data.projetos}   onChange={onChange} as="textarea" /></div>
          <div className="col-md-6"><Field label="Produtos desenvolvidos" name="produtos"   value={data.produtos}   onChange={onChange} as="textarea" /></div>
        </div>
        <div className="divider" />
        <div className="field-group-title">📞 Contato</div>
        <div className="row g-3">
          <div className="col-md-6"><Field label="E-mail institucional" name="email"    value={data.email}    onChange={onChange} type="email" /></div>
          <div className="col-md-6"><Field label="Telefone"             name="telefone" value={data.telefone} onChange={onChange} /></div>
          <div className="col-md-6"><Field label="Endereço"             name="endereco" value={data.endereco} onChange={onChange} /></div>
          <div className="col-md-6"><Field label="Site oficial"         name="site"     value={data.site}     onChange={onChange} /></div>
        </div>
        <div className="divider" />
        <div className="d-flex justify-content-end">
          <button className="btn-primary-custom" onClick={onSave} disabled={saving}>
            {saving ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }} /> Salvando…</> : <><i className="bi bi-floppy" /> Salvar alterações</>}
          </button>
        </div>
      </div>
      {toast && <SaveToast onHide={() => setToast(false)} />}
    </div>
  )
}
