const router = require("express").Router();
const bcrypt = require("bcrypt")
const User = require("../model/User");

// register users
router.post("/register",async (req,res)=>{

    try{
        // generate new Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(req.body.password,salt)

        // create new user
        const newUser = new User({
            username: req.body.username,
            email:req.body.email,
            password:hashedPassword
            
        })


        // save user and get response 
        const user =  await newUser.save();
        res.status(200).json(user);
    }catch(err)
    {
        res.status(500).json(err)
    }
})


// login users 

router.post("/login",async(req,res)=>{
    try {
        // checking email 
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).send("User not found")

        // check password 
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        !validPassword && res.status(404).send("password not match")


        // sending response 
        res.status(200).json(user)
        
    } catch (error) {
        res.status(500).json(error)
        
    }

})

//

module.exports= router