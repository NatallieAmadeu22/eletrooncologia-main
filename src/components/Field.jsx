export default function Field({ label, name, value, onChange, type = 'text', as = 'input', options = [], placeholder = '', required = false }) {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label}
        {required && <span style={{ color: 'var(--clr-danger)', marginLeft: 3 }}>*</span>}
      </label>
      {as === 'textarea' && (
        <textarea className="form-control" rows={3} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} />
      )}
      {as === 'select' && (
        <select className="form-select" name={name} value={value} onChange={onChange} required={required}>
          <option value="">Selecione…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {as === 'input' && (
        <input className="form-control" type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} />
      )}
    </div>
  )
}
