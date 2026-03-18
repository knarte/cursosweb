const API = "https://cursosweb-ten.vercel.app//api/register"
const form = document.getElementById("registerForm")
const errorMessage = document.getElementById("errorMessage")
const successMessage = document.getElementById("successMessage")
const passwordStrength = document.getElementById("passwordStrength")

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
        button.textContent = '⏳ Creando cuenta...'
        button.disabled = true
        inputs.forEach(input => input.disabled = true)
    } else {
        button.textContent = '✨ Crear Cuenta'
        button.disabled = false
        inputs.forEach(input => input.disabled = false)
    }
}

function checkPasswordStrength(password) {
    let strength = 0
    let feedback = []

    if (password.length >= 8) strength++
    else feedback.push('Al menos 8 caracteres')

    if (/[a-z]/.test(password)) strength++
    else feedback.push('Una letra minúscula')

    if (/[A-Z]/.test(password)) strength++
    else feedback.push('Una letra mayúscula')

    if (/[0-9]/.test(password)) strength++
    else feedback.push('Un número')

    if (/[^A-Za-z0-9]/.test(password)) strength++
    else feedback.push('Un carácter especial')

    return { strength, feedback }
}

function updatePasswordStrength() {
    const password = form.password.value
    if (password.length === 0) {
        passwordStrength.style.display = 'none'
        return
    }

    const { strength, feedback } = checkPasswordStrength(password)
    passwordStrength.style.display = 'block'

    let strengthText = ''
    let strengthClass = ''

    if (strength < 3) {
        strengthText = 'Débil: ' + feedback.join(', ')
        strengthClass = 'strength-weak'
    } else if (strength < 4) {
        strengthText = 'Media: ' + feedback.join(', ')
        strengthClass = 'strength-medium'
    } else {
        strengthText = 'Fuerte ✓'
        strengthClass = 'strength-strong'
    }

    passwordStrength.textContent = strengthText
    passwordStrength.className = 'password-strength ' + strengthClass
}

form.password.addEventListener('input', updatePasswordStrength)

form.addEventListener("submit", async e => {
    e.preventDefault()

    // Limpiar mensajes anteriores
    errorMessage.style.display = 'none'
    successMessage.style.display = 'none'

    // Validar campos
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const password = form.password.value.trim()

    if (!name || !email || !password) {
        showMessage(errorMessage, 'Por favor, completa todos los campos.')
        return
    }

    if (name.length < 2) {
        showMessage(errorMessage, 'El nombre debe tener al menos 2 caracteres.')
        return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        showMessage(errorMessage, 'Por favor, ingresa un correo electrónico válido.')
        return
    }

    if (password.length < 6) {
        showMessage(errorMessage, 'La contraseña debe tener al menos 6 caracteres.')
        return
    }

    const { strength } = checkPasswordStrength(password)
    if (strength < 3) {
        showMessage(errorMessage, 'La contraseña es demasiado débil. Usa mayúsculas, minúsculas, números y símbolos.')
        return
    }

    setLoading(true)

    try {
        const data = { name, email, password }

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
            showMessage(successMessage, '¡Cuenta creada exitosamente! Redirigiendo...', 'success')

            setTimeout(() => {
                window.location = "success.html"
            }, 1500)
        } else {
            showMessage(errorMessage, result.message || 'Error al crear la cuenta. El correo ya puede estar registrado.')
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