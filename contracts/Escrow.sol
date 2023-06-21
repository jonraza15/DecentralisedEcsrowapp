// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Pending Features
// Fees: A set fee will be subtracted to the msg.value from the creator (meaning the creator will pay a fee to trade using the service)
// setFee: A function to change the value of fee [CAN ONLY BE USED BY THE OWNER OF THE CONTRACT]
// Fund Wallet: A wallet where majority of the fees will be sent immediately after creation of an instance
// can be the same as the owner or a different address
// changeFundWallet: a function to change the address for he fund wallet [CAN ONLY BE USED BY THE OWNER OF THE CONTRACT]

// Features in Place that has no Effect for the current contract: [Fees, Fund Wallet]

// escrow for eth to token trade
contract Escrow {
    using SafeERC20 for IERC20;

    address public owner;
    address public fund_wallet;

    uint256 public fee;

    bool public createEnabled;

    // instance status
    enum _Status { PENDING, COMPLETED, CANCELLED, REJECTED }

    //instance structure
    struct Instance {
        bool exists;
        _Status status;
        address creator;
        address beneficiary;
        IERC20 tokenAddress;
        uint256 tokenAmount;
        uint256 prevTokenAmount;
        uint256 amount;
        uint256 prevAmount;
        bool beneficiaryApproved;
        bool beneficiaryRejected;
        bool isCompleted;
        bool isCancelled;
    }

    //history structure
    struct History {
        address user;
        bytes32[] InstanceIds;
    }

    //mapping instance
    mapping (bytes32 => Instance) EscrowInstance;
    //mapping history
    mapping(address => History) UserHistory;

    
    //created event
	event Created(bytes32 indexed InstanceId, address creator, address beneficiary, uint256 amount, IERC20 tokenAddress, uint256 tokenAmount);
    //approval event
	event Accepted(bytes32 indexed InstanceId, address creator, address beneficiary, uint256 amount, IERC20 tokenAddress, uint256 tokenAmount);
	event Rejected(bytes32 indexed InstanceId, address creator, address beneficiary, uint256 amount, IERC20 tokenAddress, uint256 tokenAmount);
    //cancelled event
	event Cancelled(bytes32 indexed InstanceId, address creator, address beneficiary, uint256 amount, IERC20 tokenAddress, uint256 tokenAmount);
    //completed event
	event Completed(bytes32 indexed InstanceId, address creator, address beneficiary, uint256 amount, IERC20 tokenAddress, uint256 tokenAmount);

	constructor() payable {
		owner = msg.sender;
        fund_wallet = msg.sender;
        fee = 250;
        createEnabled = true;        
	}

    //create
    function create(address _beneficiary, IERC20 _tokenAddress, uint256 _tokenAmount) external payable{
        address creator = msg.sender;
        uint256 amount = msg.value;
        address beneficiary = _beneficiary;
        IERC20 tokenAddress = _tokenAddress;
        uint256 tokenAmount = _tokenAmount;
        uint256 blockNumber = block.number;
        uint256 timestamp = block.timestamp;
        address contractAddress = address(this);

        require(createEnabled, "Instace Creation is Disabled!");
        require(creator != beneficiary, "Can Not Trade With Self!");
        require(amount > 0, "Amount Cannot be 0!");
        require(tokenAmount > 0, "Token Amount Cannot be 0!");
        require(creator.balance > amount, "Not Enough Balance To Proceed With The ETH You Set!");

        bytes32 _id = hashMe(
			string(abi.encodePacked(creator, beneficiary, blockNumber, timestamp)) 
			);

        Instance storage instance  = EscrowInstance[_id];
		require(!instance.exists, "_id Collision Detected, Reverting The Transaction!");

        EscrowInstance[_id] = Instance({
            exists: true,
            status: _Status.PENDING,
            creator: creator,
            beneficiary: beneficiary,
            tokenAddress: tokenAddress,
            tokenAmount: tokenAmount,
            prevTokenAmount: 0,
            amount: amount,
            prevAmount: 0,
            beneficiaryApproved: false,
            beneficiaryRejected: false,
            isCompleted: false,
            isCancelled: false
        });
        
        History storage creatorHistory = UserHistory[creator];
        History storage beneficiaryHistory = UserHistory[beneficiary];

        creatorHistory.user = creator;
        creatorHistory.InstanceIds.push(_id);
        
        beneficiaryHistory.user = beneficiary;
        beneficiaryHistory.InstanceIds.push(_id);

        emit Created(_id, creator, beneficiary, amount, tokenAddress, tokenAmount);

        (bool sent,) = payable(contractAddress).call{value: amount}("");
        require(sent, "Failed to send Ether");

    }

    function accept(bytes32 InstnaceId) external payable BeneficiaryOnly(InstnaceId) AcceptCheck(InstnaceId){
        Instance storage instance = EscrowInstance[InstnaceId];
        address creator = instance.creator;
        address beneficiary = instance.beneficiary;
        IERC20 tokenAddress = instance.tokenAddress;
        uint256 tokenAmount = instance.tokenAmount;
        uint256 amount = instance.amount;
       
        require(instance.exists, "Transaction Does Not Exist!");
        require(!instance.isCompleted && !instance.beneficiaryApproved, "Already Completed!");
        require(!instance.isCancelled, "Already Cancelled!");
        require(!instance.beneficiaryRejected, "Already Rejected!");
        require(tokenAmount != 0, "Can not transfer 0 Token!");
        
        EscrowInstance[InstnaceId] = Instance({
            exists: true,
            status: _Status.COMPLETED,
            creator: creator,
            beneficiary: beneficiary,
            tokenAddress: tokenAddress,
            tokenAmount: 0,
            prevTokenAmount: tokenAmount,
            amount: 0,
            prevAmount: amount,
            beneficiaryApproved: true,
            beneficiaryRejected: false,
            isCompleted: true,
            isCancelled: false
        });

        emit Accepted(InstnaceId, creator, beneficiary, amount, tokenAddress, tokenAmount);
        emit Completed(InstnaceId, creator, beneficiary, amount, tokenAddress, tokenAmount);

        tokenAddress.transferFrom(beneficiary, creator, tokenAmount);
        
        (bool sent,) = payable(beneficiary).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function reject(bytes32 InstnaceId) external payable BeneficiaryOnly(InstnaceId) InstanceExists(InstnaceId) {

        Instance storage instance = EscrowInstance[InstnaceId];
        address creator = instance.creator;
        address beneficiary = instance.beneficiary;
        IERC20 tokenAddress = instance.tokenAddress;
        uint256 tokenAmount = instance.tokenAmount;
        uint256 amount = instance.amount;

        require(instance.exists, "Transaction Does Not Exist!");
        require(!instance.isCompleted && !instance.beneficiaryApproved, "Already Completed!");
        require(!instance.isCancelled, "Already Cancelled!");
        require(!instance.beneficiaryRejected, "Already Rejected!");

        EscrowInstance[InstnaceId] = Instance({
            exists: true,
            status: _Status.REJECTED,
            creator: creator,
            beneficiary: beneficiary,
            tokenAddress: tokenAddress,
            tokenAmount: 0,
            prevTokenAmount: tokenAmount,
            amount: 0,
            prevAmount: amount,
            beneficiaryApproved: false,
            beneficiaryRejected: true,
            isCompleted: false,
            isCancelled: false
        });

        emit Rejected(InstnaceId, instance.creator, instance.beneficiary, amount, instance.tokenAddress, tokenAmount);

        (bool sent,) = payable(creator).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
    
    function cancel(bytes32 InstnaceId) external payable ParticipantsOnly(InstnaceId) InstanceExists(InstnaceId) {

        Instance storage instance = EscrowInstance[InstnaceId];
        address creator = instance.creator;
        address beneficiary = instance.beneficiary;
        IERC20 tokenAddress = instance.tokenAddress;
        uint256 tokenAmount = instance.tokenAmount;
        uint256 amount = instance.amount;

        require(instance.exists, "Transaction Does Not Exist!");
        require(!instance.isCompleted && !instance.beneficiaryApproved, "Already Completed!");
        require(!instance.isCancelled, "Already Cancelled!");
        require(!instance.beneficiaryRejected, "Already Rejected!");

        EscrowInstance[InstnaceId] = Instance({
            exists: true,
            status: _Status.CANCELLED,
            creator: creator,
            beneficiary: beneficiary,
            tokenAddress: tokenAddress,
            tokenAmount: 0,
            prevTokenAmount: tokenAmount,
            amount: 0,
            prevAmount: amount,
            beneficiaryApproved: false,
            beneficiaryRejected: false,
            isCompleted: false,
            isCancelled: true
        });

        emit Cancelled(InstnaceId, instance.creator, instance.beneficiary, amount, instance.tokenAddress, tokenAmount);

        (bool sent,) = payable(creator).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function changeFundWallet(address newFundWallet) external OwnerOnly {
        fund_wallet = newFundWallet;
    }

    function getHistory(address _user) external view returns(History memory){
		return UserHistory[_user];
    }

	// retrieves the instance by its Id
	function getEscrowById(bytes32 _id) external  view returns (Instance memory){
		return EscrowInstance[_id];
	}

    // a function to check the status of an instance
	function getStatus(bytes32 _id) external view returns (_Status, string memory) {
		Instance storage _escrow = EscrowInstance[_id];

		string[4] memory _status = ["PENDING", "COMPLETED", "CANCELLED", "REJECTED"];

		return (_escrow.status, _status[uint256(_escrow.status)]);
	}

    //generate id
    // uses to deduce the Id of an instance given the correct parameters
	function hashMe(string memory _data) private pure returns (bytes32){
		return keccak256(bytes(_data));
	}

	// will return an Instance Id 
	function getHash(address creator, address beneficiary, uint256 blockNumber, uint256 timestamp) external pure returns (bytes32){
		return hashMe(
			string(abi.encodePacked(creator, beneficiary, blockNumber, timestamp)) 
		);
	}

    // Uncomment for Testing in case a problem occurs in completing, cancelling or rejecting an instance to get your eth back
    // function withdraw() external OwnerOnly {
    //     require(address(this).balance > 0, "No More Eth To Withdraw");
    //    (bool sent,) = payable(owner).call{value: address(this).balance}("");
    //     require(sent, "Failed to send Ether");
    // }

    function setFee(uint256 _fee) external OwnerOnly {
        require(_fee <= 10000 && _fee >= 0, "Cannot be Less than 0 or greater than 10000");
        fee = _fee;
    }

    // enables or disables the creation of new instances in case a vulnerability or something that compromises everything happens
    function toggleCreate() external OwnerOnly {
        createEnabled = !createEnabled;
    }
    
    // allows the contract to receive funds
    receive() external payable {}

    modifier InstanceExists(bytes32 _id){
        Instance storage escrow = EscrowInstance[_id];
        require(escrow.exists, "Instance Does Not Exist!");
        _;
    }

    modifier AcceptCheck(bytes32 _id){
        Instance storage escrow = EscrowInstance[_id];
        require(escrow.exists, "Instance Does Not Exist!");
        require(escrow.tokenAddress.balanceOf(escrow.beneficiary) >= escrow.tokenAmount, "Not Enough Token Balance");
        require(escrow.tokenAddress.allowance(escrow.beneficiary, address(this)) >= escrow.tokenAmount, "Not Enough Allowance");
        _;
    }

    modifier ParticipantsOnly(bytes32 _id){
        Instance storage escrow = EscrowInstance[_id];
        require(msg.sender == escrow.beneficiary || msg.sender == escrow.creator, "Not Authorized!");
        _;
    }

    modifier BeneficiaryOnly(bytes32 _id){
        Instance storage escrow = EscrowInstance[_id];
        require(msg.sender == escrow.beneficiary, "Not Authorized!");
        _;
    }

    modifier HasEnoughBalance(bytes32 _id){
        Instance storage escrow = EscrowInstance[_id];
        require(escrow.tokenAddress.balanceOf(escrow.beneficiary) >= escrow.tokenAmount, "Not Enough Token Balance");
        _;
    }

    modifier OwnerOnly{
        require(msg.sender == owner, "Not Authorized");
        _;
    }
}