const calendarBody = document.getElementById('calendar-body');
const monthName = document.getElementById('month-name');
const yearSpan = document.getElementById('year');
const compList = document.getElementById('comp-list');

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function updateHeader() {
    monthName.textContent = monthNames[currentMonth];
    yearSpan.textContent = currentYear;
}

// === FUNÇÕES DE REDE ===

// Buscar compromissos no banco
async function fetchCompromissos() {
    const res = await fetch("http://localhost:3030/compromissos");
    return await res.json();
}

// Adicionar compromisso no banco
async function addCompromisso(day, month, year) {
    const descricao = prompt(`Digite o compromisso para ${day}/${month + 1}/${year}:`);
    if (!descricao) return;

    // Converte a data para formato YYYY-MM-DD (MySQL)
    const dataISO = new Date(year, month, day).toISOString().split("T")[0];
    console.log(dataISO);
    await fetch("http://localhost:3030/compromissos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataISO, descricao })
    });

    renderCompromissos();
}

// Excluir compromisso no banco
async function deleteCompromisso(id) {
    if (confirm("Tem certeza que deseja excluir este compromisso?")) {
        await fetch(`http://localhost:3030/compromissos/${id}`, { method: "DELETE" });
        renderCompromissos();
    }
}

// === INTERFACE ===

// Mostrar lista de compromissos
async function renderCompromissos() {
    const compromissos = await fetchCompromissos();
    compList.innerHTML = "";

    compromissos.forEach(comp => {
        const li = document.createElement("li");
        const dataFormatada = new Date(comp.data).toLocaleDateString("pt-BR");

        li.innerHTML = `
            ${dataFormatada}: ${comp.descricao}
            <button class="delete-btn" onclick="deleteCompromisso(${comp.id})">Excluir</button>
        `;

        compList.appendChild(li);
    });
}

// Gerar o calendário
function generateCalendar(month, year) {
    calendarBody.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                cell.textContent = "";
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.textContent = date;

                const dia = date;

                // Adiciona evento de clique
                cell.addEventListener("click", () => addCompromisso(dia, month, year));

                // Destaca o dia atual
                if (
                    date === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear()
                ) {
                    cell.style.backgroundColor = "#A7BBAF";
                    cell.style.fontWeight = "bold";
                }

                date++;
            }
            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }
}

// === EXECUÇÃO INICIAL ===
updateHeader();
generateCalendar(currentMonth, currentYear);
renderCompromissos();
