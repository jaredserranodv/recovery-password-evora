document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_URL = "https://digusrmzvsiyewvbiwth.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Vzcm16dnNpeWV3dmJpd3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODYyODQsImV4cCI6MjA2NTk2MjI4NH0.5ew8mHnyEEHnVrQY6Yz31BQstQcc_YCude2dCBWrwRU"; 
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // 3) Referencias DOM
  const form = document.getElementById("resetForm");
  const newPwd = document.getElementById("newPassword");
  const confPwd = document.getElementById("confirmPassword");
  const errNew = document.getElementById("newPwdError");
  const errConf = document.getElementById("confPwdError");

  // 4) Captura el code
  const code = new URLSearchParams(window.location.search).get("code");

  // Helpers
  const showInlineError = (el, msg) => { el.textContent = msg; };
  const clearInlineErrors = () => { errNew.textContent = ""; errConf.textContent = ""; };

  // 5) Si no hay code → modal de error y no muestres el form
  if (!code) {
    Swal.fire({
      icon: "error",
      title: "Código inválido",
      text: "No se encontró código de verificación en el enlace.",
    });
    form.style.display = "none";
    return;
  }

  // 6) Intercambia code por sesión temporal
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    console.error(exchangeError);
    Swal.fire({
      icon: "error",
      title: "Error de sesión",
      text: exchangeError.message,
    });
    form.style.display = "none";
    return;
  }

  // 7) Escucha el submit para actualizar la contraseña
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearInlineErrors();

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

    // 8) Modal de loading
    Swal.fire({
      title: "Actualizando contraseña...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    // 9) Llamada a Supabase
    const { error } = await supabase.auth.updateUser({ password: pwd });
    Swal.close();

    // 10) Modal de resultado
    if (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "¡Contraseña cambiada!",
        text: "Tu nueva contraseña ha sido guardada.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        window.location.href = "/";
      });
    }
  });
});
