import { useState } from "react";
import { useAccount } from "wagmi";
import { writeContract } from '@wagmi/core';
import { escrowContract } from "../escrow"
import { parseEther } from 'viem'

export default function TradeForm(){
    const { isConnected } = useAccount();
    const [beneficiary, setBeneficiary] = useState();
    const [ethAmount, setEthAmount] = useState();
    const [tokenAddress, setTokenAddress] = useState();
    const [tokenAmount, setTokenAmount] = useState();

    const [BeneficiaryError, setBeneficiaryError] = useState()
    const [EthAmountError, setEthAmountError] = useState()
    const [TokenAddressError, setTokenAddressError] = useState()
    const [TokenAmountError, setTokenAmountError] = useState()

    const beneficiaryInput = (evt) => { setBeneficiary(evt.target.value) }
    const ethAmountInput = (evt) => { setEthAmount(evt.target.value) }
    const tokenAddressInput = (evt) => { setTokenAddress(evt.target.value) }
    const tokenAmountInput = (evt) => { setTokenAmount(evt.target.value) }

    const submit = async (evt) => {
        evt.preventDefault()
        beneficiary.match(new RegExp('^0x[0-9a-fA-F]{40}$')) ? setBeneficiaryError("") : setBeneficiaryError("Input Error")
        parseFloat(ethAmount) ? setEthAmountError("") : setEthAmountError("Input Error")
        tokenAddress.match(new RegExp('^0x[0-9a-fA-F]{40}$')) ? setTokenAddressError("") : setTokenAddressError("Input Error")
        parseFloat(tokenAmount) ? setTokenAmountError("") : setTokenAmountError("Input Error")
        
        if([BeneficiaryError, EthAmountError, TokenAddressError, TokenAmountError].some(element=>element === "Input Error")) return;

        await writeContract({
            address: escrowContract.constractAddress,
            abi: escrowContract.abi,
            functionName: "create",
            args: [beneficiary, tokenAddress, parseEther(tokenAmount)],
            value: parseEther(ethAmount)
        })
        
      }
    
    return(<>
        <div className="contract">
          <form onSubmit={submit}>
              <h1> Escrow Trade </h1>
  
              <label>
                Beneficiary Address
                <small className="error-message">{BeneficiaryError}</small>
                <input type="text" id="beneficiary" onChange={beneficiaryInput} onBlur={beneficiaryInput} />
              </label>

              <h4>FROM ETH</h4>

              <label>
                ETH Amount
                <small className="error-message">{EthAmountError}</small>
                <input type="text" id="ethwei" onChange={ethAmountInput} onBlur={ethAmountInput} />
              </label>

              <h4>TO TOKEN</h4>

              <label>
                Token Address
                <small className="error-message">{TokenAddressError}</small>
                <input type="text" id="token" onChange={tokenAddressInput} onBlur={tokenAddressInput} />
              </label>

              <label>
                Token Amount
                <small className="error-message">{TokenAmountError}</small>
                <input type="text" id="tokenwei" onChange={tokenAmountInput} onBlur={tokenAmountInput} />
              </label>

              <button className={`button ${isConnected ? "pointer" : "not-allowed"}`} id="deploy" type="submit" disabled={!isConnected}>Create</button>

          </form>
          
        </div>
      </>);
}