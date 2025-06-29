document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_URL = "https://digusrmzvsiyewvbiwth.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Vzcm16dnNpeWV3dmJpd3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODYyODQsImV4cCI6MjA2NTk2MjI4NH0.5ew8mHnyEEHnVrQY6Yz31BQstQcc_YCude2dCBWrwRU"; 
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById("resetForm");
  const newPwd = document.getElementById("newPassword");
  const confPwd = document.getElementById("confirmPassword");
  const errNew = document.getElementById("newPwdError");
  const errConf = document.getElementById("confPwdError");
  const messageBox = document.getElementById("message");

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  // Funciones auxiliares
  function showInlineError(el, msg) {
    el.textContent = msg;
  }
  function clearInlineErrors() {
    errNew.textContent = "";
    errConf.textContent = "";
  }
  function showMessage(text, isError = true) {
    messageBox.textContent = text;
    messageBox.style.color = isError ? "#e63946" : "#2a9d8f";
  }

  if (!code) {
    showMessage("Código de verificación ausente o inválido.");
    form.style.display = "none";
    return;
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    console.error(exchangeError);
    showMessage("Error al validar el código: " + exchangeError.message);
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    clearInlineErrors();
    showMessage("");

    const pwd = newPwd.value.trim();
    const confirm = confPwd.value.trim();

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
  
  
    // En lugar de showMessage, pon esto:

    // En lugar de showMessage, pon esto:
    Swal.fire({
      title: 'Actualizando contraseña...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    const { error } = await supabase.auth.updateUser({ password: pwd });

    Swal.close();

    if (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar contraseña: ' + error.message,
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'Tu contraseña fue cambiada correctamente.',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        window.location.href = "/";
      });
    }
  });
});
