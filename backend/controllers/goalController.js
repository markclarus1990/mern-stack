const asyncHandler = require("express-async-handler")

const Goal = require("../models/goalModel")
const User = require("../models/userModel")
//@desc     getGoals
//@route    GET /api/goals
//@access   Private
const getGoals = asyncHandler(async(req,res)=>
{
    const goals = await Goal.find({user:req.user.id})
    res.status(200).json(goals)
}
)

//@desc     setGoals
//@route    POST /api/goals
//@access   Private
const setGoals = asyncHandler(async(req,res)=>
{
    if(!req.body.text)
    {
        res.status(400)
        throw new Error("Please add a texfield!")
    }
       const goal = await Goal.create({
        text: req.body.text,
        user:req.user.id
       })
        res.status(400).json(goal)

   
}
)
//@desc     updateGoals
//@route    PUT /api/goals/:id  
//@access   Private
const updateGoals = asyncHandler(async(req,res)=>
{
    const goal = await Goal.findById(req.params.id)
    if(!goal)
    {
        res.status(400)
        throw new Error('Goal not found')
    }
   
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id,req.
        body,{
            new:true
        })
    res.status(200).json(updatedGoal)
}
)
//@desc     deleteGoals
//@route    DELETE /api/goals/:id
//@access   Private
const deleteGoals = asyncHandler(async(req,res)=>
{
    const goal = await Goal.findById(req.params.id)
    if(!goal)
    {
        res.status(400)
        throw new Error('Goal not Found')
    }
    const user = await User.findById(req.user.id)
    
    //Checking User
    if(!user)
    {
        res.status(401)
        throw new Error("User not found")
    }

    //Making sure login user matches the goal user
    if(goal.user.toString()!==user.id)
    {
        req.status(401)
        throw new Error("User not authorized")
    }
    await goal.remove()
    res.status(200).json({id:req.params.id})
})

module.exports = 
{
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals,
}

