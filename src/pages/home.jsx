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
    ListInput
} from 'framework7-react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, useWeb3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig, useAccount } from 'wagmi'
import { bsc } from 'wagmi/chains'

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

    const ContractFunctions = (type) => {
        if(address && (contractAddress.length > 0) && (contractABI.length > 0)){
            let _contractABI;
            try{
                _contractABI = JSON.parse(contractABI);
            } catch (err) {
                return (
                    <p>Provided ABI is invalid.</p>
                )
            }
            return (
                <p>test</p>
            )
        }else{
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
                        (address > 0 ? address.slice(0,18) + '...' : 'Connect Wallet')
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