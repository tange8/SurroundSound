import EditField from './EditField'

function ProfileEditForm({
  editDisplayName, setEditDisplayName,
  editUsername, setEditUsername,
  editLocation, setEditLocation,
  editBio, setEditBio,
  onSave, onCancel,
  saving, saveError,
}) {
  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="grid grid-cols-2 gap-3">
        <EditField label="Display Name" value={editDisplayName} onChange={setEditDisplayName} placeholder="Display name" />
        <EditField label="Username" value={editUsername} onChange={setEditUsername} placeholder="username" />
      </div>
      <EditField label="Location" value={editLocation} onChange={setEditLocation} placeholder="City, State" />
      <EditField label="Bio" value={editBio} onChange={setEditBio} placeholder="Tell people about yourself…" multiline />
      {saveError && <p className="font-body text-xs" style={{ color: '#FF3831' }}>{saveError}</p>}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={saving}
          className="font-body px-5 py-2 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
          style={{ background: '#FF3831', color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#cc2d27'}
          onMouseLeave={e => e.currentTarget.style.background = '#FF3831'}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button
          onClick={onCancel}
          className="font-body px-5 py-2 rounded-full text-sm font-semibold transition-colors"
          style={{ background: '#000013', color: '#CCD0FF', border: '1px solid #4133FF' }}
          onMouseEnter={e => e.currentTarget.style.background = '#0a0030'}
          onMouseLeave={e => e.currentTarget.style.background = '#000013'}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ProfileEditForm
