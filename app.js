import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_URL = "https://digusrmzvsiyewvbiwth.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ3Vzcm16dnNpeWV3dmJpd3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzODYyODQsImV4cCI6MjA2NTk2MjI4NH0.5ew8mHnyEEHnVrQY6Yz31BQstQcc_YCude2dCBWrwRU"; 

   // aquí sí funciona, porque createClient viene directamente de la importación
   const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

   const form = document.getElementById("resetForm");
   const newPwd = document.getElementById("newPassword");
   const confPwd = document.getElementById("confirmPassword");
   const errNew = document.getElementById("newPwdError");
   const errConf = document.getElementById("confPwdError");
 
   const code = new URLSearchParams(window.location.search).get("code");
   const showInlineError = (el, msg) => { el.textContent = msg; };
   const clearInlineErrors = () => { errNew.textContent = ""; errConf.textContent = ""; };
 
   if (!code) {
     Swal.fire({
       icon: "error",
       title: "Código inválido",
       text: "Falta el parámetro `code` en la URL.",
     });
     form.style.display = "none";
     return;
   }
 
   const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
   if (exchangeError) {
     Swal.fire({ icon: "error", title: "Error de sesión", text: exchangeError.message });
     form.style.display = "none";
     return;
   }
 
   form.addEventListener("submit", async e => {
     e.preventDefault();
     clearInlineErrors();
 
     const pwd = newPwd.value.trim();
     const confirm = confPwd.value.trim();
     if (pwd.length < 6) return showInlineError(errNew, "Min. 6 caracteres");
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