export const escrowContract = {
    constractAddress : "0x8a5A0250072B8E908eE4fb500151c7072B5EDeD9",
    abi: [
        {
          inputs: [],
          stateMutability: "payable",
          type: "constructor"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "InstanceId",
              type: "bytes32"
            },
            {
              indexed: false,
              internalType: "address",
              name: "creator",
              type: "address"
            },
            {
              indexed: false,
              internalType: "address",
              name: "beneficiary",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "tokenAddress",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "tokenAmount",
              type: "uint256"
            }
          ],
          name: "Accepted",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "InstanceId",
              type: "bytes32"
            },
            {
              indexed: false,
              internalType: "address",
              name: "creator",
              type: "address"
            },
            {
              indexed: false,
              internalType: "address",
              name: "beneficiary",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "tokenAddress",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "tokenAmount",
              type: "uint256"
            }
          ],
          name: "Cancelled",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "InstanceId",
              type: "bytes32"
            },
            {
              indexed: false,
              internalType: "address",
              name: "creator",
              type: "address"
            },
            {
              indexed: false,
              internalType: "address",
              name: "beneficiary",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "tokenAddress",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "tokenAmount",
              type: "uint256"
            }
          ],
          name: "Completed",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "InstanceId",
              type: "bytes32"
            },
            {
              indexed: false,
              internalType: "address",
              name: "creator",
              type: "address"
            },
            {
              indexed: false,
              internalType: "address",
              name: "beneficiary",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "tokenAddress",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "tokenAmount",
              type: "uint256"
            }
          ],
          name: "Created",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "InstanceId",
              type: "bytes32"
            },
            {
              indexed: false,
              internalType: "address",
              name: "creator",
              type: "address"
            },
            {
              indexed: false,
              internalType: "address",
              name: "beneficiary",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              indexed: false,
              internalType: "contract IERC20",
              name: "tokenAddress",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "tokenAmount",
              type: "uint256"
            }
          ],
          name: "Rejected",
          type: "event"
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "InstnaceId",
              type: "bytes32"
            }
          ],
          name: "accept",
          outputs: [],
          stateMutability: "payable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "InstnaceId",
              type: "bytes32"
            }
          ],
          name: "cancel",
          outputs: [],
          stateMutability: "payable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newFundWallet",
              type: "address"
            }
          ],
          name: "changeFundWallet",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_beneficiary",
              type: "address"
            },
            {
              internalType: "contract IERC20",
              name: "_tokenAddress",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "_tokenAmount",
              type: "uint256"
            }
          ],
          name: "create",
          outputs: [],
          stateMutability: "payable",
          type: "function"
        },
        {
          inputs: [],
          name: "createEnabled",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "fee",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "fund_wallet",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "_id",
              type: "bytes32"
            }
          ],
          name: "getEscrowById",
          outputs: [
            {
              components: [
                {
                  internalType: "bool",
                  name: "exists",
                  type: "bool"
                },
                {
                  internalType: "enum Escrow._Status",
                  name: "status",
                  type: "uint8"
                },
                {
                  internalType: "address",
                  name: "creator",
                  type: "address"
                },
                {
                  internalType: "address",
                  name: "beneficiary",
                  type: "address"
                },
                {
                  internalType: "contract IERC20",
                  name: "tokenAddress",
                  type: "address"
                },
                {
                  internalType: "uint256",
                  name: "tokenAmount",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "prevTokenAmount",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "prevAmount",
                  type: "uint256"
                },
                {
                  internalType: "bool",
                  name: "beneficiaryApproved",
                  type: "bool"
                },
                {
                  internalType: "bool",
                  name: "beneficiaryRejected",
                  type: "bool"
                },
                {
                  internalType: "bool",
                  name: "isCompleted",
                  type: "bool"
                },
                {
                  internalType: "bool",
                  name: "isCancelled",
                  type: "bool"
                }
              ],
              internalType: "struct Escrow.Instance",
              name: "",
              type: "tuple"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "creator",
              type: "address"
            },
            {
              internalType: "address",
              name: "beneficiary",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "blockNumber",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256"
            }
          ],
          name: "getHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32"
            }
          ],
          stateMutability: "pure",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_user",
              type: "address"
            }
          ],
          name: "getHistory",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "user",
                  type: "address"
                },
                {
                  internalType: "bytes32[]",
                  name: "InstanceIds",
                  type: "bytes32[]"
                }
              ],
              internalType: "struct Escrow.History",
              name: "",
              type: "tuple"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "_id",
              type: "bytes32"
            }
          ],
          name: "getStatus",
          outputs: [
            {
              internalType: "enum Escrow._Status",
              name: "",
              type: "uint8"
            },
            {
              internalType: "string",
              name: "",
              type: "string"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "InstnaceId",
              type: "bytes32"
            }
          ],
          name: "reject",
          outputs: [],
          stateMutability: "payable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_fee",
              type: "uint256"
            }
          ],
          name: "setFee",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [],
          name: "toggleCreate",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          stateMutability: "payable",
          type: "receive"
        }
      ]
}