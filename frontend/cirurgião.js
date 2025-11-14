// index.js - envia dados do cirurgião para o servidor
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surgeonForm');
  const msg = document.getElementById('message');

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      specialties: document.getElementById('specialties').value.trim(),
      address: document.getElementById('address').value.trim(),
      hours: document.getElementById('hours').value.trim()
    };

    try {
      const res = await fetch('/api/surgeons', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Falha ao salvar');

      const j = await res.json();
      msg.textContent = 'Informações salvas com sucesso!';
      form.reset();
    } catch (err) {
      console.error(err);
      msg.textContent = 'Erro ao salvar. Verifique o servidor.';
      msg.style.color = 'crimson';
    }
  });
});
