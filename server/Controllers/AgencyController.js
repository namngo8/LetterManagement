const agencyModel = require("../Models/AgencyModel");

const getAgencies = async (req,res) => {
    try {
        const lstAgencies = await agencyModel.find()
        return res.status(200).send(lstAgencies)
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    getAgencies: getAgencies,
};