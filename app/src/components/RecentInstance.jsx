import shortenAddress from "../utils/shortenAddress"
import copyIcon from '../assets/icons/copy-icon.png'

export default function RecentInstances({InstanceIds}) {

    return(<>
    <div className="contract">
    <h1> Recent Instances </h1>
    
    <div className="history-list">
        { InstanceIds && InstanceIds.slice(-3).toReversed().map((item)=><div className="instance-list-item" key={item} title={item} >{shortenAddress(item)} <div className="copy-button" onClick={() => {navigator.clipboard.writeText(item)}}> <img src={copyIcon} alt="copy" /> </div></div>) }
    </div>

    </div>
    </>)
}