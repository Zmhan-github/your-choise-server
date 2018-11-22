const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const expressjwt = require('express-jwt');

const connection = require('./util/database');


const Product = require('./models/product');
const User = require('./models/user');
const ProductUser = require('./models/product-user');
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

    User.findAll({ where: {
        phone: phone
    }})
    .then(users => {
        if(!users[0]) {
            return User.create({
                phone: phone,
                password: password
            })
            .then(result => {
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
<===== Добавить Записи С ФИЛЬТРОМ =====>
*/
app.post('/products-filter', jwtCheck, (req, res) => {
    const title = req.body.title;
    // const filter2 = req.body.filter2;
    if(req.user.user_id !== 1) {
        Product.findAll({ where: {
            title: title
        }})
        .then(products => {
            console.log(products)

            if (products.length < 1) {
                res
                .status(200)
                .send('Нет подходящих курсов, по вашим фильтрам.');
                return;
            }
            products.forEach(product => {
                ProductUser.create({ productId: product.id, userId: req.user.user_id })
            });

            res
            .status(200)
            .json("Add filters");
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
/*
<===== Поулчить Записи С ФИЛЬТРОМ =====>
*/
app.get('/products-filter-get', jwtCheck, (req, res) => {
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


ProductUser.belongsTo(Product);
ProductUser.belongsTo(User);
User.hasMany(ProductUser);

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// force: true will drop the table if it already exists { force: true }
connection
    .sync({ force: true })
    .then(result => {
        return User.findById(1);
    })
    .then(user => {
        if (!user) {
            User.create({ phone: '87474891204', password: 'admin'});
            return User.create({ phone: '89216554688', password: 'guest'});
        }
        return user;
    })
    .then(user => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    });