/**
 * @dev Utility object for formatting contract-related data.
 */
export default {
    /**
     * @dev Formats contract return data based on its type.
     * @param data The contract return data.
     * @param type The type of the contract return data.
     * @returns Formatted contract return data.
     */
    formatContractReturn: (data, type) => {
        switch (true) {
            case /bool/.test(type):
                if(data == true){
                    return "true";
                }else{
                    return "false";
                }
                break;
            case /uint/.test(type):
                return BigInt(data).toString();
            case /address/.test(type):
                return data.toString();
            default:
                return data;
                break;
        }
    },
    /**
     * @dev Formats contract input data based on its type.
     * @param data The contract input data.
     * @param type The type of the contract input data.
     * @returns Formatted contract input data.
     */
    formatContractInput: (data, type) => {
        switch (true) {
            case /bool/.test(type):
                if(data == "true"){
                    return true;
                }else{
                    return false;
                }
                break;
            case /uint/.test(type):
                return BigInt(data);
            default:
                return data;
                break;
        }
    }
};