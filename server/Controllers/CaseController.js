const caseModel = require("../Models/Lt_CaseModel");

const getCaseById = async (req,res) => {
    try {
        const item = await caseModel.findOne({_id:req.query.id})
        return res.status(200).send(item)
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    getCaseById:getCaseById,
};