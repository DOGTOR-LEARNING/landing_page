import { requireEmployee, forwardToFinance } from '@/lib/financeProxy'

export async function GET(request) {
  const check = new URL(request.url).searchParams.get('check') === '1'
  return (await requireEmployee(request, 'finance.view')) || forwardToFinance(`/status${check ? '?check=true' : ''}`)
}
