const handlesignin = (req,res,db,bcrypt) => {
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json('incorrect form submission')
    }
db.select('email','hash').from('login')
.where('email','=',req.body.email)
.then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);
    console.log(isValid);
    if(isValid){
        return db.select('*').from('users')
            .where('email','=',email)
            .then(user => {
                console.log(user);
                res.json(user[0])
            })
            .catch(err => res.status(400).json('Unable to get user'))
        }else
        {
            res.status(400).json('Wrong credentials')
        }     
})
.catch(err => res.status(400).json('Wrong Password or Email'))
}

module.exports= {
    handlesignin: handlesignin
}