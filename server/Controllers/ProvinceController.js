const provinceModel = require("../Models/ProvinceModel");

const getProvince = async (req,res) => {
    try {
        const lstProvince = await provinceModel.find()
        return res.status(200).send(lstProvince)
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    getProvince: getProvince,
};