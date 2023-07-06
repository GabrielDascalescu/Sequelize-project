// Contents :






// Create a new instance of sequelize

const Sequelize = require('sequelize');

// bcrypt is a module that helps you hash and salt your passwords
// salt = randomly generate string you append to your string making it harder to decrypt

const bcrypt = require('bcrypt');

// compression and decompression (deflate , inflate ) only work with synchronous functions hence zlib

const zlib = require('zlib');
const { error } = require('console');

// Object deconstruction

const {DataTypes, Op} = Sequelize

// Constructor function for sequelize

const sequelize = new Sequelize('prototype', 'root', 'rootroot', {
    dialect : 'mysql',
});

// Check if the connection to the database was successful

sequelize.authenticate().then(() => {
    console.log("Connection successful")
}).catch((err) => {
    console.log("err")
})

// model = table in database

// define method for creating a table

const User = sequelize.define('user', {
    user_id:
    {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    username:{
        type : DataTypes.STRING,
        allowNull : false,
        // validation
        validate : {
            len : [4 , 6]
        },
        //getter
        // get(){
        //     const rawValue = this.getDataValue('username');
        //     return rawValue.toUpperCase();
        // }
    },
    password:
    {  
        type : DataTypes.STRING,
        //setter (stored in the parameter)
        // set(value){
        //     //generate salt
        //     const salt = bcrypt.genSaltSync(12);
        //     // hash user and password with salt
        //     const hash = bcrypt.hashSync(value, salt);
        //     this.setDataValue('password',hash);
        // }
    },
    age:
    {
        type : DataTypes.INTEGER,
        defaultValue : 21,
        // check if the person is old enough
        // validate :{
        //     isOldEnough(value){
        //         if( value < 21)
        //         {
        //             throw new Error ("Too young !");
        //         }
        //     }
        // }

        // using built in validator
        validate :{
            isNumeric :{
                msg : "You must enter a number or age"
            }
        }
    },
    cat_owner:
    {
        type : DataTypes.INTEGER,
        defaultValue : true
    },
    description:
    {
        type : DataTypes.STRING,
        //compressing and decompressing
        /*set(value){
            // defalteSync takes a buffer and outputs a buffer , we use toString to return a string
            const compressed = zlib.deflateSync(value).toString('base64');
            this.setDataValue('description',compressed);
        },
        get(){
            const value = this.getDataValue('description');
            // inflate sync decompresses a chunk of data , takes argument a buffer
            // buffer created from description using Buffer.from method
            const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64'));
            return uncompressed.toString();
        }*/
    },
    aboutUser :
    {
        // Virtual fields are fields that are not stored in our database
        // Virtual fields common use is to combine attributes
        type : DataTypes.VIRTUAL,
        // get()
        // {
        //     return `${this.username} ${this.description}`;
        // }
    },
    email :
    {
        // doesn't allow multiple rows to have the same email field
        type : DataTypes.STRING,
        unique : true,

        // make sure it is an acceptable email format

        // validate :{
        //     isEmail : true
        // }

        // To check if email is in the list below
        // custom validators
        // validate :{
        //     isIn : {
        //         args: ['me@ronaldo.org', 'me@ronaldo.com'],
        //         msg : 'The provided email must be one of the following'
        //     }
        // }
        allowNull : true,
        // validate :{
        //         myEmailValidator(value) {
        //             if( value == null) {
        //                 throw new Error("Please enter an email")
        //             }
        //         }
        // }
    }
},
{
    freezeTableName : true,
    timestamps : true,
    //model wide validation
    // validate :{
    //     usernamepassmatch() {
    //         if (this.username === this.password) {
    //             throw new Error("Password cannot be your username!");
    //         }
    //         else
    //         {
    //             console.log("Soccer");
    //         }
    //     }
    // },
    
});

// ----------------------------------------------------------
// |Inserting our table into MySql Workbench and syncing (1)|
// ----------------------------------------------------------

/*User.sync({force : true}).then(() => {
    console.log(" Table and model synced successfully")
}).catch((err)=> {
    console.log(" Error syncing the table and model")
})*/

// (If there are multiple tables) sync them all at once

//sequelize.sync({ force : true});

// drop tables || drop every table || certain tables

//User.drop(); || sequelize.drop(); || sequelize.drop({ match /_test$/ });

// --------------------------------------
// |Inserting data into the database (2)|
// --------------------------------------

/*User.sync({alter : true}).then(() => {
    return User.create({
        username : 'Nedelcu',
        password : '250',
        cat_owner : false,
        age : 17
    });

    // Create multiple objects at once
    return User.bulkCreate([
        {
            username : 'L'
        },
        {
            username : "M",
            age : 56,
            password : 'Siuu'
        },
        {
            username : 'S',
            cat_owner : false
        }
    ],
    // pass in validation for Bulk Create
    {validate : true});

}).then((data) => {
    // increment certain values
    //data.decrement({ age: 3})
    //data.increment({ age : 6})   

    //log multiple elements
    /*data.forEach((element) => {
        console.log(element.toJSON());
    });

}).catch((err) => {
    console.log(err);
})*/

// -----------------------------------
// | Finding items in a database (3) |
// -----------------------------------

/*User.sync({ alter : true}).then(() => {
    // return all items with findAll method || certain columns ( attributes)
    //return User.findAll({ attributes :[['username', 'MyName'], ['password', 'psswrd']]});
    
    //aggregations sequelize.fn() used to run a function
    //return User.findAll({ attributes : [[sequelize.fn('AVG',sequelize.col('age')),'average age']]});

    //exclude some attributes
    //return User.findAll({ attributes : {exclude : ['password']}});

    //filtering data by using where
    //return User.findAll({attributes: [['username', 'Myname']],  where : {age : 21}});

    //limiting the number of rows returned 
    //return User.findAll({ limit : 2});

    //order rows
    /*return User.findAll({ 
        attributes : [['username', 'MyName'],['age','MyAge']], 
        order : [['age', 'DESC']]
    })

    //group elements
    /*return User.findAll({ attributes: ['username',[sequelize.fn('SUM',sequelize.col('age')), 'sum_age']],
    group: 'username' })
    
    //using operators
    /*return User.findAll({ where :         
        //[Op.or]: {username : 'Alex', age: 45}

        // greater than (>) operator
        /*age :{
            [Op.gt] : 24
        }
        
        // smaller than (<) and equal (=) operators
        /*age:{
            [Op.or]: {
                [Op.lt]:45,
                [Op.eq]: null
            }
        }

        // use sequelize.fn() with sequelize.where()
        //sequelize.where(sequelize.fn('char_length', sequelize.col('username')), 6)

        

    });

    // updating data in the table
    return User.update({ username : 'Mariussefs'}, {
    where:
    {
        [Op.and]:
        {
            age : 17,
            username : 'Andrei',
            user_id : 4
        }
    }});

}).then((data) =>{
    console.log(data);
}).catch((err) =>{
    console.log(err);
});*/

// --------------------
// |Finder methods (4)|
// --------------------

/*User.sync({ alter : true}).then(() =>{
    // raw method (toJSON for noninstances)
    //return User.findAll({ raw : true})

    // find by primary key
    //return User.findByPk(8);

    // return the first row it finds
    //return User.findOne();

    // find or create an item
    //return User.findOrCreate({ where : {username : 'Andra'},defaults:{age : 50}});

    // find and count all items
    return User.findAndCountAll({
        where :{ username : 'Gabi'},
        raw : true
    })

}).then((data) =>{ 
    //object deconstruction to check status of operations
    const { count , rows} = data;
    console.log(rows);
    console.log(count);
}).catch((err) =>{
    console.log(err);
});*/

// -------------------------
// |Setters and Getters (5)|
// -------------------------

// defined in the table at row 27
// ONLY WORK WITH SYNCHRONOUS FUNCTIONS

/*User.sync({alter : true}).then(() =>{
    return User.findOne();
}).then((data) =>{
    console.log(data.username)
}).catch((err) =>{
    console.log(err);
});*/

/*User.sync({alter : true}).then(() =>{
    return User.findOne({ where:{
        username : "Matt",
    }});
}).then((data) =>{
    console.log(data.aboutUser);
}).catch((err) => {
    console.log(err);
});*/


//--------------------------------
//|Validators and Constraints (6)|
//--------------------------------

/*User.sync({alter : true}).then(() => {
    return User.create({
        username : 'Cristi',
        password : 'mypass',
        email :'hello'
    })
}).then((data) =>{
    console.log(data.toJSON());
}).catch((err) =>{
    console.log(err);
})*/

// Validate data before it is even inserted

/*User.sync({alter : true}).then(() => {
    // build doesnt actually insert anything into the database
    // const user = User.build({ email : 'tom' });
    // return user.validate();
    return User.create({
      username : 'Marius',
      password : 'Marius',
      email : "me@siuii.org"
    })
    
}).then((data) =>{
    console.log(data);
}).catch((err) =>{
    console.log(err);
})*/

//-----------------------------------
//|Sql injection and Raw Queries (7)|
//-----------------------------------

//Custom logging function
/* function myFunction() {
     console.log("Running sql statement")
}*/

/*User.sync({alter : true}).then(() =>{
    // returns an array containing results and an object containing metadata
    //return sequelize.query(`UPDATE user SET age = 50 WHERE username = 'Marius'`)
    
    //                                            says that the query is a select query
    //return sequelize.query(`SELECT * FROM user`, {type : Sequelize.QueryTypes.SELECT})
    
    //                                                                               says that the query is an update query
    //return sequelize.query(`UPDATE user SET age = 100 WHERE username = 'Marius'`, {type : Sequelize.QueryTypes.UPDATE})

    // putting model : ..... returns instances from our table ( plain returns only one user)
    //return sequelize.query(`SELECT * FROM user LIMIT 2`, { model : User, plain : true})

    //                                                    referencing out custom function
    //return sequelize.query(`SELECT * FROM user LIMIT 2`,{ logging : myFunction});

    // sql injection protection
    // return sequelize.query(`SELECT * FROM user WHERE username LIKE :username`, {
    //     replacements: {username : 'Mari%'}
    // })

    // using bind parameters ( send sql statements and data separately)


}).then((data) => {
    console.log(data);
}).catch((err) =>{
    console.log(err);
})*/

//---------------------
//|Paranoid tables (8)|
//---------------------

// A paranoid table is a table in which a record is soft deleted
// soft deletion marks records as deleted with actually deleting them
// hard deletion means you are completely removing the record from the table

User.sync({ alter : true }).then(() =>{
    return User.destroy ({ where : {user_id : 18}})

}).then((data) =>{
    console.log(data);
}).catch((err) =>{
    console.log(err);
})