document.getElementById("fileInput").addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileList = document.getElementById("fileList");

    // Criar preview local
    const fileURL = URL.createObjectURL(file);
    const fileCard = document.createElement("div");
    fileCard.classList.add("card", "file-card");

    const fileName = document.createElement("span");
    fileName.textContent = file.name;

    const fileDate = document.createElement("span");
    fileDate.textContent = new Date().toLocaleDateString("pt-BR");

    fileCard.appendChild(fileName);
    fileCard.appendChild(fileDate);

    fileCard.addEventListener("click", () => {
        window.open(fileURL, "_blank");
    });

    fileList.appendChild(fileCard);

    // Enviar arquivo para o backend usando FormData
    const formData = new FormData();
    formData.append("arquivo", file);

    try {
        const res = await fetch("http://localhost:3030/remedios", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!data.success) {
            alert("Erro ao salvar remédio no banco.");
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao conectar ao servidor.");
    }

    // Permite re-selecionar o mesmo arquivo
    event.target.value = "";
});

// ================= LISTAR REMÉDIOS =================
async function carregarRemedios() {
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    try {
        const res = await fetch("http://localhost:3030/remedios");
        const dados = await res.json();

        dados.forEach(remedio => {
            const card = document.createElement("div");
            card.classList.add("card", "file-card");

            const nomeArquivo = document.createElement("span");
            nomeArquivo.textContent = remedio.arquivo;

            const dataSpan = document.createElement("span");
            dataSpan.textContent = new Date().toLocaleDateString("pt-BR");

            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.classList.add("btn-delete");

            btnExcluir.addEventListener("click", async (event) => {
                event.stopPropagation();

                if (!confirm("Deseja realmente excluir este remédio?")) return;

                try {
                    const res = await fetch(`http://localhost:3030/remedios/${remedio.id}`, {
                        method: "DELETE"
                    });

                    const data = await res.json();

                    if (data.success) {
                        carregarRemedios();
                    } else {
                        alert("Erro ao excluir.");
                    }

                } catch (error) {
                    alert("Erro ao conectar ao servidor.");
                }
            });

            card.addEventListener("click", () => {
                window.open("http://localhost:3030/uploads/" + remedio.arquivo, "_blank");
            });

            card.appendChild(nomeArquivo);
            card.appendChild(dataSpan);
            card.appendChild(btnExcluir);

            fileList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar lista de remédios.");
    }
}

// ================= CARREGAR AO ABRIR A PÁGINA =================
window.onload = carregarRemedios;