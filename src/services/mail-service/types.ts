import Mailgen from 'mailgen';

export interface EmailOptions {
  email: string;
  from?: string;
  mailgenContent: MailgenContent;
  subject: string;
}

type MailgenContent = Parameters<Mailgen['generate']>[0];
