const express = require('express');
const router = express.Router();
const letterController = require('../Controllers/LetterController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../Khieu_nai_to_cao', 'Don_thu', 'Ho_so');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const filePath = path.join(__dirname, '../Khieu_nai_to_cao', 'Don_thu', 'Ho_so', file.originalname);
    
    if (fs.existsSync(filePath)) {
        cb(null, false);
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: fileFilter
    // fileFilter: (req, file, cb) => {
    //     cb(null, false);
    // }
});

router.get('/getLetterLengthByCode', letterController.getLetterLengthByCode);
router.post('/createLetter', upload.array('files', 5), letterController.createLetter);
router.get('/getLetter', letterController.getLetter);
router.get('/deleteLetter', letterController.deleteLetter);
router.get('/getLetterById', letterController.getLetterById);
router.post('/editLetter', upload.array('files', 5), letterController.editLetter);
router.get('/updateLtStatus', letterController.updateLtStatus);

module.exports = router;