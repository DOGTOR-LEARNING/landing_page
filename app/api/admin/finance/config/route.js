import { checkAdmin, forwardToFinance } from '@/lib/financeProxy'

export async function GET(request) {
  return checkAdmin(request) || forwardToFinance('/config')
}
