const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const expressjwt = require('express-jwt');

const Op = require('sequelize').Op;
const connection = require('./util/database');


const Product = require('./models/product');
const User = require('./models/user');
const ProductUser = require('./models/product-user');
const Category = require('./models/category');
const Zayavka = require('./models/zayavki');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');



const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(cors());
// app.use((req, res, next) => {
//     User.findById(1)
//     .then(user => {
//         req.user = user;
//         next();
//     })
//     .catch(err => console.log(err));
// });

const jwtCheck = expressjwt({
    secret: "asd123445"
});

/*
<===== Получить все записи =====>
*/
app.get('/products', (req, res) => {
    Product.findAll()
    .then(products => {
        res
        .status(200)
        .json(products);
    })
    .catch(err => console.log(err));
});
/*
<===== Получить одну запись по айди =====>
*/
app.get('/product-detail/:productId', (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res
        .status(200)
        .json(product);
    })
    .catch(err => console.log(err));
});
/*
<===== Добавить запись =====>
*/
app.post('/add-product', (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const age_start = req.body.age_start;
    const age_end = req.body.age_end;
    const gender = req.body.gender;
    const status = req.body.status;
    const address = req.body.address;
    const direction = req.body.direction;

    Product.create({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        age_start: age_start,
        age_end: age_end,
        gender: gender,
        status: status,
        address: address,
        direction: direction
    })
    .then(data => {
        console.log('Created Product.')
        res
        .status(200)
        .json(data.dataValues);
    })
    .catch(err => console.log(err));
});
/*
<===== Обновить запись =====>
*/
app.post('/edit-product', (req, res) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    Product.findById(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.price = updatedPrice;
        product.description = updatedDescription;
        return product.save();
    })
    .then(result => {
        res
        .status(200)
        .json(result);
    })
    .catch(err => console.log(err));
});
/*
<===== Добавить запись User =====>
*/
app.post('/add-user', (req, res) => {
    const phone = req.body.phone;
    const password = req.body.password;
    const name = req.body.name;
    const plan = req.body.plan;
    const age = req.body.age;
    const gender = req.body.gender;
    const status = req.body.status;
    const priceStart = req.body.priceStart;
    const priceEnd = req.body.priceEnd;


    User.findAll({ where: {
        phone: phone
    }})
    .then(users => {
        if(!users[0]) {
            return User.create({
                phone: phone,
                password: password,
                name: name,
                age: age,
                gender: gender,
                status: status,
                priceStart: priceStart,
                priceEnd: priceEnd
            })
            .then(result => {
                plan.forEach(el => {
                    Category.create({ title: el, userId: result.id });
                });
                res
                .status(200)
                .send({ phone: result.phone, msg: "user created" });
            })
            .catch(err => console.log(err));
        }

        return res
            .status(200)
            .send({ phone: phone, msg: "user find" });
    })
    .catch(err => console.log(err));
});
/*
<===== Login User =====>
*/
app.post('/login', (req, res) => {
    if (!req.body.phone || !req.body.password) {
        res
        .status(400)
        .send('You need a phone and password');
        return;
    }

    User.findAll({ where: {
        phone: req.body.phone,
        password: req.body.password
    }})
    .then(user => {
        if (!user[0]) {
            res
            .status(401)
            .send('User not found');
            return;
        }

        const token = jwt.sign({
            user_id: user[0].id,
            phone: user[0].phone
        }, "asd123445", { expiresIn: "3 hours" });

        res
        .status(200)
        .send({ access_token: token });
    })
    .catch(err => console.log(err));
});

/*
<===== Поулчить Записи С ФИЛЬТРОМ =====>
*/
app.get('/products-filter-get', jwtCheck, (req, res) => {
    console.log(req.params)
    if(req.user.user_id !== 1) {
        User.findAll({
            include: [{
                model: ProductUser,
                where: {
                    userId: req.user.user_id
                },
                include: [ Product ]
            }]
        })
        .then(users => {
            users.forEach(user => {
                user.product_users.forEach(product => console.log(product.product.get()));
            });
            // if (products.length < 1) {
            //     res
            //     .status(200)
            //     .send('Нет подходящих курсов, по вашим фильтрам.');
            //     return;
            // }
            // products.forEach(product => {
            //     console.log(product);
            //     ProductUser.create({ productId: product.id, userId: req.user.user_id })
            // });
 
            res
            .status(200)
            .json(req.user.user_id);
        })
        .catch(err => console.log(err));
    } else {
        Product.findAll()
        .then(products => {
            res
            .status(200)
            .json(products);
        })
        .catch(err => console.log(err));
    }
});

// isAdmin
app.post('/is-admin', jwtCheck, (req, res) => {
    if (req.user.user_id !== 1) {
        res
        .status(200)
        .json({ isAdmin: false });
    } else {
        res
        .status(200)
        .json({ isAdmin: true });
    }
});

app.get('/status', jwtCheck, (req, res) => {
    const localTime = (new Date()).toLocaleTimeString();

    console.log(req.user.user_id)

    res
    .status(200)
    .send(`Server time is ${localTime}.`);
});

app.get('*', (req, res) => {
    res.sendStatus(404);
});


