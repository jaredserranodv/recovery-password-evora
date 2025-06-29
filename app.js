import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_URL = "https://digusrmzvsiyewvbiwth.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Vzcm16dnNpeWV3dmJpd3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODYyODQsImV4cCI6MjA2NTk2MjI4NH0.5ew8mHnyEEHnVrQY6Yz31BQstQcc_YCude2dCBWrwRU"; 
   const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

   const form = document.getElementById("resetForm");
   const newPwd = document.getElementById("newPassword");
   const confPwd = document.getElementById("confirmPassword");
   const errNew = document.getElementById("newPwdError");
   const errConf = document.getElementById("confPwdError");
 
 // **1)** Maneja automáticamente code + code_verifier
 const { error: sessionError } = await supabase.auth.getSessionFromUrl({ storeSession: false });
 if (sessionError) {
   console.error(sessionError);
   Swal.fire({
     icon: "error",
     title: "Error de sesión",
     text: sessionError.message,
   });
   form.style.display = "none";
   return;
 }

   const showInlineError = (el, msg) => { el.textContent = msg; };
   const clearInlineErrors = () => { errNew.textContent = ""; errConf.textContent = ""; };
  // **2)** Lógica de cambiar contraseña
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearInlineErrors();

    const pwd = newPwd.value.trim();
    const confirm = confPwd.value.trim();
    if (pwd.length < 6) return showInlineError(errNew, "Mínimo 6 caracteres");
    if (pwd !== confirm) return showInlineError(errConf, "No coincide");

    Swal.fire({ title: "Actualizando…", didOpen: () => Swal.showLoading(), allowOutsideClick: false });
    const { error } = await supabase.auth.updateUser({ password: pwd });
    Swal.close();

    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    } else {
      Swal.fire({ icon: "success", title: "¡Listo!", text: "Contraseña cambiada." })
        .then(() => window.location.href = "/");
    }
  });
});