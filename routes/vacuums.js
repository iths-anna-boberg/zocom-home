const { Router} = require('express');
const router = new Router();
const {db, update} = require('./../db'); //triggar ändringar på frontend

router.get('/:id/:state', async (req, res)=>{

    let id = req.params.id;
    let state = (req.params.state === 'on') ? true : false;

    //update db
    db.get('devices').find({id:id}).assign({on : state}).value();

    //tell frontend to update
    update();
    res.send({msg: `vacuum is now ${req.params.state}`})

})


module.exports = router;