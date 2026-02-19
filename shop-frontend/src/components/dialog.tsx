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
      className="backdrop:bg-black/40 backdrop:backdrop-blur-sm rounded-2xl"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          props.onClose();
        }
      }}
    >
      <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-semibold">{props.title}</h2>
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
        <div className="px-6 py-5">{props.children}</div>
      </div>
    </dialog>
  );
}
