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
    CardHeader,
    CardContent,
    CardFooter,
    Card,
    ListItem,
    f7
} from 'framework7-react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, useWeb3Modal } from '@web3modal/react'
import { configureChains, createConfig, useAccount, useContractRead } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { isAddress } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';

const chains = [bsc];
const projectId = '999f30bf53975671462b2b201cb0177d';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const HomePage = () => {
    const [contractAddress, setContractAddress] = useState("");
    const [contractABI, setContractABI] = useState("");
    const { address } = useAccount();
    const { open } = useWeb3Modal();
    let readOrders = [];

    function triggerOrders() {
        console.log(readOrders[0]);
        if(readOrders[0]){
            const { data } = useContractRead(readOrders[0])
            console.log(data);
            // readOrders = readOrders.shift();
        }
    }

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

    function triggerContract(relatedStates, type, event) {
        const triggeredButton = event.target;
        let functionIndex = triggeredButton.id.split("_")[1];
        let functionDetails = relatedStates[functionIndex];
        console.log(functionDetails);
        if (type == "read") {
            readOrders.push({
                address: f7.store.getters.contractAddress.value,
                abi: f7.store.getters.contractABI.value,
                functionName: functionDetails.name
            })
        }
    }

    const ContractFunctions = (type) => {
        if (address && (f7.store.getters.contractAddress.value) && (f7.store.getters.contractABI.value)) {
            let _contractABI;
            //-Check ABI-//
            try {
                _contractABI = JSON.parse(f7.store.getters.contractABI.value);
            } catch (err) {
                return (
                    <p>Provided ABI is invalid.</p>
                )
            }
            //-Check Address-//
            let isValidAddress = isAddress(f7.store.getters.contractAddress.value);
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
            console.log(relatedStates);

            const stateInputs = (item) => {
                if (item.inputs?.length > 0) {
                    return <List strong outline dividers>
                        <ListItem groupTitle title="Inputs" />
                        {
                            item.inputs.map(function (item2, i2) {
                                return <ListInput
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
                            item.outputs.map(function (item2, i2) {
                                return <ListInput disabled
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
            const callable = (item, index) => {
                if ((item.outputs?.length > 0) || (item.inputs?.length > 0)) {
                    return <Button onClick={(e) => triggerContract(relatedStates, type, e)} id={"function_" + index} fill>Call</Button>
                }
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
                        label='Address'
                        placeholder='0x'
                        clearButton
                        onInput={(e) => {
                            f7.store.dispatch('contractAddress', { newAddress: e.target.value })
                            setContractAddress(f7.store.getters.contractAddress.value);
                        }}
                    />
                    <ListInput
                        outline
                        label='ABI'
                        type='textarea'
                        placeholder='[]'
                        clearButton
                        onInput={(e) => {
                            f7.store.dispatch('contractABI', { newABI: e.target.value })
                            setContractABI(f7.store.getters.contractABI.value);
                        }}
                    />
                </List>
            </Block>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </Page>
    );
};
export default HomePage;