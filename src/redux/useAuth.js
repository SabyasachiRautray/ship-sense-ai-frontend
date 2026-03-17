import { useSelector, useDispatch } from 'react-redux'
import { logout } from './store'

export function useAuth() {
  const dispatch = useDispatch()
  const user     = useSelector((state) => state.auth.user)
  const token    = useSelector((state) => state.auth.token)
  const partner  = useSelector((state) => state.auth.partner)

  return {
    user,
    token,
    partner,
    isLoggedIn: !!token,
    isAdmin:    user?.user_type === 'admin',
    isPartner:  !!partner,
    isUser:     !!user && !partner,
    logout:     () => dispatch(logout()),
  }
}