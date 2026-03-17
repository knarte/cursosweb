const API = "https://cursoswebonline.vercel.app/api/login"
const form = document.getElementById("loginForm")
const errorMessage = document.getElementById("errorMessage")
const successMessage = document.getElementById("successMessage")

function showMessage(element, message, type = 'error') {
    element.textContent = message
    element.style.display = 'block'
    element.className = type === 'error' ? 'error-message' : 'success-message'

    setTimeout(() => {
        element.style.display = 'none'
    }, 5000)
}

function setLoading(loading) {
    const button = form.querySelector('button')
    const inputs = form.querySelectorAll('input')

    if (loading) {
        button.textContent = '⏳ Iniciando sesión...'
        button.disabled = true
        inputs.forEach(input => input.disabled = true)
    } else {
        button.textContent = '🚀 Iniciar Sesión'
        button.disabled = false
        inputs.forEach(input => input.disabled = false)
    }
}

form.addEventListener("submit", async e => {
    e.preventDefault()

    // Limpiar mensajes anteriores
    errorMessage.style.display = 'none'
    successMessage.style.display = 'none'

    // Validar campos
    const email = form.email.value.trim()
    const password = form.password.value.trim()

    if (!email || !password) {
        showMessage(errorMessage, 'Por favor, completa todos los campos.')
        return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        showMessage(errorMessage, 'Por favor, ingresa un correo electrónico válido.')
        return
    }

    setLoading(true)

    try {
        const data = { email, password }

        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await res.json()

        if (res.ok && result.token) {
            localStorage.setItem("token", result.token)
            showMessage(successMessage, '¡Inicio de sesión exitoso! Redirigiendo...', 'success')

            setTimeout(() => {
                window.location = "dashboard.html"
            }, 1500)
        } else {
            showMessage(errorMessage, result.message || 'Error al iniciar sesión. Verifica tus credenciales.')
        }
    } catch (error) {
        console.error("Error:", error)
        showMessage(errorMessage, 'Error de conexión. Inténtalo de nuevo más tarde.')
    } finally {
        setLoading(false)
    }
})

// Limpiar mensajes al hacer focus en inputs
form.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        errorMessage.style.display = 'none'
        successMessage.style.display = 'none'
    })
})