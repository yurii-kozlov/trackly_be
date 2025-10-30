import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

import type { EmailOptions } from './types.js';

class MailService {
  private mailGenerator: Mailgen;
  private smtpOptions?: SMTPTransport.Options;
  private transporter?: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.mailGenerator = new Mailgen({
      product: { link: 'https://trackly.com', name: 'Trackly' },
      theme: 'default',
    });
  }

  private getTransporter(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    if (!this.transporter) {
      const opts: SMTPTransport.Options = this.buildSmtpOptions();

      this.transporter = nodemailer.createTransport(opts);
    }
    return this.transporter;
  }

  private buildSmtpOptions(): SMTPTransport.Options {
    if (this.smtpOptions) return this.smtpOptions;

    const host = process.env.MAILTRAP_SMTP_HOST;
    const user = process.env.MAILTRAP_SMTP_USER;
    const pass = process.env.MAILTRAP_SMTP_PASS;
    const portStr = process.env.MAILTRAP_SMTP_PORT;

    if (!host || !user || !pass || !portStr) {
      throw new Error('Missing MAILTRAP SMTP env vars (HOST, USER, PASS, PORT).');
    }

    const port = Number(portStr);
    if (!Number.isFinite(port) || port <= 0) {
      throw new Error('MAILTRAP_SMTP_PORT must be a valid positive number');
    }

    this.smtpOptions = {
      auth: { pass, user },
      host,
      port,
      // pool: true, // enable if you send many emails concurrently
    };

    return this.smtpOptions;
  }

  closeTransporter(): void {
    if (this.transporter && typeof this.transporter.close === 'function') {
      this.transporter.close();
      this.transporter = undefined;
    }
  }

  createEmailHtml(options: EmailOptions): string {
    return this.mailGenerator.generate(options.mailgenContent) as string;
  }

  createTextualEmail(options: EmailOptions): string {
    return this.mailGenerator.generatePlaintext(options.mailgenContent) as string;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const transporter = this.getTransporter();

    const emailText = this.createTextualEmail(options);
    const emailHtml = this.createEmailHtml(options);

    const mail = {
      from: options.from ?? 'trackly@example.com',
      html: emailHtml,
      subject: options.subject,
      text: emailText,
      to: options.email,
    };

    try {
      await transporter.sendMail(mail);
    } catch (err) {
      console.error('MailService.sendEmail failed:', {
        err,
        subject: options.subject,
        to: options.email,
      });
      throw err;
    }
  }
}

// singleton instance + thin wrappers
const mailService = new MailService();
const sendEmail = (opts: EmailOptions) => mailService.sendEmail(opts);
const createTextualEmail = (opts: EmailOptions) => mailService.createTextualEmail(opts);
const createEmailHtml = (opts: EmailOptions) => mailService.createEmailHtml(opts);

export { createEmailHtml, createTextualEmail, sendEmail };
