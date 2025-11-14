// === FUNÇÃO PARA SALVAR A FICHA DO USUÁRIO ===
async function salvarDados() {
    const nome = document.getElementById("nome").value;
    const nascimento = document.getElementById("nascimento").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;

    const tipo = document.getElementById("tipo").value;
    const alergias = document.getElementById("alergias").value;
    const complicacoes = document.getElementById("complicacoes").value;

    if (!nome || !nascimento || !email || !telefone || !tipo) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const ficha = {
        nome,
        data_nascimento: nascimento,
        email,
        numero: telefone,
        sangue: tipo,
        alergias,
        complicacoes
    };

    try {
        const res = await fetch("http://localhost:3030/fichas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ficha)
        });

        const data = await res.json();

        if (data.success) {
            alert("Ficha salva com sucesso!");
        } else {
            alert("Erro ao salvar ficha.");
        }

    } catch (err) {
        console.error(err);
        alert("Erro ao conectar ao servidor.");
    }
}