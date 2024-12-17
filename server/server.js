const express = require("express");
const app = express();
const port = 3000;
const {connectDb} = require("./Services/ConnectDbService");
const cors = require("cors");
const model = require("./Models/AgencyModel");
const agencyRoute = require("./Router/AgencyRoute");
const provinceRoute = require("./Router/ProvinceRoute");
const letterRoute = require("./Router/LetterRoute");
const caseRoute = require("./Router/CaseRoute");
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());
connectDb();

app.use("/agency", agencyRoute);
app.use("/province", provinceRoute);
app.use("/letter", letterRoute);
app.use("/case", caseRoute);

app.get('/open/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, './Khieu_nai_to_cao', 'Don_thu', 'Ho_so',filename);
    

    if (fs.existsSync(filePath)) {
        if (filename.toLowerCase().endsWith(".pdf")) {
            res.setHeader("Content-Type", "application/pdf");
            res.sendFile(filePath);
        } else {
            res.download(filePath, filename, (err) => {
                if (err) {
                    res.status(500).send("Error downloading file");
                }
            });
        }
    } else {
        res.status(404).send('File not found');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});