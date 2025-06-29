document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_URL = "https://digusrmzvsiyewvbiwth.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Vzcm16dnNpeWV3dmJpd3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODYyODQsImV4cCI6MjA2NTk2MjI4NH0.5ew8mHnyEEHnVrQY6Yz31BQstQcc_YCude2dCBWrwRU"; 
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById("resetForm");
  const newPwd = document.getElementById("newPassword");
  const confPwd = document.getElementById("confirmPassword");
  const errNew = document.getElementById("newPwdError");
  const errConf = document.getElementById("confPwdError");

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  function showInlineError(el, msg) {
    el.textContent = msg;
  }

  function clearInlineErrors() {
    errNew.textContent = "";
    errConf.textContent = "";
  }

  // Verifica que haya un código
  if (!code) {
    Swal.fire({
      icon: "error",
      title: "Código inválido",
      text: "No se encontró código de verificación en el enlace.",
    });
    form.style.display = "none";
    return;
  }

  // Intercambio del código por sesión
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    console.error(exchangeError);
    Swal.fire({
      icon: "error",
      title: "Error de sesión",
      text: "No se pudo validar tu código: " + exchangeError.message,
    });
    form.style.display = "none";
    return;
  }

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

    Swal.fire({
      title: "Actualizando contraseña...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    const { error } = await supabase.auth.updateUser({ password: pwd });

    Swal.close();

    if (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la contraseña: " + error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "¡Contraseña cambiada!",
        text: "Tu contraseña ha sido actualizada correctamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        window.location.href = "/";
      });
    }
  });
});