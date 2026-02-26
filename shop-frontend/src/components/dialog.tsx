import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog(props: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (props.open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      dialog.close();
    }
  }, [props.open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleClose = () => props.onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [props.onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-full w-full max-h-full max-w-full rounded-none bg-white p-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:m-0 sm:h-auto sm:w-full sm:max-w-lg sm:max-h-[90vh] sm:rounded-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          props.onClose();
        }
      }}
    >
      <div
        className="flex flex-col h-full sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-semibold sm:text-lg">{props.title}</h2>
          {/* Кнопка закрытия окна */}
          <button
            type="button"
            onClick={props.onClose}
            className="cursor-pointer rounded-lg px-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            X
          </button>
        </div>

        {/* Содержимое модального окна */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {props.children}
        </div>
      </div>
    </dialog>
  );
}
