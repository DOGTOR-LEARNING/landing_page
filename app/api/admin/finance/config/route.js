import { requireEmployee, forwardToFinance } from '@/lib/financeProxy'

export async function GET(request) {
  return (await requireEmployee(request, 'finance.view')) || forwardToFinance('/config')
}
