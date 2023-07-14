const mongoToConnect=require('./db')
mongoToConnect()

const express = require('express')
const app = express()
const port = 3000
const Cors=require('cors')
const User = require('./User');
const { body, validationResult } = require('express-validator');


app.use(Cors())
app.use(express.json());


app.post('/',[
  body('name','enter a valid name').isLength({min:2}),
  body('email','enter a valid email').isEmail(),
  body('password','password must be atleast 5 characters').isLength({min:5}),
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      res.json({errors:errors.array});
    }
    else{
      
      const exist=await User.findOne({email:req.body.email})
      if(exist){
        res.json('exist')
      }
      else{
      User.create(req.body).then(user=>res.json(user))
    .catch(e=>console.log(e))  
      }
    } 
})

app.post('/login',async(req,res)=>{

  const{email,password}=req.body;
  const data=await User.findOne({email:email,password:password})
  const id=await User.findOne({email:email})
  if(data){
    res.json(data)
  }
  else if(id){
    res.json('mismatched')
  }
  else{
    res.json('notexist')
  }
}
)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

