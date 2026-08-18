import { cn } from '@/lib/utils';
import { CheckCircle, X } from 'lucide-react';
import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type ToastVariant = 'success';

interface ToastInput {
    title: string;
    description?: string;
    duration?: number;
    variant?: ToastVariant;
}

interface ToastMessage extends Required<Pick<ToastInput, 'duration' | 'variant'>> {
    id: number;
    title: string;
    description?: string;
}

interface ToastContextValue {
    showToast: (toast: ToastInput) => void;
    dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const nextToastId = useRef(1);
    const toastTimers = useRef<Map<number, number>>(new Map());

    const dismissToast = useCallback((id: number) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));

        const timerId = toastTimers.current.get(id);

        if (timerId) {
            window.clearTimeout(timerId);
            toastTimers.current.delete(id);
        }
    }, []);

    const showToast = useCallback(
        ({ duration = 3000, variant = 'success', ...toast }: ToastInput) => {
            toastTimers.current.forEach((timerId) => window.clearTimeout(timerId));
            toastTimers.current.clear();

            const id = nextToastId.current++;
            const nextToast: ToastMessage = {
                id,
                duration,
                variant,
                ...toast,
            };

            setToasts([nextToast]);
            toastTimers.current.set(id, window.setTimeout(() => dismissToast(id), duration));
        },
        [dismissToast],
    );

    useEffect(() => {
        const timers = toastTimers.current;

        return () => {
            timers.forEach((timerId) => window.clearTimeout(timerId));
            timers.clear();
        };
    }, []);

    const value = useMemo(
        () => ({
            dismissToast,
            showToast,
        }),
        [dismissToast, showToast],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                aria-live="polite"
                aria-relevant="additions text"
                className="pointer-events-none fixed top-5 right-5 z-[100] flex w-[calc(100vw-2.5rem)] max-w-[420px] flex-col gap-3 sm:top-8 sm:right-8 sm:w-full"
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="status"
                        className={cn(
                            'pointer-events-auto flex items-start gap-3 rounded-[4px] border p-4 font-["Instrument_Sans"] shadow-[0_18px_44px_rgba(15,23,42,0.12)] animate-in fade-in-0 slide-in-from-top-3',
                            toast.variant === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-950',
                        )}
                    >
                        <CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[15px] leading-5 font-semibold">{toast.title}</p>
                            {toast.description ? <p className="mt-1 text-[14px] leading-5 text-emerald-800">{toast.description}</p> : null}
                        </div>
                        <button
                            type="button"
                            onClick={() => dismissToast(toast.id)}
                            className="rounded-[2px] p-1 text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                            aria-label="Dismiss notification"
                        >
                            <X className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider.');
    }

    return context;
}
