const express=require("express");
const { userAuth } = require("../middleware/auth");
const requestRouter=express.Router();

requestRouter.post("/sendrequest",userAuth,  async (req,res)=>{
    try{
          const newUser=req.user; //
        return res.status(201).send({ message: newUser.fname + " sent the Request successfully" });

    }catch(error){
        console.error(error);
        return res.status(500).send("An error occurred while sending the request: " + error.message);
    }
});

module.exports=requestRouter;