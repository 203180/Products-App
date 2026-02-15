import {ToastType} from '../../enum/toastType';

export interface AppToast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timeoutMs?: number;
}
