import { headers } from 'next/headers'

const METADATA = {
  tw: {
    title: '加入 Dogtor 逗課 | 和朋友一起學習對戰',
    description:
      '接受好友邀請，加入 Dogtor 逗課！一起進行題庫練習、好友對戰，讓國中會考和高中學測複習更有趣。',
  },
  global: {
    title: 'Join Dogtor | Learn and battle with friends',
    description: 'Accept your friend’s invite and join Dogtor: practice questions and battle your friends.',
  },
}

export async function generateMetadata() {
  const h = await headers()
  return METADATA[h.get('x-app-market')] || METADATA.tw
}

export default function InviteLayout({ children }) {
  return children
}
