const { User } = require("../model/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({id:doc.id, role:doc.role}); // whe virtuals used this doc to tge frontend goes without _
    console.log(doc); // when virtuals used it logs with _
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.body.email }
      //   "id name email" //because of this projection the password info isnt going to the below logic hence you cant compare the passwords
    ).exec(); //The second argument "id name email" is a projection, meaning:Only return these fields (id, name, and email) in the result.All other fields (like password) are excluded.
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "no such user email" });
    } else if (user.password === req.body.password) {
      try {
        console.log("login success");
        return res
          .status(200)
          // .json({ id: user.id, email: user.email, name: user.name, addresses : user.addresses }); //userInfo vs loggedInUser
          .json({ id: user.id, role:user.role }); 
      } catch (err) {
        return res.status(401).json({ message: "invalid credentials" });
      }
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
    // console.log(docs);
  } catch (err) {
    return res.status(400).json({ message: "something went wrong" });
    console.log("not happening", err);
  }
};
