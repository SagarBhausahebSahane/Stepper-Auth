import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title, message) => addToast({ type: "success", title, message }),
    error:   (title, message) => addToast({ type: "error",   title, message }),
    info:    (title, message) => addToast({ type: "info",    title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ICONS = { success: "✅", error:   "❌", info:    "ℹ️", warning: "⚠️"};

// ── Colors per type
const STYLES = {
  success: {
    bar:   "bg-green-500",
    bg:    "bg-white border-l-4 border-green-500",
    title: "text-green-700",
    msg:   "text-gray-600",
  },
  error: {
    bar:   "bg-red-500",
    bg:    "bg-white border-l-4 border-red-500",
    title: "text-red-700",
    msg:   "text-gray-600",
  },
  info: {
    bar:   "bg-blue-500",
    bg:    "bg-white border-l-4 border-blue-500",
    title: "text-blue-700",
    msg:   "text-gray-600",
  },
  warning: {
    bar:   "bg-yellow-500",
    bg:    "bg-white border-l-4 border-yellow-500",
    title: "text-yellow-700",
    msg:   "text-gray-600",
  },
};

const ToastCard = ({ toast, onRemove }) => {
  const s = STYLES[toast.type] || STYLES.info;
  return (
    <div
      className={`relative flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[300px] max-w-sm w-full overflow-hidden ${s.bg} animate-slide-in`}
      style={{ animation: "slideIn 0.3s ease" }}
    >
      <div
        className={`absolute bottom-0 left-0 h-1 ${s.bar} animate-shrink`}
        style={{ animation: "shrink 4s linear forwards" }}
      />

      <span className="text-xl mt-0.5 shrink-0">{ICONS[toast.type]}</span>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-semibold leading-tight ${s.title}`}>{toast.title}</p>
        )}
        {toast.message && (
          <p className={`text-xs mt-0.5 leading-snug ${s.msg}`}>{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-300 hover:text-gray-500 text-lg leading-none shrink-0 transition"
      >
        ×
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastCard toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
