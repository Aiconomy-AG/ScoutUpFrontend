const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const TOKEN_STORAGE_KEY = 'scoutup_token'

export const getStoredToken = () => {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export const setStoredToken = (token) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const removeStoredToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const getApiErrorMessage = async (response) => {
    try {
        const errorData = await response.json()

        if (response.status === 422 && errorData.errors) {
            return Object.values(errorData.errors).flat().join(' ')
        }

        if (errorData.message) {
            return errorData.message
        }
    } catch {
        return `Request failed with status ${response.status}`
    }

    return `Request failed with status ${response.status}`
}

export const requestJson = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`
    const token = getStoredToken()

    const headers = {
        Accept: 'application/json',
        ...(options.headers ?? {}),
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const errorMessage = await getApiErrorMessage(response)

        if (response.status === 401) {
            removeStoredToken()
        }

        throw new Error(errorMessage)
    }

    if (response.status === 204) {
        return null
    }

    const contentType = response.headers.get('content-type')

    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Received non-JSON response:', text)
        throw new Error(`Server did not return JSON for ${endpoint}. Check the API route.`)
    }

    return response.json()
}