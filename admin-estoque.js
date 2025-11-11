// --- admin-estoque.js ---

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Seletores do DOM ---
    const estoqueTableBody = document.getElementById("estoque-table-body");
    const noItemsRow = document.getElementById("no-items-row");

    // Modal de Novo Item
    const newItemModal = document.getElementById("new-item-modal");
    const btnNovoItem = document.getElementById("btn-novo-item");
    const btnCloseNewItem = document.getElementById("close-new-item-modal");
    const newItemForm = document.getElementById("new-item-form");

    // Modal de Ajuste de Estoque
    const adjustStockModal = document.getElementById("adjust-stock-modal");
    const btnCloseAdjust = document.getElementById("close-adjust-modal");
    const adjustStockForm = document.getElementById("adjust-stock-form");
    const adjustItemId = document.getElementById("adjust-item-id");
    const adjustModalTitle = document.getElementById("adjust-modal-title");
    const adjustQtdInput = document.getElementById("item-qtd-ajuste");

    // --- Funções dos Modais ---
    const openModal = (modal) => modal.classList.add("active");
    const closeModal = (modal) => modal.classList.remove("active");

    btnNovoItem.addEventListener("click", () => openModal(newItemModal));
    btnCloseNewItem.addEventListener("click", () => closeModal(newItemModal));
    newItemModal.addEventListener("click", (e) => {
        if (e.target === newItemModal) closeModal(newItemModal);
    });

    btnCloseAdjust.addEventListener("click", () => closeModal(adjustStockModal));
    adjustStockModal.addEventListener("click", (e) => {
        if (e.target === adjustStockModal) closeModal(adjustStockModal);
    });

    // --- 1. Carregar Itens (READ) ---
    const loadItems = () => {
        const items = JSON.parse(localStorage.getItem("biodenteEstoque")) || [];
        estoqueTableBody.innerHTML = ""; // Limpa a tabela

        if (items.length === 0) {
            estoqueTableBody.appendChild(noItemsRow);
            return;
        }
        
        items.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena por nome

        items.forEach(item => {
            const tr = document.createElement("tr");
            
            // Define o status
            let statusClasse = 'status-ok';
            let statusTexto = 'OK';
            if (item.qtdAtual <= item.qtdMinima) {
                statusClasse = 'status-baixo';
                statusTexto = 'Baixo';
            }
            if (item.qtdAtual <= 0) {
                statusClasse = 'status-critico';
                statusTexto = 'Crítico';
            }

            tr.innerHTML = `
                <td><strong>${item.nome}</strong></td>
                <td>${item.qtdAtual}</td>
                <td>${item.qtdMinima}</td>
                <td><span class="status-estoque ${statusClasse}">${statusTexto}</span></td>
                <td>
                    <button class="btn-acao-tabela edit btn-ajustar" data-id="${item.id}" data-nome="${item.nome}" title="Ajustar Quantidade">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-acao-tabela delete" data-id="${item.id}" title="Excluir Item">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            estoqueTableBody.appendChild(tr);
        });

        addTableListeners();
    };

    // --- 2. Salvar Novo Item (CREATE) ---
    newItemForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newItem = {
            id: Date.now(),
            nome: document.getElementById("item-nome").value,
            qtdAtual: parseInt(document.getElementById("item-qtd-atual").value),
            qtdMinima: parseInt(document.getElementById("item-qtd-minima").value)
        };

        const items = JSON.parse(localStorage.getItem("biodenteEstoque")) || [];
        items.push(newItem);
        localStorage.setItem("biodenteEstoque", JSON.stringify(items));

        loadItems();
        closeModal(newItemModal);
        newItemForm.reset();
    });

    // --- 3. Ajustar Estoque (UPDATE) ---
    adjustStockForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const id = parseInt(adjustItemId.value);
        const ajuste = parseInt(adjustQtdInput.value);

        if (isNaN(ajuste)) return; // Não faz nada se o valor for inválido

        let items = JSON.parse(localStorage.getItem("biodenteEstoque")) || [];
        
        // Encontra o item e atualiza a quantidade
        items = items.map(item => {
            if (item.id === id) {
                item.qtdAtual = item.qtdAtual + ajuste; // Soma o ajuste (que pode ser negativo)
            }
            return item;
        });

        localStorage.setItem("biodenteEstoque", JSON.stringify(items));
        
        loadItems();
        closeModal(adjustStockModal);
        adjustStockForm.reset();
    });

    // --- 4. Deletar Item (DELETE) ---
    const deleteItem = (id) => {
        if (!confirm("Tem certeza que deseja excluir este item do estoque?")) {
            return;
        }
        
        let items = JSON.parse(localStorage.getItem("biodenteEstoque")) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem("biodenteEstoque", JSON.stringify(items));
        
        loadItems();
    };
    
    // --- 5. Adicionar Listeners aos Botões da Tabela ---
    const addTableListeners = () => {
        // Botões de Deletar
        document.querySelectorAll(".btn-acao-tabela.delete").forEach(button => {
            button.addEventListener("click", () => {
                const id = Number(button.dataset.id);
                deleteItem(id);
            });
        });
        
        // Botões de Ajustar (abrem o modal de ajuste)
        document.querySelectorAll(".btn-acao-tabela.btn-ajustar").forEach(button => {
            button.addEventListener("click", () => {
                const id = Number(button.dataset.id);
                const nome = button.dataset.nome;
                
                // Prepara o modal de ajuste
                adjustItemId.value = id;
                adjustModalTitle.textContent = `Ajustar: ${nome}`;
                openModal(adjustStockModal);
            });
        });
    };

    // --- Carregamento Inicial ---
    loadItems();
});