// --- marcar-consulta.js ---

document.addEventListener("DOMContentLoaded", () => {
  // --- Variáveis Globais ---
  let currentStep = 0;
  const steps = document.querySelectorAll(".step");
  const summary = {
    servico: document.getElementById("summary-servico"),
    profissional: document.getElementById("summary-profissional"),
    data: document.getElementById("summary-data"),
    hora: document.getElementById("summary-hora"),
  };
  const agendamento = {
    servico: "",
    profissional: "",
    data: "",
    hora: "",
  };

  // Simulação de horários disponíveis
  const horariosDisponiveis = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "14:00",
    "14:30",
    "15:00",
    "16:00",
    "16:30",
  ];
  let selectedDayElement = null;
  let selectedTimeElement = null;
  let currentDate = new Date(2025, 10, 1); // 1 de Novembro de 2025

  // --- Navegação entre Passos (Steps) ---
  const btnStep1 = document.getElementById("btn-step1");
  const btnStep2 = document.getElementById("btn-step2");
  const btnBack1 = document.getElementById("btn-back1");
  const btnBack2 = document.getElementById("btn-back2");
  const btnConfirm = document.getElementById("btn-confirm");

  const showStep = (stepIndex) => {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });
    currentStep = stepIndex;
  };

  btnStep1.addEventListener("click", () => {
    // Salva e atualiza o resumo
    agendamento.servico = document.getElementById("servico").value;
    agendamento.profissional = document.getElementById("profissional").value;
    summary.servico.textContent = agendamento.servico || "--";
    summary.profissional.textContent = agendamento.profissional || "--";

    if (agendamento.servico) {
      // Requer pelo menos um serviço
      showStep(1);
    } else {
      alert("Por favor, selecione um tipo de consulta.");
    }
  });

  btnBack1.addEventListener("click", () => showStep(0));

  btnStep2.addEventListener("click", () => {
    // Preenche a tela de confirmação
    document.getElementById("conf-servico").textContent = agendamento.servico;
    document.getElementById("conf-profissional").textContent =
      agendamento.profissional;
    document.getElementById("conf-data").textContent = agendamento.data;
    document.getElementById("conf-hora").textContent = agendamento.hora;
    showStep(2);
  });

  btnBack2.addEventListener("click", () => showStep(1));

  btnConfirm.addEventListener("click", () => {
    const newAppointment = {
      id: Date.now(),
      servico: agendamento.servico,
      profissional: agendamento.profissional,
      dataString: agendamento.data,
      dataISO: agendamento.dataISO,
      hora: agendamento.hora,
    };

    const appointments =
      JSON.parse(localStorage.getItem("biodenteAppointments")) || [];

    appointments.push(newAppointment);

    localStorage.setItem("biodenteAppointments", JSON.stringify(appointments));

    console.log("AGENDAMENTO SALVO:", newAppointment);

    showStep(3);
  });

  // --- Lógica do Calendário (Passo 2) ---
  const calendarGrid = document.getElementById("calendar-grid");
  const monthYear = document.getElementById("month-year");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");

  const renderCalendar = (date) => {
    calendarGrid.innerHTML = ""; // Limpa o grid

    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date(2025, 10, 6); // Simula "hoje" como 6 de Nov 2025

    monthYear.textContent = date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Preenche dias em branco
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarGrid.insertAdjacentHTML("beforeend", '<div class="day"></div>');
    }

    // Preenche os dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isPast = dayDate < today;
      const isToday = dayDate.toDateString() === today.toDateString();

      let dayClass = "day";
      if (isPast) dayClass += " past";
      else dayClass += " available";
      if (isToday) dayClass += " today";

      calendarGrid.insertAdjacentHTML(
        "beforeend",
        `<div class="${dayClass}" data-date="${dayDate.toISOString()}">${i}</div>`
      );
    }

    // Adiciona listeners aos dias disponíveis
    addDayClickListeners();
  };

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate); // Renderiza o calendário inicial

  // --- Lógica de Horários (Passo 2) ---
  const slotsGrid = document.getElementById("slots-grid");
  const timeSlotsContainer = document.getElementById("time-slots");

  function addDayClickListeners() {
    calendarGrid.querySelectorAll(".day.available").forEach((day) => {
      day.addEventListener("click", () => {
        // Remove seleção anterior
        if (selectedDayElement) selectedDayElement.classList.remove("selected");

        // Adiciona nova seleção
        selectedDayElement = day;
        selectedDayElement.classList.add("selected");

        // Formata a data
        const dateObj = new Date(day.dataset.date);
        agendamento.data = dateObj.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        agendamento.dataISO = dateObj.toISOString();

        // Atualiza Resumo e UI
        summary.data.textContent = agendamento.data;
        document.getElementById("selected-date-info").textContent =
          dateObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
          });

        // Popula e mostra horários
        populateTimeSlots();
        timeSlotsContainer.style.display = "block";

        // Reseta seleção de hora
        agendamento.hora = "";
        summary.hora.textContent = "--";
        btnStep2.disabled = true;
      });
    });
  }

  function populateTimeSlots() {
    slotsGrid.innerHTML = "";
    selectedTimeElement = null;

    horariosDisponiveis.forEach((hora) => {
      // Simula alguns horários como "ocupados"
      const isDisabled = Math.random() > 0.8;
      const slotClass = isDisabled ? "time-slot disabled" : "time-slot";
      const disabledAttr = isDisabled ? "disabled" : "";

      slotsGrid.insertAdjacentHTML(
        "beforeend",
        `<button class="${slotClass}" ${disabledAttr}>${hora}</button>`
      );
    });

    // Adiciona listeners aos horários
    slotsGrid.querySelectorAll(".time-slot:not(.disabled)").forEach((slot) => {
      slot.addEventListener("click", () => {
        if (selectedTimeElement)
          selectedTimeElement.classList.remove("selected");

        selectedTimeElement = slot;
        selectedTimeElement.classList.add("selected");

        agendamento.hora = slot.textContent;
        summary.hora.textContent = agendamento.hora;
        btnStep2.disabled = false; // Ativa o botão de avançar
      });
    });
  }
});
