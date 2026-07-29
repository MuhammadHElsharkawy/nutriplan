export class SweetAlert {
  static showSuccessAlert({
    title,
    text = "",
    highlightText = "",
    timer = 2000,
  }) {
    const htmlContent = `
      <p style="color: #4b5563; font-size: 16px; margin-bottom: 8px; line-height: 1.5;">${text}</p>
      ${highlightText ? `<p style="color: #059669; font-weight: 700; font-size: 18px; margin: 0;">${highlightText}</p>` : ""}
    `;

    return Swal.fire({
      title: title,
      html: htmlContent,
      icon: "success",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: false,
      padding: "2rem 1.5rem",
      background: "#ffffff",
      customClass: {
        popup: "custom-sweet-popup",
        title: "custom-sweet-title",
        icon: "custom-sweet-icon",
      },
    });
  }

  static showErrorAlert(title, text = "") {
    return Swal.fire({
      title: title,
      text: text,
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: "حسناً",
    });
  }

  static showConfirmDialog(title, text, confirmText = "نعم، قم بالحذف!") {
    return Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: confirmText,
      cancelButtonText: "Cancel",
    });
  }

  // static showConfirm

  static Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    background: "#00BC7D",
    color: "#fff",
  });

  static showSuccessToast(title) {
    this.Toast.fire({ icon: "success", title });
  }

  static showErrorToast({ title, text }) {
    this.Toast.fire({
      icon: "error",
      title,
      text,
      background: "#1F2937",
      color: "#fff",
      iconColor: "#F87171",
      timer: 4000,
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-red-500/20 px-2",
        title: "text-sm font-bold",
        htmlContainer: "text-xs",
      },
    });
  }

  // static showToast(icon, title) {
  //   this.Toast.fire({
  //     icon: icon,
  //     title: title,
  //   });
  // }
}
