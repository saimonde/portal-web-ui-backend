const request=require('../requests');

module.exports.getDfsps=async()=> {
    let opts={
        endpoint:process.env.CENTRAL_LEDGER_ENDPOINT
    }
    const [dfsps] = await request.get('dfsps',opts);
    return dfsps;
}
