// Espera o documento carregar
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona os botões
  const userLoginButton = document.getElementById("userLogin");
  const adminLoginButton = document.getElementById("adminLogin");

  if (userLoginButton) {
    userLoginButton.addEventListener("click", () => {
      console.log("Botão Paciente clicado");
      // Ação real: (ex: window.location.href = '/login-usuario.html')
      alert("Redirecionando para o login de Paciente...");
    });
  }

  if (adminLoginButton) {
    adminLoginButton.addEventListener("click", () => {
      console.log("Botão Secretária clicado");
      // Ação real: (ex: window.location.href = '/login-admin.html')
      alert("Redirecionando para o login de Secretária...");
    });
  }
});
