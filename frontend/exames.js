// ================= LISTAR EXAMES =================
async function carregarExames() {
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    try {
        const res = await fetch("http://localhost:3030/exames");
        const dados = await res.json();

        dados.forEach(exame => {
            const card = document.createElement("div");
            card.classList.add("card", "file-card");

            const nomeArquivo = document.createElement("span");
            nomeArquivo.textContent = exame.arquivo;

            const dataSpan = document.createElement("span");
            dataSpan.textContent = new Date().toLocaleDateString("pt-BR");

            // 🔴 BOTÃO EXCLUIR
            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.classList.add("btn-delete");

            btnExcluir.addEventListener("click", async (event) => {
                event.stopPropagation(); // impede abrir o arquivo

                if (!confirm("Deseja realmente excluir este exame?")) return;

                try {
                    const res = await fetch(`http://localhost:3030/exames/${exame.id}`, {
                        method: "DELETE"
                    });

                    const data = await res.json();

                    if (data.success) {
                        carregarExames();
                    } else {
                        alert("Erro ao excluir exame.");
                    }

                } catch (error) {
                    console.error(error);
                    alert("Erro ao conectar ao servidor.");
                }
            });

            // Abrir arquivo ao clicar no card
            card.addEventListener("click", () => {
                window.open("http://localhost:3030/uploads/" + exame.arquivo, "_blank");
            });

            card.appendChild(nomeArquivo);
            card.appendChild(dataSpan);
            card.appendChild(btnExcluir);
            fileList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lista de exames.");
    }
}

// ================= UPLOAD DE EXAMES =================
document.getElementById("fileInput").addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("arquivo", file);

    try {
        const res = await fetch("http://localhost:3030/exames", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            carregarExames(); // Atualiza lista automaticamente
        } else {
            alert("Erro ao salvar arquivo.");
        }

    } catch (error) {
        alert("Erro ao conectar ao servidor.");
        console.error(error);
    }

    event.target.value = ""; // Reseta input
});

// ================= CARREGAR AO ABRIR =================
window.onload = carregarExames;