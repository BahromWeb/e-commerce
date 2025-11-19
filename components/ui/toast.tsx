import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-success/10 border-success/30",
    error: "bg-error/10 border-error/30",
    info: "bg-accent/10 border-accent/30",
    warning: "bg-warning/10 border-warning/30",
  }[type];

  const textColor = {
    success: "text-success",
    error: "text-error",
    info: "text-accent",
    warning: "text-warning",
  }[type];

  return (
    <div
      className={`${bgColor} border rounded-lg px-4 py-3 ${textColor} font-medium max-w-sm`}
    >
      {message}
    </div>
  );
}
