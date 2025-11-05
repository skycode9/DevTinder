## Homework

- Create a repository
- Initiliize the repossitory
- npm init -y (package.json)
- Create src/app.js file
- npm i express (node_modules, package-lock.json, check the dependenci in package.json)
- Create a server (const app = require('express'))
- Listen to port 3030
- Write a request handler for "/", "/test", "/hello"
- Install nodemon and update the scripts inside the package.json
- What are the dependencies in package.json?
- What is the "-g" flag in npm i nodemon?
- What is diffrence between ~ and ^ in package.json?
- What is the difference between devDependencies and dependencies?
- What is the difference between package.json and package-lock.json?

## Routes and Request Handlers

- Play with the routes and route extensions ex. '/hello', '/', '/hello/2'
- Order of the routes matter most.
- Install a Postman and make a workspace/collection > Test API calls
- Write the logic of GET, POST, PUT, DELETE, PATCH API calls and test them in Postman
- Exploren rounting and use of ?, +, \*, (), | in the routes
- Use of regex in the routes /a/, /\*fly$/
- Reading the query parmas ?name=akash&age=22 in the route
- Reading the route parameters /:name/:age --> Dynamic Routes

## Middlewares and Error Handlers

- Multiple routes with the handler play with code
- next()
- next functions and errors along with res.send()
- app.use("/route", rH, [rh1,rh2] ,rh3, rh4);
- What is Middleware? and why we use it?
- Diffrence between app.use and app.all
- Write a dummy auth middleware and test it for admin and user routes
- Error Handling with app.use(err, req, res, next) and try catch method

## Database & Schema, Models and Mongoose

- Create a free culster on a MongoDB website
- Install a mongoose liabrary (npm i mongoose)
- Connect your application to the Database --> <ConnectionURL>/DBname
- Call the ConnectDB fn and connect the Databse and after run the application on port like 3030
- Create a UserSchema and UserModel
- Create POST/SignUp API to add data to the Database
- Push some documents using API calls from postman

## Diving into the APIS

- JS Object VS JSON find the diffrence
- Add the express.json() middleware to your app for convert your json to js object
- Make your signup API dynamic to receive dat from end user
- User.findOne() with duplicate email ids, which one is returned
- API - get user by emailId
- API - feed API - get all the users from the database
- Diffrent between patch() and put()
- API - update the user
- API - update the user by emailId
- API - Delete the user

## Data Sanitization and Schema Validation

- Explore Schematype options from the doc
- add require, minLenth, min, trim, unique, lowercase
- Add Default
- Create a custom validation function for gender
- Improve the DB Schema - put all the approppriate validation to each field in the Schema
- Add the timestamps in the UserSchema
- Add API level validation on Patch request & Signup post api
- DATA Sanitizing - Add API validation for each field
- Install validator
- Explore validator library funcation and Use vlidator funcs for password, email, photoURL
- Never Trust your req.body

## Encrypting Password

- Validate data in Signup API
- Install bcrypt package
- Create PasswordHash using bcrypt.hash & save the user is excrupted password
- Create login API
- Compare passwords and throw errors if email or password is invalid

## Authentication , JWT and Cookies

- install cookie-parser
- just send a dummy cookie to user
- create GET /profile APi and check if you get the cookie back
- install jsonwebtoken
- IN login API, after email and password validation, create e JWT token and send it to user in cookies
- read the cookies inside your profile API and find the logg
- userAuth Middleware
- Add the userAuth middle ware in profile API and a new sendConnectionRequest API
- Set the expiry of JWT token and cookies to 7 day
- Create userSchema method to getJWT()
- Create UserSchema method to comparepassword(passwordInputByUser)

## Diving into the APIS and express Routers

- Explore tinder APIs
- Create a list all API you can think of in Dev Tinder
- Group multiple routes under repective routers
- Read documentation for express.Router
- Create routes folder for managing auth,profile, request routers
- create authRouter, profileRouter, requestRouter
- Import these routers in app.js
- Create POST /logout API
- Create PATCH /profile/edit
- Create PATCH /profile/password API => forgot password API
- Make you validate all data in every POST, PATCH apis

## Logical DB Query and Compound Indexes

- Create Connnection Request Schema
- Send Connection Request API
- Proper validation of Data
- Think about ALL corner cases
- $or query $and query in mongoose - https://www.mongodb.com/docs/manual/reference/operator/query-logical/
- schema.pre("save") function
- Read more about indexes in MongoDB
- Why do we need index in DB?
- What is the advantages and disadvantage of creating?
- Read this arcticle about compond indexes - https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/
- ALWAYS THINK ABOUT CORNER CASES

## ref, Populate & Thought process of writing APIs

- Write a code with proper validation for thi API - POST /request/review/:status/:requestId
- Thought process - POST vs GET
- Read about ref and populate https://mongoosejs.com/docs/populate.html
- Create GET /user/requests/received with all the checks

## Feed Api and Pagination

- Logic for GET /feed API
- Explore the $nin , $and, $ne and other query operatorators

NOTES:

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)

/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

/feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)

/feed?page=4&limit=10 => 21-30 => .skip(20) & .limit(10)

skip = (page-1)\*limit;
