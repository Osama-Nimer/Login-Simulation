import express from  "express";
import bcrypt from  "bcrypt";

const app = express();
const port = 3000;

const users = [];
app.use(express.json());

app.post("/register",async (req,res) =>{
    try {
        const { email , password} = req.body;
        const find = users.find((data) => email == data.email);
        if(find)
            res.status(400).send("invalid email or password");
        const hashedPass = await bcrypt.hash(password,10).then();
        users.push({email: email , password: hashedPass});
        console.log(users);
        res.status(201).send("Register Created Successfully");
    } catch (error) {
        res.status(500).send(error);
    }
})

app.post("/login",async (req,res) => {
    try {
        const { email , password} = req.body;
        const find = users.find((data) => email == data.email);
        if(!find)
            res.status(400).send("invalid email or password");
        const passMatch = await bcrypt.compare(password , find.password);
        if(passMatch)
            res.status(200).send("Loggdin Successfully");
        else
            res.status(400).send("invalid email or password");
    } catch (error) {
        res.status(500).send(error);
    }

    
})

app.listen(port,()=>{
    console.log(`Server Started on port ${port}`);
});
