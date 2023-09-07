import {
    f7ready,
    App,
    View,
} from 'framework7-react';

import routes from '../js/routes';
import store from '../js/store';

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
const queryClient = new QueryClient();

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'

const chains = [{
    id: 1967,
    name: "Metatime Testnet",
    network: "eleanor",
    nativeCurrency: {
        decimals: 18,
        name: "MTCT",
        symbol: "MTCT"
    },
    rpcUrls: {
        default: { http: ["https://rpc.metatime.com/eleanor"] },
        public: { http: ["https://rpc.metatime.com/eleanor"] }
    },
    blockExplorers: {
        etherscan: { name: "Metatime Explorer", url: "https://explorer.metatime.com/eleanor" },
        default: { name: "Metatime Explorer", url: "https://explorer.metatime.com/eleanor" }
    },
    contracts: {}
}];
const projectId = '999f30bf53975671462b2b201cb0177d'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

const MyApp = () => {
    const f7params = {
        name: 'Contract Read-Write',
        theme: 'ios',
        darkMode: true,
        store: store,
        routes: routes,
    };

    return (
        <QueryClientProvider client={queryClient}>
            <WagmiConfig config={wagmiConfig}>
                <App {...f7params}>
                    <View main className="safe-areas" url="/">
                        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
                    </View>
                </App>
                <ReactQueryDevtools initialIsOpen={false} />
            </WagmiConfig>
        </QueryClientProvider>
    )
}
export default MyApp;