app.post('/products-filter', jwtCheck, (req, res) => {
    const userId = req.user.user_id;

    if (userId !== 1) {

        User.findAll({ 
            where: {
                id: userId,
            },
            attributes: ['id', 'name', 'phone', 'age', 'gender', 'status', 'priceStart', 'priceEnd'],
            include: [{
                model: Category,
                where: {
                    userId: userId
                },
                attributes: [['title', 'direction']]
            }]
        })
        .then(users => {
            

            if (users.length < 1) {
                res
                .status(200)
                .send('User not found!');
                return;
            }

            return users[0];
        })
        .then(user => {
            Product.findAll({
                where: {
                    status: user.status,
                    age_start: {
                        [Op.lte]: user.age
                    },
                    age_end: {
                        [Op.gte]: user.age
                    },
                    price: {
                        [Op.between]: [user.priceStart, user.priceEnd], 
                    },
                    [Op.or]: [{gender: user.gender }, {gender: 'MF'}]
                },
                attributes: ['id', 'title', 'description', 'price', 'imageUrl']
            })
            .then(products => {
                if (products.length < 1) {
                    res
                    .status(200)
                    .send('You filter not courses');
                    return 'You filter not courses';
                }
                return products;
            })
            .then(filterProducts => {
                if (filterProducts === 'You filter not courses') {
                    return;
                }
                res
                .status(200)
                .json(filterProducts);
            })
            .catch(error => {
                console.error(error)
            })
        })
        .catch(err => console.log(err));
    } else {
        Product.findAll({ 
            attributes: ['id', 'title', 'description', 'price', 'imageUrl']
        })
        .then(products => {
            res
            .status(200)
            .json(products);
        })
        .catch(err => console.log(err));
    }
});
/*
<===== Поулчить Записи С ФИЛЬТРОМ =====>
*/
app.get('/user-info', jwtCheck, (req, res) => {
    console.log(req.params)
    if(req.user.user_id !== 1) {
        User.findAll({
            include: [{
                model: ProductUser,
                where: {
                    userId: req.user.user_id
                },
                include: [ Product ]
            }]
        })
        .then(users => {
            users.forEach(user => {
                user.product_users.forEach(product => console.log(product.product.get()));
            });
            // if (products.length < 1) {
            //     res
            //     .status(200)
            //     .send('Нет подходящих курсов, по вашим фильтрам.');
            //     return;
            // }
            // products.forEach(product => {
            //     console.log(product);
            //     ProductUser.create({ productId: product.id, userId: req.user.user_id })
            // });
 
            res
            .status(200)
            .json(req.user.user_id);
        })
        .catch(err => console.log(err));
    } else {
        Product.findAll()
        .then(products => {
            res
            .status(200)
            .json(products);
        })
        .catch(err => console.log(err));
    }
});

app.post('/zayavka-na-kurs-proverka', jwtCheck, (req, res) => {
    Zayavka.findAll({
        where: {
            userId: req.user.user_id,
            productId: req.body.productId,
        }
    })
    .then(result => {
        if (result.length < 1) {
            res
            .status(200)
            .send({msg: "Добавить"})
        } else {
            res
            .status(200)
            .send({msg: "Вы успешно записались на данный курс!"})
        }
    })
    .catch(err => {
        console.log(err)
    })
});

app.post('/zayavka-na-kurs', jwtCheck, (req, res) => {

    Zayavka.findAll({
        where: {
            userId: req.user.user_id,
            productId: req.body.productId,
        }
    })
    .then(result => {
        if (result.length < 1) {
        Zayavka.create({ userId: req.user.user_id, productId: req.body.productId })
            .then(result => {
                res
                .status(200)
                .send({msg: "Вы успешно записались на данный курс!"})
            })
            .catch(err => {
                console.log(err);
                res
                .status(200)
                .send({msg: "Error"})
            })
        } else {
            res
            .status(200)
            .send({msg: "Вы успешно записались на данный курс!"})
        }
    })
    .catch(err => {
        console.log(err)
    })
});

app.post('/zayavki-all', jwtCheck, (req, res) => {
    Zayavka.findAll({
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
        ['id', 'DESC'],
        ],
        include: [{
            model: User,
            attributes: [ 'name', 'phone' ]
        },
        {
            model: Product,
            attributes: ['id', 'title', 'description', 'price', 'imageUrl']
        }]
    })
    .then(result => {
        res
        .status(200)
        .json(result)
    })
    .catch(err => {
        console.log(err)
    })
})


app.post('/test', (req, res) => {
    Product.findAll({
        include: [ User ],
    })
    .then(result => {
        res
        .status(200)
        .json(result)
    })
    .catch(err => {
        console.log(err)
    })
})



ProductUser.belongsTo(Product);
ProductUser.belongsTo(User);
User.hasMany(ProductUser);


Category.belongsTo(User);
User.hasMany(Category);

Zayavka.belongsTo(User);
Zayavka.belongsTo(Product);




// Product.belongsTo(User);


// User.hasOne(Cart);  
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });


connection
    .sync({ force: true })
    // .sync()
    .then(result => {
        return User.findById(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ phone: '87474891204', password: 'admin'});
        }
        return user;
    })
    .then(user => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    });