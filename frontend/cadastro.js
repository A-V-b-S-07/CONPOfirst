const form = document.getElementById('cadastroForm')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const password = document.getElementById("senha").value;

    const response = await fetch('http://localhost:3030/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, cpf, numero, password })
    })
    console.log(response);
    const results = await response.json()

    if (results.success) {
        alert('cadastro bem sucedido')
        window.location.href = 'loginum.html'
    } else {
        alert('Falta alguma informação')
    }

})

