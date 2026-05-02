import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

function HomePage() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('Supabase connected:', data)
    })
  }, [])

  return <div>Home Page</div>
}
export default HomePage