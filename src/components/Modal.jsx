export default function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div>
            <div className="modal-title">{title}</div>
            {subtitle && <div className="modal-subtitle">{subtitle}</div>}
          </div>
          <button className="btn-ghost" style={{ padding: '6px 10px', fontSize: '.9rem' }} onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
