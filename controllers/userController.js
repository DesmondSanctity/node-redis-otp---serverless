import UserModel from '../model/User.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


/** POST: http://localhost:8080/api/user/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william"
}
*/
export async function register(req, res) {

  try {
    const { username, password, email, firstName, lastName } = req.body;

    // check the existing user
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username: username }, function (err, user) {
        if (err) reject(new Error(err))
        if (user) reject({ error: "Please use unique username" });

        resolve();
      })
    });

    // check for existing email
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email: email }, function (err, email) {
        if (err) reject(new Error(err))
        if (email) reject({ error: "Please use unique Email" });

        resolve();
      })
    });

    await Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt.hash(password, 10)
            .then(hashedPassword => {

              const user = new UserModel({
                username,
                password: hashedPassword,
                email,
                firstName,
                lastName
              });

              const { password, ...responseUser } = user._doc;
              // return save result as a response
              user.save()
                .then(result => res.status(201).send({
                  msg: "User Register Successfully",
                  User: responseUser
                }))
                .catch(error => res.status(500).send({ error }))

            }).catch(error => {
              return res.status(500).send({
                error: "Enable to hashed password"
              })
            })
        }
      }).catch(error => {
        return res.status(500).send({ error })
      })

  } catch (error) {
    return res.status(500).send(error);
  }

}


/** POST: http://localhost:8080/api/user/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/

export async function login(req, res) {

  const { email, password } = req.body;

  try {

    UserModel.findOne({ email })
      .then(user => {
        bcrypt.compare(password, user.password)
          .then(passwordCheck => {

            if (!passwordCheck) return res.status(400).send({
              error: "Don't have Password"
            });

            // create jwt token
            const token = jwt.sign({
              userId: user._id,
              username: user.username
            }, process.env.JWT_SECRET, { expiresIn: "24h" });

            return res.status(200).send({
              msg: "Login Successful...!",
              user: user,
              token
            });

          })
          .catch(error => {
            return res.status(400).send({ error: "Password does not Match" })
          })
      })
      .catch(error => {
        return res.status(404).send({ error: "Username not Found" });
      })

  } catch (error) {
    return res.status(500).send({ error });
  }

}
