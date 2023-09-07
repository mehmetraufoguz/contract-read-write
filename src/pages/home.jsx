import {
    Page,
    Navbar,
    NavTitle,
    NavRight,
    Block,
    BlockTitle,
    List,
    Button,
    ListInput,
    ListItem,
    f7
} from 'framework7-react';
import { useEffect, useState } from 'react';
import { erc20ABI, useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { isAddress } from 'viem';

import functions from "../js/functions";

const HomePage = () => {
    const { open } = useWeb3Modal();
    const { address } = useAccount();
    const [contractAddress, setContractAddress] = useState(f7.store.getters.contractAddress.value);
    const [contractABI, setContractABI] = useState(f7.store.getters.contractABI.value);
    const [dataContractRead, setContractRead] = useState({
        abi: Array.isArray(contractABI) ? contractABI : erc20ABI,
        address: contractAddress,
        functionName: "",
        args: [],
        cacheData: {}
    });
    const [dataContractWrite, setContractWrite] = useState({
        abi: Array.isArray(contractABI) ? contractABI : erc20ABI,
        address: contractAddress,
        functionName: "",
        args: [],
        cacheData: {}
    });

    const functionColor = (stateMutability) => {
        switch (stateMutability) {
            case 'nonpayable':
                return "orange"
                break;
            case 'payable':
                return "red"
                break;
            case 'view':
                return "blue"
                break;
            case 'pure':
                return "green"
                break;
            default:
                return "white"
                break;
        }
    }

    const { data: contractReadResult, refetch: contractReadRefetch, isSuccess: contractReadSuccess } = useContractRead(dataContractRead);
    const { data: contractWriteResult, writeAsync: contractWriteTrigger, isSuccess: contractWriteSuccess } = useContractWrite(dataContractWrite);
    const { data: contractWriteResultTX } = useWaitForTransaction({ hash: contractWriteResult && contractWriteResult.hash });

    async function triggerContract(relatedStates, type, event) {
        const triggeredButton = event.target;
        let functionIndex = triggeredButton.id.split("_")[1];
        let functionDetails = relatedStates[functionIndex];
        let preparedArgs = [];

        for (let i = 0; i < functionDetails.inputs.length; i++) {
            let argInput = document.getElementById(functionDetails.name + "_arg" + i)?.querySelector("input");
            if (argInput) {
                const formattedInputValue = functions.formatContractInput(argInput?.value, functionDetails.inputs[i].type);
                preparedArgs.push(formattedInputValue);
            } else {
                preparedArgs.push(null);
            }
        }

        if (!preparedArgs.includes(null)) {
            if (type == "read") {
                setContractRead({
                    ...dataContractRead,
                    address: contractAddress,
                    abi: contractABI,
                    functionName: functionDetails.name,
                    args: preparedArgs,
                    cacheData: functionDetails
                })
            }
            if (type == "write") {
                setContractWrite({
                    ...dataContractWrite,
                    address: contractAddress,
                    abi: contractABI,
                    functionName: functionDetails.name,
                    cacheData: functionDetails
                })
                await contractWriteTrigger({
                    args: preparedArgs
                });
            }
        }
    }

    const ContractFunctions = (type) => {
        if (address && (contractAddress) && (contractABI)) {
            let _contractABI;
            //-Check ABI-//
            try {
                _contractABI = contractABI;
            } catch (err) {
                return (
                    <p>Provided ABI is invalid.</p>
                )
            }
            //-Check Address-//
            let isValidAddress = isAddress(contractAddress);
            if (isValidAddress == false) {
                return (
                    <p>Provided contract address is invalid.</p>
                )
            }
            //--//
            let lookup = (type == 'read' ? ['view', 'pure'] : ['nonpayable', 'payable']);
            let relatedStates = _contractABI.filter(o => {
                if (lookup.includes(o.stateMutability) && o.type != 'constructor') {
                    return true;
                } else {
                    return false;
                }
            })

            const stateInputs = (item) => {
                if (item.inputs?.length > 0) {
                    return <List strong outline dividers>
                        <ListItem groupTitle title="Inputs" />
                        {
                            item.inputs.map(function (item2, i2) {
                                return <ListInput
                                    id={item.name + "_arg" + i2}
                                    label={item2.name + '[' + item2.type + ']'}
                                    clearButton
                                />
                            })
                        }
                    </List>
                } else {
                    return '';
                }
            }
            const stateOutputs = (item) => {
                if (item.outputs?.length > 0) {
                    return <List strong outline dividers>
                        <ListItem groupTitle title="Outputs" />
                        {
                            type == "read" ?
                            item.outputs.map(function (item2, i2) {
                                return <ListInput disabled
                                    id={item.name + "_result" + i2}
                                    label={item2.name + '[' + item2.type + ']'}
                                    clearButton
                                />
                            })
                            : <ListInput disabled
                                id={item.name + "_result0"}
                                label={'transactionHash[bytes32]'}
                                clearButton
                            />
                        }
                    </List>
                } else {
                    return '';
                }
            }
            const callable = (item, index) => {
                // if ((item.outputs?.length > 0) || (item.inputs?.length > 0)) {
                return <Button onClick={(e) => triggerContract(relatedStates, type, e)} id={"function_" + index} fill>Call</Button>
                // }
            }
            return (
                <div className="grid grid-cols-2 medium-grid-cols-4 grid-gap">
                    {
                        relatedStates.map(function (item, i) {
                            return <div>
                                <Block>
                                    <BlockTitle textColor={functionColor(item.stateMutability)}>
                                        {item.name}
                                    </BlockTitle>
                                    {stateInputs(item)}
                                    {stateOutputs(item)}
                                    {callable(item, i)}
                                </Block>
                            </div>
                        })
                    }
                </div>
            )
        } else {
            return (
                <p>You have connect wallet and set contract settings.</p>
            )
        }
    }

    const handleContractReturn = async (side, data) => {
        const contractResult = (side == "read" ? contractReadResult : contractWriteResultTX);
        if(side == "write"){
            document.getElementById(data.functionName + "_result0").querySelector("input").value = contractResult.transactionHash;
        }
        if (side == "read") {
            const methodOutputs = data.cacheData.outputs;
            if (methodOutputs?.length == 1) {
                document.getElementById(data.functionName + "_result0").querySelector("input").value = functions.formatContractReturn(contractResult, methodOutputs[0].type);
            } else if ((methodOutputs?.length > 1) && Array.isArray(methodOutputs)) {
                for (let i = 0; i < methodOutputs?.length; i++) {
                    const parameter = methodOutputs[i];
                    document.getElementById(data.functionName + "_result" + i).querySelector("input").value = functions.formatContractReturn(contractResult[i], parameter.type);
                }
            }
        }
    }

    useEffect(() => {
        if ((contractReadResult?.toString()) && (contractReadSuccess)) {
            handleContractReturn("read", dataContractRead);
        }
    }, [contractReadResult, contractReadSuccess]);

    useEffect(() => {
        if ((contractWriteResultTX?.toString()) && (contractWriteSuccess)) {
            handleContractReturn("write", dataContractWrite);
        }
    }, [contractWriteResultTX, contractWriteSuccess])
    return (
        <Page name='home'>
            <Navbar>
                <NavTitle sliding>Contract Read-Write</NavTitle>
                <NavRight>
                    <Button onClick={() => open()} color={
                        (address > 0 ? 'green' : 'blue')
                    } iconF7='wallet' text={
                        (address > 0 ? address.slice(0, 18) + '...' : 'Connect Wallet')
                    } />
                </NavRight>
            </Navbar>
            <Block>
                <BlockTitle>Read Functions</BlockTitle>
                {ContractFunctions('read')}
            </Block>
            <Block>
                <BlockTitle>Write Functions</BlockTitle>
                {ContractFunctions('write')}
            </Block>
            <Block>
                <BlockTitle>Settings</BlockTitle>
                <List>
                    <ListInput
                        outline
                        value={contractAddress}
                        label='Address'
                        placeholder='0x'
                        clearButton
                        onInput={(e) => {
                            f7.store.dispatch('contractAddress', { newAddress: e.target.value })
                            setContractAddress(e.target.value);
                        }}
                    />
                    <ListInput
                        outline
                        value={JSON.stringify(contractABI)}
                        label='ABI'
                        placeholder='[]'
                        clearButton
                        onInput={(e) => {
                            try {
                                const newArray = JSON.parse(e.target.value);
                                f7.store.dispatch('contractABI', { newABI: newArray })
                                setContractABI(newArray);
                            } catch (err) {}
                        }}
                    />
                </List>
            </Block>
        </Page>
    );
};
export default HomePage;