const omit = require('ramda/src/omit');

exports.loadUsersIfNotExist = async (db, users) => {
    try {
        const User = db.User;
        const result = await User.findAndCountAll();

        if (!result.count) {
            await User.bulkCreate(users);
        }
    } catch(err) {
        throw err;
    }
};

exports.loadProductsIfNotExist = async (db, products) => {
    try {
        const Product = db.Product;
        const result = await Product.findAndCountAll();

        if (!result.count) {
            for (let product of products) {
                const productWithoutReviewers = omit(['reviewers'], product);
                const createdProduct = await Product.create(productWithoutReviewers);

                await createdProduct.setUsers(product.reviewers);
            }
        }
    } catch(err) {
        throw err;
    }
};
