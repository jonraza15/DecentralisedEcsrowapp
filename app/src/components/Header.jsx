import shortenAddress from '../utils/shortenAddress'
import '../styles/header.css'
import { Connect } from './Connect'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import LogoutIcon from '../assets/icons/logout.png'

export default function Header(){
    const { address , isConnected } = useAccount()
    const { data } = useBalance({address: address})
    const { disconnect } = useDisconnect()

    return(<div className="header">
        <div className="brand">ESCROW<div className='brand-sub'>ME</div></div>
    
      {isConnected ? <div className='account'>
                        <div className="address" title={`address`}>{shortenAddress(address)}</div>
                        <div className="balance">{data && Number(data?.formatted).toFixed(4)} {data?.symbol}</div>
                        <div className='disconnect' title='Disconnect' onClick={()=> disconnect()}><img className='walletIcon' src={`${LogoutIcon}`} alt="disconnect" /></div>
                    </div> : <Connect />
                    }
      </div>)
}

/* 
1. create a connect button
2. check if has wallet extension
3. check if has account
4. on connect click, set wallet and balance to state
5. check for change account event using window.ethereum
6. on account change, request for connection
7. change the connect button to account + balance + disconnect
8. on disconnect, remove the set account and balance
9. add a state that watches for disconnect
10. make sure that the user is connected for them to be able to do actions in the app

*/