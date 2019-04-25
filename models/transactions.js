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
                    volume:300,
                    value:170000
                },
            sent:
                {
                    volume:130,
                    value:300000
                },
            cancelled:
                {
                    volume:60,
                    value:180000
            }
        }
    };

    return transactions;
}