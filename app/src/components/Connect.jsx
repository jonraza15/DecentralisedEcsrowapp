import { useAccount, useConnect } from 'wagmi'
import Metamask from '../assets/icons/metamask-icon.png'
import WalletIcon from '../assets/icons/wallet-icon.png'
export function Connect() {
  const { connector } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
    
  return (
    <div>
      <div className='Wallets'>
        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <div className='ConnectWallet' key={x.id} onClick={() => connect({ connector: x })} title={`${x.name}`}>
              <img className='walletIcon' src={`${(x.name === "MetaMask") ? Metamask : (x.name === "Injected") ? WalletIcon : ""}`} alt={x.name} />
              {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
            </div>
          ))}
      </div>

      {error && <div>{(error).shortMessage}</div>}
    </div>
  )
}
