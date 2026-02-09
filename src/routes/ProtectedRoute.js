import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AUTH_TOKEN } from 'constants/AuthConstant'

/** Захищений маршрут: якщо немає токена — редірект на логін. */
const ProtectedRoute = () => {
	const token = useSelector((state) => state.auth?.token) ?? localStorage.getItem(AUTH_TOKEN)
	const location = useLocation()

	if (!token) {
		return <Navigate to="/auth/login" state={{ from: location }} replace />
	}

	return <Outlet />
}

export default ProtectedRoute