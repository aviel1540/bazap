const escape = require("escape-html");
const validation = require("../utils/validation");
const brigadeServices = require("../services/brigadeServices")
const unitServices = require("../services/unitsServices")
const divisionServices = require("../services/divisionServices");

exports.getAllBrigades = async (req, res) => {
    let brigades;
    try {
        brigades = await brigadeServices.findAllBrigades();
        if (!brigades) return res.status(404).json({ message: "לא קיימות חטיבות" });
        return res.status(200).json(brigades);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


exports.getBrigadeById = async (req, res) => {
    const brigadeId = escape(req.params.brigadeId)
    let brigade;
    try {
        if (!brigadeId) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkBrigadeId = validation.addSlashes(brigadeId);
        brigade = await brigadeServices.findBrigadeById(checkBrigadeId);
        if (!brigade) return res.status(404).json({ message: "לא קיימת חטיבה" });
        return res.status(200).json(brigade);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}


exports.addNewBrigade = async (req, res) => {
    const divisionId = escape(req.params.divisionId)
    const brigadeName = escape(req.body.brigadeName)
    let division;
    let brigade;
    let unit;
    try {
        if (!brigadeName) return res.status(400).json({ message: "יש להזין שם חטיבה" })
        const checkDivisionId = validation.addSlashes(divisionId)
        division = await divisionServices.findDivisionById(checkDivisionId)
        if (!division) return res.status(404).json({ message: "לא נמצאה אוגדה" })
        const checkBrigadeName = validation.addSlashes(brigadeName)
        const brigadeExists = await brigadeServices.findBrigadeByName(checkBrigadeName)
        if (brigadeExists) return res.status(401).json({ message: "שם החטיבה קיים במערכת" })
        const brigadeUnitNumber = checkBrigadeName.match(/\d+/)[0];
        const brigadeNewName = "חטיבה " + brigadeUnitNumber
        brigade = await brigadeServices.addBrigade(brigadeNewName)
        const unitName = "מפחט " + brigadeUnitNumber
        unit = await unitServices.addUnit(unitName)
        brigade.unitsList.push(unit)
        division.brigadesList.push(brigade)
        await division.save();
        await brigade.save();
        await unit.save();
        return res.status(200).json(brigade);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


// exports.updateBrigadeName = async (req, res) => {
//     const brigadeId = escape(req.params.brigadeId);
//     const newBrigadeName = escape(req.body.newBrigadeName);
//     let newBrigade;
//     try {
//         if (!newBrigadeName) return res.status(400).json({ message: "יש להזין שם חטיבה" })
//         const checkBrigadeId = validation.addSlashes(brigadeId)

//     } catch (err) {

//     }
// }


exports.deleteBrigade = async (req, res) => {
    const brigadeId = escape(req.params.brigadeId);
    let brigade;
    try {
        if (!brigadeId) return res.status(400).json({ message: "יש למלא את השדות" });
        const checkBrigadeId = validation.addSlashes(brigadeId);
        brigade = await brigadeServices.findBrigadeById(checkBrigadeId);
        if(!brigade) return res.status(404).json({message:"לא נמצאה חטיבה"})
        if(brigade.unitsList.length > 0) return res.status(400).json({message:"קיימים גדודים תחת החטיבה"})
        await brigadeServices.deleteBrigade(checkBrigadeId);
        return res.status(200).json({message:"החטיבה נמחקה בהצלחה"});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}