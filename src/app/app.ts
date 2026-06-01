import { Component } from '@angular/core';
import { OtpInput } from './otp-input';

@Component({
  selector: 'app-root',
  imports: [OtpInput],
  template: `
    <div class="app-container">
      <div class="card">
        <h1 class="title">OTP Verification</h1>
        <p class="subtitle">Enter the 6-digit code sent to your device</p>
        <app-otp-input />
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .card {
      background: white;
      padding: 48px 40px;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      max-width: 440px;
      width: 100%;
      text-align: center;
    }
    .title {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
    }
    .subtitle {
      margin: 0 0 32px;
      font-size: 15px;
      color: #64748b;
    }
  `],
})
export class App {}
