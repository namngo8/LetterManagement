const letterModel = require("../Models/Lt_LetterModel");
const caseModel = require("../Models/Lt_CaseModel");
const provinceModel = require("../Models/ProvinceModel");
const fs = require('fs');
const path = require('path');

const createLetter = async (req,res) => {
    try {
        const fileDocs = req.files.map(file => ({
            filename: file.originalname,
            contentType: file.mimetype,
            fileUrl: file.path,
        }));
        

        let cases = JSON.parse(req.body.cases)
        let letter = JSON.parse(req.body.letter)
        const ltcase = new caseModel({case_type:cases.type,field:cases.field,content:cases.content})
        ltcase.save().then(savedCase =>{
            const ltletter = new letterModel({
                gov_agency:letter.gov_agency,
                letter_no:letter.letter_no,
                source:letter.source,
                receive_at:letter.receive_at,
                sender_type:letter.sender_type,
                sender:[{
                    quantity:letter.sender.quantity,
                    owner:letter.sender.owner,
                    organ:letter.sender.organ,
                    position:letter.sender.position,
                    Id_card:letter.sender.Id_card,
                    Id_card_created_at:letter.sender.Id_card_created_at,
                    Id_card_created_in:letter.sender.Id_card_created_in,
                    gender:letter.sender.gender,
                    ethnic:letter.sender.ethnic,
                    nationality:letter.sender.nationality,
                    address:[{
                        province:letter.sender.address.province,
                        district:letter.sender.address.district,
                        commune:letter.sender.address.commune,
                        specified_address:letter.sender.address.specified_address,
                    }],
                }],
                is_eligible:letter.is_eligible,
                times_case:letter.times_case,
                pre_status:letter.pre_status,
                status:letter.status,
                case:savedCase._id,
                file: fileDocs,
            })
            ltletter.save();
        })
        return res.status(200).send('save success')
    } catch (error) {
        console.log(error);
        
    }
}

const getLetterLengthByCode = async (req,res) => {
    try {
        const lstLetter = await letterModel.find({letter_no:{$regex:req.query.code}})
        return res.status(200).send({length:lstLetter.length})
    } catch (error) {
        console.log(error);
        
    }
}

const getLetter = async (req,res) => {
    try {
        const limit = req.query.limit
        const page = req.query.page
        const skip = ( page- 1) * limit;
        let lstCase,lstCase1
        let ca_op =[]
        let ca_op1 =[]
        const que = {
            $and: [
                {gov_agency:{$regex:req.query.search.gov_agency}},
                {letter_no:{$regex:req.query.search.letter_no, $options: 'i'}},
            ]
        }
        if(req.query.search.cases_type!='') {
            lstCase = await caseModel.find({case_type:req.query.search.cases_type})
            lstCase.forEach((ca) => {
                ca_op.push(ca._id.toString())
            })
            que.$and.push({ case: { $in: ca_op } }); 
        }
        if(req.query.search.content!='') {
            lstCase1 = await caseModel.find({content:{$regex:req.query.search.content, $options: 'i'}})
            lstCase1.forEach((ca) => {
                ca_op1.push(ca._id.toString())
            })
            que.$and.push({ case: { $in: ca_op1 } }); 
        }
        if(req.query.search.daterange!='') {
            que.$and.push({ receive_at: { $gte: req.query.search.daterange[0], $lte: req.query.search.daterange[1] } }); 
        }
        if(req.query.search.source!='') {
            que.$and.push({source:req.query.search.source})
        }
        if(req.query.search.status!='') {
            que.$and.push({status:req.query.search.status})
        }
        if(req.query.search.sender_type!='') {
            que.$and.push({sender_type:req.query.search.sender_type})
        }
        if(req.query.search.sender!=''&&/[a-zA-Z]/.test(req.query.search.sender)) {
            que.$and.push({'sender.owner':{$regex:req.query.search.sender, $options: 'i'}})
        }
        else if(req.query.search.sender!=''&&!/[a-zA-Z]/.test(req.query.search.sender)) {
            que.$and.push({'sender.Id_card':{$regex:req.query.search.sender, $options: 'i'}})
        }
        
        const lstLetter = await letterModel.find(que).sort({ receive_at: -1 }).skip(skip).limit(limit)
        const lstPage1 = await letterModel.find(que).limit(limit)
        const lstFull = await letterModel.find(que)
        if (lstLetter.length == 0) {
            return res.status(200).send({fullLength:lstFull.length,page1Length:lstPage1.length});
        }
        return res.status(200).send({letter:lstLetter,fullLength:lstFull.length,page1Length:lstPage1.length})
    } catch (error) {
        console.log(error);
        
    }
}

