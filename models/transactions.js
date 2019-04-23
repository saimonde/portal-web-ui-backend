const request=require('../requests');



module.exports.getTransactionsByDfsp=async(id)=> {
    // let opts={
    //     endpoint:process.env.CENTRAL_LEDGER_ENDPOINT
    // }
    // const summary = await request.get('transfers',opts);
    // return summary;
    const transactions={
        TZS:{
            recieved:
                {
                    volume:70,
                    value:1700
                },
            sent:
                {
                    volume:6,
                    value:300000
                },
            cancelled:
                {
                    volume:2,
                    value:180000
            }
        }
    };

    return transactions;
}