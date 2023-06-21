import shortenAddress from "../utils/shortenAddress"
import { readContract, writeContract } from "@wagmi/core"
import { useAccount, erc20ABI } from "wagmi"
import { formatEther, parseEther } from "viem"
import { escrowContract } from "../escrow"
import { useState, useEffect } from "react"
import copyIcon from '../assets/icons/copy-icon.png'

const InstanceStatus = ["PENDING", "COPLETED", "CANCELLED", "REJECTED"] 

export default function InstanceInteraction() {
    const {address} = useAccount()
    const [escrowId, setEscrowId] = useState()
    const [escrowDetails, setEscrowDetails] = useState()
    
    const [allowance, setAllowance] = useState()
    const [balanceOf, setBalanceOf] = useState()
    
    const [isCreator, setIsCreator] = useState(false)
    const [isBeneficiary, setIsBeneficiary] = useState(false)
    const [isApproved, setIsApproved] = useState(false)
    const [isTransactionDone, setIsTransactionDone] = useState(false)

    const [EscorIdError, setEscrowIdError] = useState("")

    const setId = (evt) => { setEscrowId(evt.target.value) }
    
    const search = async () => {
        escrowId.match(new RegExp('^0x[0-9a-fA-F]{64}$')) ? setEscrowIdError("") : setEscrowIdError("Input Error")
        if(EscorIdError === "Input Error") return
       
        try {
        const data = await readContract({
            address: escrowContract.constractAddress,
            abi: escrowContract.abi,
            functionName: "getEscrowById",
            args: [escrowId]
        })
        
        setEscrowDetails({...data, 
            amount: formatEther(data.amount), 
            prevAmount: formatEther(data.prevAmount), 
            tokenAmount: formatEther(data.tokenAmount), 
            prevTokenAmount: formatEther(data.prevTokenAmount) })
            
        const tokenAllowance = await readContract({
            address: data.tokenAddress,
            abi: erc20ABI,
            functionName: "allowance",
            args: [address, escrowContract.constractAddress]
        })

        const tokenBalanceOf = await readContract({
            address: data.tokenAddress,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [address]
        })

        setAllowance(formatEther(tokenAllowance))
        setBalanceOf(formatEther(tokenBalanceOf))

        setIsCreator(()=>{return (address === data.creator)})
        setIsBeneficiary(()=>{return (address === data.beneficiary)})
        
       } catch (error) {
            console.log(error)
       }
    }

    useEffect(()=>{
        escrowDetails && setIsCreator(()=>{ return (address === escrowDetails.creator) })
        escrowDetails && setIsBeneficiary(()=>{ return (address === escrowDetails.beneficiary) })
        escrowDetails && setIsApproved(()=>{ return (parseFloat(allowance) >= parseFloat(escrowDetails.tokenAmount)) })
        escrowDetails && setIsTransactionDone(()=>{ return (escrowDetails.isCompleted || escrowDetails.isCanceleld || escrowDetails.beneficiaryRejected) })
    }, [address, isCreator, isBeneficiary, allowance])
    
    async function approveToken() {

        await writeContract({
            address: escrowDetails.tokenAddress,
            abi: erc20ABI,
            functionName: "approve",
            args: [escrowContract.constractAddress, parseEther(escrowDetails.tokenAmount)],
        })

    } 

    const accept = async () => {
        try{
            await writeContract({
                address: escrowContract.constractAddress,
                abi: escrowContract.abi,
                functionName: "accept",
                args: [escrowId]
            })
    
            setIsTransactionDone(true)
        }
        catch(error){

            setIsTransactionDone(false)
        }
    }
    const reject = async () => {
        try {
            await writeContract({
                address: escrowContract.constractAddress,
                abi: escrowContract.abi,
                functionName: "reject",
                args: [escrowId]
            })
    
            setIsTransactionDone(true)
        } catch (error) {
            setIsTransactionDone(false)
            
        }
    }
    const cancel = async () => {
        try {
            await writeContract({
                address: escrowContract.constractAddress,
                abi: escrowContract.abi,
                functionName: "cancel",
                args: [escrowId]
            })
    
            setIsTransactionDone(true)
        } catch (error) {
            setIsTransactionDone(false)
            
        }
    }



    return(<>
    <div className="contract">
    
        <h1> Instance Interaction </h1>
        
        <label htmlFor="searchInstance">
            Instance Id
            <small className="error-message">{EscorIdError}</small>
            <div className="search">
                <input type="text" name="searchInstance" onChange={setId} onBlur={setId} />
                <button className="instance-search" onClick={search}>🔍</button>
            </div>
        </label>
        
        {isCreator && <button className={`button ${isTransactionDone ? "not-allowed" : "pointer"}`} onClick={cancel} disabled={isTransactionDone} >Cancel</button>}
        {isBeneficiary && <button className={`button ${isTransactionDone ? "not-allowed" : "pointer"}`} onClick={reject} disabled={isTransactionDone} >Reject</button>}
        {escrowDetails && !isCreator && !isApproved && <button className={`button ${isTransactionDone ? "not-allowed" : "pointer"}`} onClick={approveToken} disabled={isTransactionDone} >Approve</button>}
        {isApproved && isBeneficiary && <button className={`button ${isTransactionDone ? "not-allowed" : "pointer"}`} onClick={accept} disabled={isTransactionDone} >Accept</button>}

        {escrowDetails && <table className="escrowDetails">
            <tbody>
                <tr key="1"><td key="11">Status:</td><td key="6">{InstanceStatus[escrowDetails.status]}</td></tr>
                <tr key="2"><td key="12">Beneficiary:</td><td key="7" className="instance-list-item" title={`${escrowDetails.beneficiary}`}>{shortenAddress(escrowDetails.beneficiary)} <div className="copy-button" onClick={() => {navigator.clipboard.writeText(escrowDetails.beneficiary)}}> <img src={copyIcon} alt="copy" /> </div></td></tr>
                <tr key="3"><td key="13">Amount ETH:</td><td key="8">{escrowDetails.amount} [before: {escrowDetails.prevAmount}]</td></tr>
                <tr key="4"><td key="14">Token Address:</td><td key="9" className="instance-list-item" title={`${escrowDetails.tokenAddress}`}>{shortenAddress(escrowDetails.tokenAddress)} <div className="copy-button" onClick={() => {navigator.clipboard.writeText(escrowDetails.tokenAddress)}}> <img src={copyIcon} alt="copy" /> </div></td></tr>
                <tr key="5"><td key="15">Token Amount:</td><td key="10">{escrowDetails.tokenAmount} [before: {escrowDetails.prevTokenAmount}]</td></tr>
                <tr><td>Token Balance: </td><td>{balanceOf}</td></tr>
                <tr><td>Token Allowance/Required:</td><td>{allowance} / {escrowDetails.tokenAmount}</td></tr>
            </tbody>
        </table>}

    </div>
    </>)
}