import React from 'react'

const ConfirmDialog = ({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}) => {
    return (
        <div className="w-full max-w-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 mb-6">{message}</p>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="px-4 py-2 text-sm rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
                    onClick={onCancel}
                >
                    {cancelLabel}
                </button>
                <button
                    type="button"
                    className="px-4 py-2 text-sm-bold rounded-full bg-red-500 text-white hover:bg-red-600"
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
};

export default ConfirmDialog;
