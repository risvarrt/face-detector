
const handleRegister = (req,res,db,bcrypt) => {
const { email, name, password }=req.body;
if(!email || !name || !password){
    return res.status(400).json('incorrect form submission')
}
  // var salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            }).then(user => {
                console.log(user);
                res.json(user);
            })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        
    .catch(err => res.status(400).json('User already exist and unable to join'))
}

module.exports ={
    handleRegister: handleRegister
};