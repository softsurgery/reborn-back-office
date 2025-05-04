import dns from 'dns/promises';

export const resolveMX = async (domain: string): Promise<{ host: string, port: number }> => {
  const records = await dns.resolveMx(domain);
  const sorted = records.sort((a, b) => a.priority - b.priority);
  const mx = sorted[0]?.exchange.toLowerCase();

  if (!mx) throw new Error("No MX records found");

  if (mx.includes('google')) return { host: 'smtp.gmail.com', port: 587 };
  if (mx.includes('outlook') || mx.includes('office365')) return { host: 'smtp.office365.com', port: 587 };
  if (mx.includes('zoho')) return { host: 'smtp.zoho.com', port: 587 };
  if (mx.includes('secureserver.net')) return { host: 'smtpout.secureserver.net', port: 465 };
  if (mx.includes('titan.email')) return { host: 'smtp.titan.email', port: 587 };
  
  return { host: `mail.${domain}`, port: 25 };
};
