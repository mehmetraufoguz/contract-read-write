export default {
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
    }
};