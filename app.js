// app.js
document.addEventListener("DOMContentLoaded", () => {
    // Inicializa Supabase
    const SUPABASE_URL = "https://digusrmzvsiyewvbiwth.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Vzcm16dnNpeWV3dmJpd3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODYyODQsImV4cCI6MjA2NTk2MjI4NH0.5ew8mHnyEEHnVrQY6Yz31BQstQcc_YCude2dCBWrwRU";
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  
    // Referencias al DOM
    const form       = document.getElementById("resetForm");
    const newPwd     = document.getElementById("newPassword");
    const confPwd    = document.getElementById("confirmPassword");
    const errNew     = document.getElementById("newPwdError");
    const errConf    = document.getElementById("confPwdError");
    const messageBox = document.getElementById("message");
  
    // Obtén el token de acceso de la URL (?access_token=...)
    const access_token = new URLSearchParams(window.location.search).get("access_token");
  
    // Funciones auxiliares
    function showInlineError(el, msg) {
      el.textContent = msg;
    }
    function clearInlineErrors() {
      errNew.textContent  = "";
      errConf.textContent = "";
    }
    function showMessage(text, isError = true) {
      messageBox.textContent = text;
      messageBox.style.color = isError ? "#e63946" : "#2a9d8f";
    }
  
    // Al enviar el formulario
    form.addEventListener("submit", async e => {
      e.preventDefault();
      clearInlineErrors();
      showMessage("");
  
      const pwd     = newPwd.value.trim();
      const confirm = confPwd.value.trim();
  
      // Validaciones básicas
      if (pwd.length < 6) {
        showInlineError(errNew, "La contraseña debe tener al menos 6 caracteres.");
        newPwd.focus();
        return;
      }
      if (pwd !== confirm) {
        showInlineError(errConf, "La confirmación no coincide.");
        confPwd.focus();
        return;
      }
      if (!access_token) {
        showMessage("Token de acceso inválido o ausente.");
        return;
      }
  
      // Llamada a Supabase para actualizar la contraseña
      showMessage("Actualizando contraseña...", false);
      const { data, error } = await supabase.auth.updateUser(
        { password: pwd },
        { accessToken: access_token }
      );
  
      if (error) {
        showMessage("Error al actualizar contraseña: " + error.message);
      } else {
        showMessage("Contraseña actualizada correctamente. Redirigiendo...", false);
        // Redirigir tras un breve delay
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    });
  });
  
  