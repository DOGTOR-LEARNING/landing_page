import { checkAdmin, forwardToFinance } from '@/lib/financeProxy'

export async function GET(request) {
  const check = new URL(request.url).searchParams.get('check') === '1'
  return checkAdmin(request) || forwardToFinance(`/status${check ? '?check=true' : ''}`)
}
