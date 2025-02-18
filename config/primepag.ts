interface PrimePagConfig {
  publicKey: string;
  privateKey: string;
}

if (!process.env.PRIMEPAG_PUBLIC_KEY || !process.env.PRIMEPAG_PRIVATE_KEY) {
  console.error('Variáveis de ambiente do PrimePag não encontradas:', {
    publicKey: !!process.env.PRIMEPAG_PUBLIC_KEY,
    privateKey: !!process.env.PRIMEPAG_PRIVATE_KEY
  });
  throw new Error('Credenciais do PrimePag não configuradas');
}

export const primepagConfig: PrimePagConfig = {
  publicKey: process.env.PRIMEPAG_PUBLIC_KEY,
  privateKey: process.env.PRIMEPAG_PRIVATE_KEY
}; 