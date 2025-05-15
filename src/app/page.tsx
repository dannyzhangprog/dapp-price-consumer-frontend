import PriceDisplay from '../components/PiceDisplay'
import WalletConnect from '../components/ConnectButton'

export default function Home() {
  return (
    <main className="container">
      <nav>
        <WalletConnect />
      </nav>
      
      <div className="content">
        <PriceDisplay />
      </div>
    </main>
  )
}