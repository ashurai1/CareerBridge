import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import apiService from '../services/api'

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token')
        if (token) {
            apiService.setToken(token)
            navigate('/dashboard')
        } else {
            navigate('/')
        }
    }, [searchParams, navigate])

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
            <h2>Logging you in...</h2>
        </div>
    )
}

export default OAuthSuccess
