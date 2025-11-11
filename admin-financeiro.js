// --- admin-financeiro.js ---

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Seletores do DOM ---
    const modal = document.getElementById("new-transaction-modal");
    const btnNovaReceita = document.getElementById("btn-nova-receita");
    const btnNovaDespesa = document.getElementById("btn-nova-despesa");
    const btnCloseModal = document.getElementById("close-modal-btn");
    const transactionForm = document.getElementById("new-transaction-form");
    const financeTableBody = document.getElementById("finance-table-body");
    const noTransactionsRow = document.getElementById("no-transactions-row");
    
    // Campos do Modal
    const modalTitle = document.getElementById("modal-title");
    const inputTipo = document.getElementById("tipo");
    const inputDescricao = document.getElementById("descricao");
    const inputValor = document.getElementById("valor");
    const btnSalvar = document.getElementById("save-transaction-btn");

    // --- Funções do Modal ---
    const openModal = (tipo) => {
        if (tipo === 'receita') {
            modalTitle.textContent = "Lançar Receita";
            inputTipo.value = 'receita';
            btnSalvar.style.backgroundColor = "var(--cor-principal)"; // Verde
        } else {
            modalTitle.textContent = "Lançar Despesa";
            inputTipo.value = 'despesa';
            btnSalvar.style.backgroundColor = "#FF6B6B"; // Vermelho
        }
        modal.classList.add("active");
    };

    const closeModal = () => {
        modal.classList.remove("active");
        transactionForm.reset(); // Limpa o formulário ao fechar
    };

    btnNovaReceita.addEventListener("click", () => openModal('receita'));
    btnNovaDespesa.addEventListener("click", () => openModal('despesa'));
    btnCloseModal.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // --- 1. Carregar Lançamentos (READ) ---
    const loadTransactions = () => {
        const transactions = JSON.parse(localStorage.getItem("biodenteFinances")) || [];
        financeTableBody.innerHTML = ""; // Limpa a tabela

        if (transactions.length === 0) {
            financeTableBody.appendChild(noTransactionsRow);
            return;
        }

        // Ordena por data (mais recente primeiro)
        transactions.sort((a, b) => new Date(b.data) - new Date(a.data));

        transactions.forEach(trans => {
            const tr = document.createElement("tr");
            const dataFormatada = new Date(trans.data).toLocaleDateString('pt-BR');
            const valorFormatado = Number(trans.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            const tipoClasse = trans.tipo === 'receita' ? 'valor-receita' : 'valor-despesa';
            const tipoTexto = trans.tipo === 'receita' ? 'Receita' : 'Despesa';

            tr.innerHTML = `
                <td>${dataFormatada}</td>
                <td><strong>${trans.descricao}</strong></td>
                <td class="${tipoClasse}">${tipoTexto}</td>
                <td class="${tipoClasse}">${valorFormatado}</td>
                <td>
                    <button class="btn-acao-tabela delete" data-id="${trans.id}" title="Excluir Lançamento">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            financeTableBody.appendChild(tr);
        });

        addDeleteListeners();
    };

    // --- 2. Salvar Lançamento (CREATE) ---
    transactionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newTransaction = {
            id: Date.now(),
            data: new Date().toISOString(),
            tipo: inputTipo.value,
            descricao: inputDescricao.value,
            valor: inputValor.value
        };

        // Salva no localStorage
        const transactions = JSON.parse(localStorage.getItem("biodenteFinances")) || [];
        transactions.push(newTransaction);
        localStorage.setItem("biodenteFinances", JSON.stringify(transactions));

        loadTransactions();
        closeModal();
    });

    // --- 3. Deletar Lançamento (DELETE) ---
    const deleteTransaction = (id) => {
        if (!confirm("Tem certeza que deseja excluir este lançamento?")) {
            return;
        }
        
        let transactions = JSON.parse(localStorage.getItem("biodenteFinances")) || [];
        transactions = transactions.filter(trans => trans.id !== id);
        localStorage.setItem("biodenteFinances", JSON.stringify(transactions));
        
        loadTransactions();
    };
    
    const addDeleteListeners = () => {
        document.querySelectorAll(".btn-acao-tabela.delete").forEach(button => {
            button.addEventListener("click", () => {
                const id = Number(button.dataset.id);
                deleteTransaction(id);
            });
        });
    };

    // --- Carregamento Inicial ---
    loadTransactions();
});