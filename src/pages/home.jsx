import React, { useState } from 'react';
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
    ListItem
} from 'framework7-react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, useWeb3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig, useAccount } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { isAddress } from 'ethers/lib/utils';

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
    const { address } = useAccount();
    const [contractAddress, setAddress] = useState('');
    const [contractABI, setABI] = useState('');

    const { open } = useWeb3Modal();

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

    const ContractFunctions = (type) => {
        if (address && (contractAddress.length > 0) && (contractABI.length > 0)) {
            let _contractABI, _contractAddress;
            //-Check ABI-//
            try {
                _contractABI = JSON.parse(contractABI);
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
                                    <Button fill>Call</Button>
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
                            setAddress(e.target.value)
                        }}
                    />
                    <ListInput
                        outline
                        label='ABI'
                        type='textarea'
                        placeholder='[]'
                        clearButton
                        onInput={(e) => {
                            setABI(e.target.value)
                        }}
                    />
                </List>
            </Block>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </Page>
    );
};
export default HomePage;