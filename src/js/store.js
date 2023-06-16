import { createStore } from 'framework7/lite';

const store = createStore({
    state: {
        contractAddress: "",
        contractABI: "[]"
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
