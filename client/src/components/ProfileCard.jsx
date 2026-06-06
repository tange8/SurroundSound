import ProfileEditForm from './ProfileEditForm'

function ProfileCard({
                       profile,
                       editing, setEditing,
                       uploadingAvatar, onAvatarUpload,
                       editDisplayName, setEditDisplayName,
                       editUsername, setEditUsername,
                       editLocation, setEditLocation,
                       editBio, setEditBio,
                       onSave, saving, saveError, setSaveError,
                     }) {
  const displayLabel = profile?.display_name || profile?.username || 'Anonymous'
  const initial = displayLabel[0]?.toUpperCase() || '?'

  return (
      <div className="rounded-2xl overflow-hidden" style={{
        border: '1.5px solid transparent',
        backgroundImage: 'linear-gradient(#000013, #000013), linear-gradient(to bottom, #FF3831, #FF3831)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}>
        <div className="px-6 pb-6 pt-6 h-full">

          {/* Avatar row */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden" style={{ border: '2px solid #FF3831' }}>
                {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center font-display font-bold text-2xl"
                        style={{ background: 'linear-gradient(135deg, #4133FF, #A100FF)', color: '#CCD0FF' }}
                    >
                      {initial}
                    </div>
                )}
              </div>
              <label
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-xs font-bold"
                  style={{ background: '#FF3831', color: '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#cc2d27'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FF3831'}
                  title="Change photo"
              >
                {uploadingAvatar ? '…' : '✎'}
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>

            {!editing && (
                <button
                    onClick={() => setEditing(true)}
                    className="font-body text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                    style={{ background: '#4133FF', color: '#CCD0FF' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#5544ff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#4133FF'}
                >
                  Edit profile
                </button>
            )}
          </div>

          {/* Edit form or display */}
          {editing ? (
              <ProfileEditForm
                  editDisplayName={editDisplayName} setEditDisplayName={setEditDisplayName}
                  editUsername={editUsername} setEditUsername={setEditUsername}
                  editLocation={editLocation} setEditLocation={setEditLocation}
                  editBio={editBio} setEditBio={setEditBio}
                  onSave={onSave}
                  onCancel={() => { setEditing(false); setSaveError(null) }}
                  saving={saving}
                  saveError={saveError}
              />
          ) : (
              <>
                <h1 className="font-display font-bold text-2xl" style={{ color: '#CCD0FF' }}>{displayLabel}</h1>
                {profile?.username && (
                    <p className="font-body text-sm mt-0.5" style={{ color: '#8890cc' }}>@{profile.username}</p>
                )}
                {profile?.location && (
                    <p className="font-body text-xs mt-2 flex items-center gap-1" style={{ color: '#F9A1F8' }}>
                      <span>📍</span>{profile.location}
                    </p>
                )}
                <p className="font-body text-sm mt-3 leading-relaxed" style={{ color: '#8890cc' }}>
                  {profile?.bio || (
                      <span style={{ color: '#4a5080', fontStyle: 'italic' }}>No bio yet — click Edit profile to add one.</span>
                  )}
                </p>
              </>
          )}
        </div>
      </div>
  )
}

export default ProfileCard