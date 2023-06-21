import TradeForm from '../components/TradeForm'
import History from '../components/History'
import InstanceInteraction from '../components/InstanceInteraction'
import RecentInstances from '../components/RecentInstance'
import { readContract } from '@wagmi/core'
import { useAccount } from 'wagmi'
import { useEffect, useState } from "react"
import { escrowContract } from '../escrow' 

export default function DApp(){
    const { address, isConnected } = useAccount()
    const [InstanceIds, setInstanceIds] = useState()

    useEffect(()=>{
        let isOk = true;
        
       async function getHistory(){
        if(!isConnected) return setInstanceIds()

        const data = await readContract({
            address: escrowContract.constractAddress,
            abi: escrowContract.abi,
            functionName: 'getHistory',
            args: [`${address}`]
        })

        setInstanceIds(data?.InstanceIds)
       }

       isOk && getHistory()

       return () => {
        isOk = false;
       }

    }, [address, isConnected])

    return(<div className='app-body'>
    <TradeForm />
    <InstanceInteraction />
    <RecentInstances InstanceIds={InstanceIds} />
    <History InstanceIds={InstanceIds} />
    </div>)
}