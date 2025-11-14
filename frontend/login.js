document.getElementById("loginForm").addEventListener("submit", async function(event){
    event.preventDefault();

    const dados = {
        email: document.getElementById("email").value,
        password: document.getElementById("senha").value
    };

    const resposta = await fetch("http://localhost:3030/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (resultado.success) {
    alert("Login bem-sucedido!");
    // Salva no localStorage para manter o tipo do usuário
    // Redirecionamento para página inicial
    window.location.href = "../frontend/home.html";
  } else {
    alert("Usuário ou senha incorretos!");
  }
});
