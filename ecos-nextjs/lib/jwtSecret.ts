// Segredo usado para assinar e verificar os tokens de login.
// Sem ele, qualquer pessoa que conheça um valor padrão conseguiria forjar um token de admin,
// então a aplicação falha em vez de usar um segredo reserva.
export function jwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET não configurado. Defina a variável de ambiente antes de iniciar o site.')
  }
  return secret
}