const deleteLetter = async (req, res) => {
    try {
        const id = req.query.id;

        const letter = await letterModel.findOne({_id:id})

        await caseModel.deleteOne({_id:letter.case});
        

        await letterModel.deleteOne({_id:id});
        
        return res.status(200).send('delete success');
    } catch (error) {
        console.log(error);
    }
}

const getLetterById = async (req, res) => {
    try {
        const lt = await letterModel.findOne({_id:req.query.id});        
        const ca = await caseModel.findOne({_id:lt.case});
        const lstPro =  await provinceModel.find();
        let p,d,c
        lstPro.forEach((province) => {
            if(province._id.toString() == lt.sender[0].address[0].province) {
                p = province.name
            }
            province.districts.forEach((district) => {
                if(district._id.toString() == lt.sender[0].address[0].district) {
                    d = district.name
                }
                district.communes.forEach((commune) => {
                    if(commune._id.toString() == lt.sender[0].address[0].commune) {
                        c = commune.name
                    }
                })
            })
        })
        return res.status(200).send({letter:lt,ltcase:ca,province:p,district:d,commune:c});
    } catch (error) {
        console.log(error);
        
    }
}

const editLetter = async (req, res) => {
    try {
        const fileDocs = req.files.map(file => ({
            filename: file.originalname,
            contentType: file.mimetype,
            fileUrl: file.path,
        }));

        let deletedFile = JSON.parse(req.body.deletedFile)
        deletedFile.forEach((df) => {
            let filePath = path.join(__dirname, '../Khieu_nai_to_cao', 'Don_thu', 'Ho_so', df.filename);
            if(fs.existsSync(filePath)) {
                fs.unlink(filePath,(error) => {
                    if(error) {
                        console.log(error);
                        
                    }
                })
            }
        })

        let oldFile = JSON.parse(req.body.oldFile)
        oldFile.forEach((f) => {
            fileDocs.push({filename: f.filename, contentType: f.contentType, fileUrl: f.fileUrl})
        })
        

        let cases = JSON.parse(req.body.cases)
        let letter = JSON.parse(req.body.letter)
        await letterModel.findOneAndUpdate({_id:letter.id},{
            $set:{
                gov_agency:letter.gov_agency,
                letter_no:letter.letter_no,
                source:letter.source,
                receive_at:letter.receive_at,
                sender_type:letter.sender_type,
                'sender.0.quantity':letter.sender.quantity,
                'sender.0.owner':letter.sender.owner,
                'sender.0.organ':letter.sender.organ,
                'sender.0.position':letter.sender.position,
                'sender.0.Id_card':letter.sender.Id_card,
                'sender.0.Id_card_created_at':letter.sender.Id_card_created_at,
                'sender.0.Id_card_created_in':letter.sender.Id_card_created_in,
                'sender.0.gender':letter.sender.gender,
                'sender.0.ethnic':letter.sender.ethnic,
                'sender.0.nationality':letter.sender.nationality,
                'sender.0.address.0.province':letter.sender.address.province,
                'sender.0.address.0.district':letter.sender.address.district,
                'sender.0.address.0.commune':letter.sender.address.commune,
                'sender.0.address.0.specified_address':letter.sender.address.specified_address,
                is_eligible:letter.is_eligible,
                times_case:letter.times_case,
                pre_status:letter.pre_status,
                status:letter.status,
                file: fileDocs,
            }
        })
        await caseModel.findOneAndUpdate({_id:cases.id},{
            $set:{
                case_type:cases.type,
                field:cases.field,
                content:cases.content,
            }
        })
        return res.status(200).send('success');
    } catch (error) {
        console.log(error);
    }
}

const updateLtStatus = async (req, res) => {
    try {
        await letterModel.findOneAndUpdate({_id:req.query.id},{
            $set:{
                status:req.query.status,
            }
        })
        return res.status(200).send('success');
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    getLetterLengthByCode: getLetterLengthByCode,
    createLetter: createLetter,
    getLetter:getLetter,
    deleteLetter:deleteLetter,
    getLetterById:getLetterById,
    editLetter:editLetter,
    updateLtStatus:updateLtStatus,
};