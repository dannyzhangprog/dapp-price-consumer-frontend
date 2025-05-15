'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function WalletConnect() {
  return (
    <div className="connect-button">
      <ConnectButton 
        showBalance={true}
        accountStatus="address"
        chainStatus="icon"
      />
    </div>
  )
}