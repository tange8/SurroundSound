function EditField({ label, value, onChange, placeholder, multiline }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: '#8890cc' }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-body rounded-lg px-3 py-2 text-sm resize-none outline-none"
          style={{ background: '#000013', border: '1px solid #4133FF', color: '#CCD0FF' }}
          onFocus={e => e.target.style.borderColor = '#A100FF'}
          onBlur={e => e.target.style.borderColor = '#4133FF'}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-body rounded-lg px-3 py-2 text-sm outline-none"
          style={{ background: '#000013', border: '1px solid #4133FF', color: '#CCD0FF' }}
          onFocus={e => e.target.style.borderColor = '#A100FF'}
          onBlur={e => e.target.style.borderColor = '#4133FF'}
        />
      )}
    </div>
  )
}

export default EditField
