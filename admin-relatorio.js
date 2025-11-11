// --- admin-relatorios.js ---

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Função para formatar moeda ---
    const formatCurrency = (value) => {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // --- 1. Carregar Relatório Financeiro ---
    const loadFinanceReport = () => {
        const transactions = JSON.parse(localStorage.getItem("biodenteFinances")) || [];
        
        let totalReceitas = 0;
        let totalDespesas = 0;
        
        transactions.forEach(trans => {
            if (trans.tipo === 'receita') {
                totalReceitas += Number(trans.valor);
            } else {
                totalDespesas += Number(trans.valor);
            }
        });
        
        const saldoLiquido = totalReceitas - totalDespesas;

        // Preenche os campos
        document.getElementById("report-total-receitas").textContent = formatCurrency(totalReceitas);
        document.getElementById("report-total-despesas").textContent = formatCurrency(totalDespesas);
        document.getElementById("report-saldo-liquido").textContent = formatCurrency(saldoLiquido);
        document.getElementById("report-saldo-liquido-2").textContent = formatCurrency(saldoLiquido);
        
        // Adiciona classe de cor ao saldo
        const saldoEl = document.getElementById("report-saldo-liquido");
        const saldoEl2 = document.getElementById("report-saldo-liquido-2");
        if (saldoLiquido < 0) {
            saldoEl.classList.remove('valor-ok');
            saldoEl.classList.add('valor-critico');
            saldoEl2.classList.remove('valor-ok');
            saldoEl2.classList.add('valor-critico');
        }
    };

    // --- 2. Carregar Relatório de Pacientes ---
    const loadPatientReport = () => {
        const patients = JSON.parse(localStorage.getItem("biodentePatients")) || [];
        document.getElementById("report-total-pacientes").textContent = patients.length;
    };

    // --- 3. Carregar Relatório de Estoque ---
    const loadStockReport = () => {
        const items = JSON.parse(localStorage.getItem("biodenteEstoque")) || [];
        const lowStockItems = items.filter(item => item.qtdAtual <= item.qtdMinima);
        
        const listElement = document.getElementById("report-lista-estoque");
        const noStockAlert = document.getElementById("no-stock-alert");
        
        document.getElementById("report-total-estoque").textContent = lowStockItems.length;

        if (lowStockItems.length === 0) {
            noStockAlert.style.display = 'block';
            listElement.innerHTML = ''; // Limpa caso haja itens antigos
            listElement.appendChild(noStockAlert);
        } else {
            noStockAlert.style.display = 'none';
            listElement.innerHTML = ''; // Limpa a lista
            
            lowStockItems.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <i class="fas fa-circle ${item.qtdAtual <= 0 ? 'valor-critico' : ''}" style="font-size: 0.7rem; color: #F1C40F;"></i>
                    ${item.nome} 
                    <span class="valor-critico">(${item.qtdAtual} un.)</span>
                `;
                listElement.appendChild(li);
            });
        }
    };

    // --- 4. Configurar Botão de Impressão ---
    const setupPrintButton = () => {
        document.getElementById("btn-print-report").addEventListener("click", () => {
            window.print(); // Abre a janela de impressão do navegador
        });
    };
    
    // --- 5. Configurar Data do Relatório ---
    const setReportDate = () => {
        const data = new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' });
        document.getElementById("report-date").textContent = `Gerado em: ${data}`;
    };

    // --- Carregamento Inicial ---
    loadFinanceReport();
    loadPatientReport();
    loadStockReport();
    setupPrintButton();
    setReportDate();
});