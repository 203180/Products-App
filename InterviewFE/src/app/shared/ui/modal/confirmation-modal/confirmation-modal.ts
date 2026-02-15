import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReusableModal} from '../reusable-modal/reusable-modal';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ReusableModal],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css',
})
export class ConfirmationModal {
  @Input() visible = false;

  @Input() title = '';
  @Input() subtitle = '';

  @Input() confirmText = 'Confirm';
  @Input() dismissText = 'Cancel';

  @Input() danger = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  onDismiss() {
    this.dismiss.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
