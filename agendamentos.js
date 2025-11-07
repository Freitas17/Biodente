document.addEventListener("DOMContentLoaded", () => {
  const proximosContainer = document.getElementById("proximos");
  const historicoContainer = document.getElementById("historico");
  const noProximos = document.getElementById("no-proximos");
  const noHistorico = document.getElementById("no-historico");

  // --- 1. FUNÇÃO PRINCIPAL: Carregar e Exibir Agendamentos ---
  const loadAppointments = () => {
    // Limpa os containers antes de adicionar
    proximosContainer.innerHTML = "";
    historicoContainer.innerHTML = "";

    const appointments =
      JSON.parse(localStorage.getItem("biodenteAppointments")) || [];
    const now = new Date();

    let proximosCount = 0;
    let historicoCount = 0;

    // Ordena: mais novos (futuros) primeiro, mais recentes (passados) primeiro
    appointments.sort((a, b) => new Date(b.dataISO) - new Date(a.dataISO));

    appointments.forEach((app) => {
      const appDate = new Date(app.dataISO);

      // Formata a data para exbição ("Qui, 13 de Nov")
      const displayDate = appDate.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });

      // Verifica se é passado ou futuro
      const isPast = appDate < now;

      const cardHtml = `
                        <div class="appointment-card ${
                          isPast ? "past" : ""
                        }" data-id="${app.id}">
                            <div class="appointment-info">
                                <div class="date">${displayDate}<br>${
        app.hora
      }</div>
                                <div class="details">
                                    <span>${app.servico}</span>
                                    <small>Profissional: ${
                                      app.profissional
                                    } | Status: ${
        isPast ? "Realizado" : "Confirmado"
      }</small>
                                </div>
                            </div>
                            <div class="appointment-actions">
                                ${
                                  isPast
                                    ? '<button class="btn btn-primary-outline btn-ver-exames" data-id="${app.id}">Ver Exames</button>'
                                    : `<button class="btn btn-primary-outline btn-remarcar" data-id="${app.id}">Remarcar</button>
                                     <button class="btn btn-danger-outline btn-cancelar" data-id="${app.id}">Cancelar</button>`
                                }
                            </div>
                        </div>
                    `;

      if (isPast) {
        historicoContainer.insertAdjacentHTML("beforeend", cardHtml);
        historicoCount++;
      } else {
        proximosContainer.insertAdjacentHTML("beforeend", cardHtml);
        proximosCount++;
      }
    });

    // Mostra mensagens se estiver vazio
    noProximos.style.display = proximosCount === 0 ? "block" : "none";
    noHistorico.style.display = historicoCount === 0 ? "block" : "none";

    // Adiciona os event listeners aos botões recém-criados
    addCardListeners();
  };

  // --- 2. FUNÇÃO para adicionar listeners aos botões (Excluir/Remarcar) ---
  const addCardListeners = () => {
    // Botão CANCELAR
    document.querySelectorAll(".btn-cancelar").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
          deleteAppointment(id);
        }
      });
    });

    // Botão REMARCAR
    document.querySelectorAll(".btn-remarcar").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (
          confirm(
            "Deseja remarcar? O seu agendamento atual será cancelado e você será levado para a tela de marcação."
          )
        ) {
          // Lógica de remarcação:
          // 1. Deleta o agendamento antigo
          deleteAppointment(id);
          // 2. Redireciona para a tela de marcar
          window.location.href = "marcar-consulta.html";
        }
      });
    });
  };

  // --- 3. FUNÇÃO para Deletar o agendamento ---
  const deleteAppointment = (id) => {
    let appointments =
      JSON.parse(localStorage.getItem("biodenteAppointments")) || [];
    // Filtra a lista, removendo o item com o ID correspondente
    appointments = appointments.filter(
      (app) => app.id.toString() !== id.toString()
    );
    // Salva a nova lista (sem o item) no localStorage
    localStorage.setItem("biodenteAppointments", JSON.stringify(appointments));
    // Recarrega a lista na tela
    loadAppointments();
  };

  // --- 4. Lógica das Abas (Tabs) ---
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");

      document
        .querySelectorAll(".tab-button")
        .forEach((btn) => btn.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // --- Carregamento Inicial ---
  loadAppointments();
});
