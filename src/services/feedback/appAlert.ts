export type AppAlertVariant = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export interface AppAlertButton {
  text?: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AppAlertOptions {
  cancelable?: boolean;
  onDismiss?: () => void;
}

export interface AppAlertEntry {
  id: number;
  title: string;
  message: string;
  variant: AppAlertVariant;
  presentation: 'dialog' | 'toast';
  buttons: AppAlertButton[];
  cancelable: boolean;
  onDismiss?: () => void;
}

const listeners = new Set<() => void>();
const queue: AppAlertEntry[] = [];
let nextId = 0;

function emitChange() {
  listeners.forEach(listener => listener());
}

export function subscribeAppAlert(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getAppAlertSnapshot(): AppAlertEntry | null {
  return queue[0] ?? null;
}

function show(
  variant: AppAlertVariant,
  title: string,
  message?: string,
  buttons?: AppAlertButton[],
  options: AppAlertOptions = {},
) {
  // Some API validation responses contain a list of messages.
  const displayMessage = Array.isArray(message)
    ? message.filter(value => typeof value === 'string').join('\n')
    : typeof message === 'string' ? message : '';

  // Repeated background failures should not require dismissing identical dialogs.
  if (!buttons?.length && !options.onDismiss && queue.some(entry =>
    entry.variant === variant && entry.title === title && entry.message === displayMessage &&
    entry.buttons.every(button => !button.onPress) && !entry.onDismiss,
  )) return;

  const actions = buttons?.length ? buttons.map(button => ({ ...button })) : [];
  const entry: AppAlertEntry = {
    id: ++nextId,
    title,
    message: displayMessage,
    variant,
    presentation: actions.length ? 'dialog' : 'toast',
    buttons: actions,
    cancelable: !actions.length || (options.cancelable ?? actions.some(button => button.style === 'cancel')),
    onDismiss: options.onDismiss,
  };
  // Confirmations take priority over passive notifications.
  const firstToast = queue.findIndex(item => item.presentation === 'toast');
  if (entry.presentation === 'dialog' && firstToast >= 0) queue.splice(firstToast, 0, entry);
  else queue.push(entry);
  emitChange();
}

// A stale/double tap must never confirm the next dialog in the queue.
export function closeAppAlert(id: number, buttonIndex?: number) {
  const entry = queue[0];
  if (!entry || entry.id !== id) return;
  if (buttonIndex === undefined && !entry.cancelable) return;
  const button = buttonIndex === undefined ? undefined : entry.buttons[buttonIndex];
  if (buttonIndex !== undefined && !button) return;
  queue.shift();
  emitChange();
  if (button) button.onPress?.();
  else entry.onDismiss?.();
}

const createAlert = (variant: AppAlertVariant) => (
  title: string,
  message?: string,
  buttons?: AppAlertButton[],
  options?: AppAlertOptions,
) => show(variant, title, message, buttons, options);

export const AppAlert = {
  alert: createAlert('info'),
  info: createAlert('info'),
  success: createAlert('success'),
  warning: createAlert('warning'),
  error: createAlert('error'),
  confirm: createAlert('confirm'),
};
