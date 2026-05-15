function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="button-row">
          <button className="button-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="button-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
