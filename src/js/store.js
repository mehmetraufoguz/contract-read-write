import { createStore } from 'framework7/lite';

const store = createStore({
    state: {
        contractAddress: "0x44f07Ee4560a52cD9400f4160392f1376b14627e",
        contractABI: '[	{		"inputs": [			{				"internalType": "string",				"name": "_name",				"type": "string"			},			{				"internalType": "uint256",				"name": "_age",				"type": "uint256"			},			{				"internalType": "bool",				"name": "_sex",				"type": "bool"			}		],		"name": "addPerson",		"outputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"stateMutability": "nonpayable",		"type": "function"	},	{		"inputs": [			{				"internalType": "uint256",				"name": "_index",				"type": "uint256"			}		],		"name": "getPersonAge",		"outputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "uint256",				"name": "_index",				"type": "uint256"			}		],		"name": "getPersonAgeAndSex",		"outputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			},			{				"internalType": "bool",				"name": "",				"type": "bool"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"name": "peoples",		"outputs": [			{				"internalType": "string",				"name": "name",				"type": "string"			},			{				"internalType": "uint256",				"name": "age",				"type": "uint256"			},			{				"internalType": "bool",				"name": "sex",				"type": "bool"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [],		"name": "personCount",		"outputs": [			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "string",				"name": "_cache",				"type": "string"			}		],		"name": "pureReturn",		"outputs": [			{				"internalType": "string",				"name": "",				"type": "string"			}		],		"stateMutability": "pure",		"type": "function"	}]'
    },
    getters: {
        contractAddress: ({state}) => {
            return state.contractAddress;
        },
        contractABI: ({state}) => {
            return state.contractABI;
        }
    },
    actions: {
        contractAddress: ({state}, {newAddress}) => {
            state.contractAddress = newAddress;
        },
        contractABI: ({state}, {newABI}) => {
            state.contractABI = newABI;
        }
    },
})
export default store;
