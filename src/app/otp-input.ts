import { Component, computed, signal, model, viewChildren, ElementRef } from '@angular/core';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  template: `
    <div class="otp-group">
      @for (idx of digitIndexes(); track idx) {
        <input
          #digitInput
          type="text"
          inputmode="numeric"
          pattern="[0-9]"
          maxlength="1"
          [value]="digits()[idx]"
          (input)="onInput($any($event).target, idx)"
          (keydown)="onKeyDown($event, idx)"
          (focus)="onFocus($any($event).target)"
          (paste)="onPaste($event)"
          [attr.aria-label]="'Digit ' + (idx + 1)"
          class="otp-input"
        />
      }
    </div>
    @if (showStatus()) {
      <p class="otp-status">{{ statusText() }}</p>
    }
  `,
  styles: [`
    .otp-group {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .otp-input {
      width: 48px;
      height: 56px;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      caret-color: #6366f1;
    }
    .otp-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    .otp-input.filled {
      border-color: #6366f1;
      background: #f8f8ff;
    }
    .otp-status {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
      color: #64748b;
    }
  `],
})
export class OtpInput {
  readonly digitCount = signal(6);
  readonly digits = signal<string[]>(new Array(this.digitCount()).fill(''));
  readonly showStatus = signal(false);
  readonly otpValue = model<string>('');

  private readonly digitInputs = viewChildren<ElementRef<HTMLInputElement>>('digitInput');

  readonly digitIndexes = computed(() => Array.from({ length: this.digitCount() }, (_, i) => i));

  readonly statusText = computed(() => {
    const val = this.digits().join('');
    if (val.length === this.digitCount()) {
      return `OTP entered: ${val}`;
    }
    return '';
  });

  onInput(target: HTMLInputElement, idx: number): void {
    const val = target.value.replace(/\D/g, '');
    target.value = val;
    if (val) {
      const updated = [...this.digits()];
      updated[idx] = val;
      this.digits.set(updated);
      this.otpValue.set(updated.join(''));
      this.showStatus.set(true);
      if (idx < this.digitCount() - 1) {
        this.focusInput(idx + 1);
      }
    }
  }

  onKeyDown(event: KeyboardEvent, idx: number): void {
    if (event.key === 'Backspace' && !this.digits()[idx] && idx > 0) {
      const updated = [...this.digits()];
      updated[idx - 1] = '';
      this.digits.set(updated);
      this.otpValue.set(updated.join(''));
      this.focusInput(idx - 1);
    }
    if (event.key === 'ArrowLeft' && idx > 0) {
      this.focusInput(idx - 1);
    }
    if (event.key === 'ArrowRight' && idx < this.digitCount() - 1) {
      this.focusInput(idx + 1);
    }
  }

  onFocus(target: HTMLInputElement): void {
    target.select();
  }

  onPaste(event: ClipboardEvent): void {
    const paste = event.clipboardData?.getData('text') ?? '';
    const cleaned = paste.replace(/\D/g, '').slice(0, this.digitCount());
    if (cleaned.length > 0) {
      event.preventDefault();
      const updated = [...this.digits()];
      for (let i = 0; i < cleaned.length; i++) {
        updated[i] = cleaned[i];
      }
      this.digits.set(updated);
      this.otpValue.set(updated.join(''));
      this.showStatus.set(true);
      const focusIdx = Math.min(cleaned.length, this.digitCount() - 1);
      this.focusInput(focusIdx);
    }
  }

  private focusInput(idx: number): void {
    const inputs = this.digitInputs();
    if (inputs[idx]) {
      inputs[idx].nativeElement.focus();
    }
  }
}
