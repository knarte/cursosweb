const API = "https://cursosweb-ten.vercel.app/api/courses"

const token = localStorage.getItem("token")

const form = document.getElementById("courseForm")
const container = document.getElementById("courses")

async function getCourses() {
  try {
    const res = await fetch(API)
    const data = await res.json()
    container.innerHTML = ""

    if (data.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: #999; padding: 40px; grid-column: 1/-1;">No hay cursos aún. ¡Crea el primero! 🎉</div>'
      return
    }

    data.forEach((c, index) => {
      const card = document.createElement("div")
      card.className = "card"
      card.style.animationDelay = `${index * 0.1}s`
      card.innerHTML = `
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <div class="footer">
          <button onclick="deleteCourse('${c._id}')">🗑️ Eliminar</button>
          <span>👨‍🏫 <i>${c.instructor}</i></span>        
        </div>
      `
      container.appendChild(card)
    })
  } catch (error) {
    console.error("Error cargando cursos:", error)
    container.innerHTML = '<div style="text-align: center; color: #f5576c; padding: 40px;">Error al cargar los cursos</div>'
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault()

  const submitBtn = form.querySelector("button")
  const originalText = submitBtn.textContent
  submitBtn.textContent = "⏳ Creando..."
  submitBtn.disabled = true

  try {
    const data = Object.fromEntries(new FormData(form))

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      form.reset()
      await getCourses()
      submitBtn.textContent = "✅ ¡Creado!"
      setTimeout(() => {
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 2000)
    } else {
      throw new Error("Error al crear el curso")
    }
  } catch (error) {
    console.error("Error:", error)
    submitBtn.textContent = "❌ Error"
    setTimeout(() => {
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }, 2000)
  }
})

async function deleteCourse(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
    try {
      const res = await fetch(API + "/" + id, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      if (res.ok) {
        await getCourses()
      } else {
        alert("Error al eliminar el curso")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar el curso")
    }
  }
}

// Cargar cursos al iniciar
getCourses()