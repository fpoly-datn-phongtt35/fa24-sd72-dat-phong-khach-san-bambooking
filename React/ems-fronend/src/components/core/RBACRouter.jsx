import { Navigate, Outlet } from 'react-router-dom'
import { usePermission } from '../../hooks/userPermisstion'
import { roles } from '../../config/rbacConfig'
import Cookies from 'js-cookie'


function RBACRouter({ requiredPermission, redirectTo = '/access-denied' }) {
    const userRole = Cookies.get('role') || roles.ADMIN

    const { hasPermission } = usePermission(userRole)

    if (!hasPermission(requiredPermission)) {
        alert('Bạn không có quyền truy cập vào trang này')
        return <Navigate to={redirectTo} replace={true} />
    }
    return <Outlet />
}

export default RBACRouter
