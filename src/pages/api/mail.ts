import container from '@/lib/container';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    const mailService = await container.MailService;

    const result = await mailService.sendMail(
      email,
      'Test Email from Next.js',
      '<p>This is a test email sent from your Next.js app.</p>'
    );

    res.status(200).json({ message: 'Email sent successfully', result });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}