import Header from '@/components/Header'

// Payment is over by the time anyone lands here, so the site header is back
// (the same reasoning as /subscribe/success). One layout covers every return
// branch of the page.
export default function GiftSuccessLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
