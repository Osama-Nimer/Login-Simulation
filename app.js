import express from  "express";
import bcrypt from  "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
import dotenv from 'dotenv';
const port = process.env.PORT || 3000;

const users = [];
app.use(express.json());
dotenv.config();
app.post("/register",async (req,res) =>{
    try {
        const { email , password} = req.body;
        
        /* Start Input Validation ...*/


        /* End   Input Validation ...*/
        
        const find = users.find((data) => email == data.email);
        
        if(find)
            res.status(400).send("invalid email or password");
        const hashedPass = await bcrypt.hash(password,10);
        users.push({email: email , password: hashedPass});
        const lastIndex = users[users.length-1];
        const token = jwt.sign({ id : lastIndex.email },process.env.JWT_SECRET ,{
        expiresIn : '24h',})
        res.json({ token , message : "Regestration Successfully"})
    } catch (error) {
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        res.status(500).send(error.message);
    }   
})

app.post("/login",async (req,res) => {
    try {
        const { email , password} = req.body;
        const find = users.find((data) => email == data.email);
        if(!find)
            res.status(400).send("invalid email or password");
        const passMatch = await bcrypt.compare(password , find.password);
        if(passMatch){
            const token = jwt.sign({ id : find.email },process.env.JWT_SECRET ,{
                expiresIn : '24h',})
                res.status(200).json({ token }).send("Loggdin Successfully");
        }
        else
            res.status(400).send("invalid email or password");
    } catch (error) {
        res.status(500).send(error);
    }

    
})

app.listen(port,()=>{
    console.log(`Server Started on port ${port}`);
});
