const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../model/User")

// update user 

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        // update Password
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                res.status(500).json(error)
            }
        }

        // save updated Infomation
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            //res.status(200).json("Account Updated")
            res.status(200).json(user)


        } catch (error) {

            res.status(500).json(error)
        }

    } else {
        response.status(403).json("You can update only your account")
    }
});

// delete user

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin)
     {
        // getting user that to be deleated
        try {
            const user = await User.findByIdAndDelete(req.params.id)
       
            res.status(200).json("Account deleted sucessfully")


        } catch (error) {

            res.status(500).json(error)
        }

    } else {
        response.status(403).json("You can delete only your account")
    }
});

//  get user 
router.get("/:id",async (req,res)=>{try {
    const user = await User.findById(req.params.id)
    const {password,updatedAt, ...other}= user._doc
    res.status(200).json(other)
    
} catch (error) {
    res.status(403).json("usesr Not Found")
    
}
 

})

// follow a user 

router.put("/:id/follow" , async (req,res)=>
{
    if (req.body.userId !== req.params.id)
    {
        try {
            const user = await User.findById(req.params.id)
            const currentuser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId))
            {
                try {

                await user.updateOne({$push :{ followers:req.body.userId} })
                await currentuser.updateOne({$push:{followings:req.params.id}})
                    res.status(200).json("user has been followed")
                }
                 catch (error) {
                    res.status(500).json(error)
                    
                }
            }
            else{ "You have already follwed this user "}
            
        } 
        catch (error) {
            res.status(500).json(error)
            
        }
    }
    else{
        res.status(403).json("sorry you cannot follow yourself")
    }
})

// unfollow a users 
router.put("/:id/follow" , async (req,res)=>
{
    if (req.body.userId !== req.params.id)
    {
        try {
            const user = await User.findById(req.params.id)
            const currentuser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId))
            {
                try {

                await user.updateOne({$pull :{ followers:req.body.userId} })
                await currentuser.updateOne({$pull:{followings:req.params.id}})
                    res.status(200).json("user has been unfollowed")
                }
                 catch (error) {
                    res.status(500).json(error)
                    
                }
            }
            else{"you havenot follwed this user "}
            
        } 
        catch (error) {
            res.status(500).json(error)
            
        }
    }
    else{
        res.status(403).json("sorry you cannot unfollow yourself")
    }
})



module.exports = router