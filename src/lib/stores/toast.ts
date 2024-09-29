import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    message: string;
    show: boolean;
    type: ToastType;
    duration: number | null;
    showButtons: boolean;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
}

function createToastStore() {
    const { subscribe, set, update } = writable<ToastState>({
        message: '',
        show: false,
        type: 'info',
        duration: null,
        showButtons: true,
        onConfirm: null,
        onCancel: null
    });

    let timeoutId: number | null = null;

    function clearToastTimeout() {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    return {
        subscribe,
        showToast: (message: string, type: ToastType, duration: number | null = null, showButtons: boolean = true, onConfirm?: () => void, onCancel?: () => void) => {
            clearToastTimeout();
            set({ message, show: true, type, duration, showButtons, onConfirm: onConfirm || null, onCancel: onCancel || null });
            
            if (duration !== null) {
                timeoutId = window.setTimeout(() => {
                    update(state => ({ ...state, show: false }));
                }, duration);
            }
        },
        hideToast: () => {
            clearToastTimeout();
            update(state => ({ ...state, show: false }));
        },
        handleConfirm: () => {
            clearToastTimeout();
            update(state => {
                if (state.onConfirm) state.onConfirm();
                return { ...state, show: false };
            });
        },
        handleCancel: () => {
            clearToastTimeout();
            update(state => {
                if (state.onCancel) state.onCancel();
                return { ...state, show: false };
            });
        }
    };
}

export const toast = createToastStore();
