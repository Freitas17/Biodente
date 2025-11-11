// --- admin-pacientes.js ---

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Seletores do DOM ---
    const modal = document.getElementById("new-patient-modal");
    const btnNovoPaciente = document.getElementById("btn-novo-paciente");
    const btnCloseModal = document.getElementById("close-modal-btn");
    const patientForm = document.getElementById("new-patient-form");
    const patientTableBody = document.getElementById("patient-table-body");
    const noPatientsRow = document.getElementById("no-patients-row");

    // --- Funções do Modal ---
    const openModal = () => modal.classList.add("active");
    const closeModal = () => modal.classList.remove("active");

    btnNovoPaciente.addEventListener("click", openModal);
    btnCloseModal.addEventListener("click", closeModal);
    // Fecha o modal se clicar fora dele
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- 1. Carregar Pacientes (READ) ---
    const loadPatients = () => {
        const patients = JSON.parse(localStorage.getItem("biodentePatients")) || [];
        patientTableBody.innerHTML = ""; // Limpa a tabela

        if (patients.length === 0) {
            patientTableBody.appendChild(noPatientsRow); // Mostra "Nenhum paciente"
            return;
        }

        patients.forEach(patient => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${patient.nome}</strong></td>
                <td>${patient.cpf || '--'}</td>
                <td>${patient.telefone}</td>
                <td>--</td> <td>
                    <button classclass="btn-acao-tabela agenda" data-id="${patient.id}" title="Agendar Consulta">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    <button class="btn-acao-tabela delete" data-id="${patient.id}" title="Excluir Paciente">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            patientTableBody.appendChild(tr);
        });

        // Adiciona listeners aos botões de deletar
        addDeleteListeners();
    };

    // --- 2. Salvar Paciente (CREATE) ---
    patientForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Pega os dados do formulário
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const telefone = document.getElementById("telefone").value;

        const newPatient = {
            id: Date.now(), // ID único
            nome: nome,
            cpf: cpf,
            telefone: telefone
        };

        // Salva no localStorage
        const patients = JSON.parse(localStorage.getItem("biodentePatients")) || [];
        patients.push(newPatient);
        localStorage.setItem("biodentePatients", JSON.stringify(patients));

        // Recarrega a tabela e fecha o modal
        loadPatients();
        closeModal();
        patientForm.reset(); // Limpa o formulário
    });

    // --- 3. Deletar Paciente (DELETE) ---
    const deletePatient = (id) => {
        if (!confirm("Tem certeza que deseja excluir este paciente?")) {
            return;
        }
        
        let patients = JSON.parse(localStorage.getItem("biodentePatients")) || [];
        patients = patients.filter(patient => patient.id !== id);
        localStorage.setItem("biodentePatients", JSON.stringify(patients));
        
        loadPatients(); // Recarrega a tabela
    };
    
    // Adiciona os listeners aos botões de deletar (precisa ser chamado após carregar)
    const addDeleteListeners = () => {
        document.querySelectorAll(".btn-acao-tabela.delete").forEach(button => {
            button.addEventListener("click", () => {
                const id = Number(button.dataset.id); // Converte o ID para número
                deletePatient(id);
            });
        });
    };

    // --- Carregamento Inicial ---
    loadPatients();
});