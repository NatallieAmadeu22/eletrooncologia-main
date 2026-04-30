import { useEffect } from 'react'

export default function SaveToast({ message = 'Salvo com sucesso!', onHide, duration = 2500 }) {
  useEffect(() => {
    const t = setTimeout(onHide, duration)
    return () => clearTimeout(t)
  }, [onHide, duration])

  return (
    <div className="save-toast">
      <i className="bi bi-check2-circle" />
      {message}
    </div>
  )
}
