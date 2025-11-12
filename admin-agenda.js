// --- admin-agenda.js ---

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Seletores do DOM ---
    const selectPaciente = document.getElementById("select-paciente");
    const selectProfissional = document.getElementById("select-profissional");
    const btnConfirmar = document.getElementById("btn-confirmar-admin");

    // Seletores do Calendário (iguais ao marcar-consulta.js)
    const calendarGrid = document.getElementById("calendar-grid");
    const monthYear = document.getElementById("month-year");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const slotsGrid = document.getElementById("slots-grid");
    const timeSlotsContainer = document.getElementById("time-slots");
    const selectedDateInfo = document.getElementById("selected-date-info");
    
    // Seletores do Resumo
    const summaryPaciente = document.getElementById("summary-paciente");
    const summaryProfissional = document.getElementById("summary-profissional");
    const summaryData = document.getElementById("summary-data");
    const summaryHora = document.getElementById("summary-hora");

    // --- Variáveis Globais ---
    const agendamento = {
        paciente: '',
        pacienteId: null,
        profissional: '',
        data: '',
        dataISO: '',
        hora: '',
    };
    
    // Simulação de horários
    const horariosDisponiveis = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', 
        '14:30', '15:00', '16:00', '16:30'
    ];
    let selectedDayElement = null;
    let selectedTimeElement = null;
    let currentDate = new Date(2025, 10, 1); // 1 de Novembro de 2025

    // --- 1. FUNÇÃO: Carregar Pacientes no Select ---
    const loadPatients = () => {
        const patients = JSON.parse(localStorage.getItem("biodentePatients")) || [];
        patients.forEach(patient => {
            const option = document.createElement("option");
            option.value = patient.id; // Salva o ID
            option.textContent = patient.nome; // Mostra o Nome
            selectPaciente.appendChild(option);
        });
    };
    
    // --- 2. FUNÇÃO: Atualizar o Resumo e o Botão ---
    const updateSummary = () => {
        // Atualiza os textos do resumo
        summaryPaciente.textContent = agendamento.paciente || '--';
        summaryProfissional.textContent = agendamento.profissional || '--';
        summaryData.textContent = agendamento.data || '--';
        summaryHora.textContent = agendamento.hora || '--';
        
        // Verifica se tudo foi preenchido para ativar o botão
        if (agendamento.paciente && agendamento.profissional && agendamento.data && agendamento.hora) {
            btnConfirmar.disabled = false;
        } else {
            btnConfirmar.disabled = true;
        }
    };

    // --- Listeners dos Seletores ---
    selectPaciente.addEventListener("change", (e) => {
        agendamento.paciente = e.target.options[e.target.selectedIndex].text;
        agendamento.pacienteId = e.target.value;
        updateSummary();
    });
    
    selectProfissional.addEventListener("change", (e) => {
        agendamento.profissional = e.target.value;
        updateSummary();
    });

    // --- 3. Lógica do Calendário (Copiada de marcar-consulta.js) ---
    const renderCalendar = (date) => {
        calendarGrid.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date(2025, 10, 11); // Simula "hoje"
        monthYear.textContent = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.insertAdjacentHTML('beforeend', '<div class="day"></div>');
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            const isPast = dayDate < today;
            let dayClass = 'day';
            if (isPast) dayClass += ' past';
            else dayClass += ' available';
            calendarGrid.insertAdjacentHTML('beforeend', `<div class="${dayClass}" data-date="${dayDate.toISOString()}">${i}</div>`);
        }
        addDayClickListeners();
    };

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // --- 4. Lógica de Horários (Copiada) ---
    function addDayClickListeners() {
        calendarGrid.querySelectorAll('.day.available').forEach(day => {
            day.addEventListener('click', () => {
                if (selectedDayElement) selectedDayElement.classList.remove('selected');
                selectedDayElement = day;
                selectedDayElement.classList.add('selected');
                
                const dateObj = new Date(day.dataset.date);
                agendamento.data = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
                agendamento.dataISO = dateObj.toISOString();
                
                selectedDateInfo.textContent = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
                populateTimeSlots();
                timeSlotsContainer.style.display = 'block';
                
                agendamento.hora = ''; // Reseta hora
                updateSummary();
            });
        });
    }
    
    function populateTimeSlots() {
        slotsGrid.innerHTML = '';
        selectedTimeElement = null;
        
        horariosDisponiveis.forEach(hora => {
            slotsGrid.insertAdjacentHTML('beforeend', `<button class="time-slot">${hora}</button>`);
        });

        slotsGrid.querySelectorAll('.time-slot:not(.disabled)').forEach(slot => {
            slot.addEventListener('click', () => {
                if (selectedTimeElement) selectedTimeElement.classList.remove('selected');
                selectedTimeElement = slot;
                selectedTimeElement.classList.add('selected');
                
                agendamento.hora = slot.textContent;
                updateSummary();
            });
        });
    }

    // --- 5. Salvar Agendamento (Botão Confirmar) ---
    btnConfirmar.addEventListener('click', () => {
        // Validação final
        if (!agendamento.paciente || !agendamento.profissional || !agendamento.data || !agendamento.hora) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // (O serviço/tipo de consulta não foi selecionado, podemos adicionar se necessário)
        const newAppointment = {
            id: Date.now(),
            servico: 'Consulta (Agendada por Admin)', // Placeholder
            profissional: agendamento.profissional,
            dataString: agendamento.data,
            dataISO: agendamento.dataISO,
            hora: agendamento.hora,
            pacienteId: agendamento.pacienteId // ID do paciente
        };

        const appointments = JSON.parse(localStorage.getItem("biodenteAppointments")) || [];
        appointments.push(newAppointment);
        localStorage.setItem("biodenteAppointments", JSON.stringify(appointments));

        alert(`Consulta marcada para ${agendamento.paciente} no dia ${agendamento.data}!`);
        
        // Limpa o formulário
        location.reload(); // Recarrega a página
    });

    // --- Carregamento Inicial ---
    loadPatients(); // <- Importante
    renderCalendar(currentDate);
});