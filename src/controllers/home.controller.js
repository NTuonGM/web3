const {db_AllProduct, db_IdProduct, db_Discount, db_Catalog, db_Group, db_BestDiscount, db_DiscountProduct,
    db_Productrating

} = require('../models/product.model');

const baseForm = require('../migration/view.func');



//Trả về trang chính
const getHome = async function (req, res){
    let best_discount = await db_BestDiscount();
    return res.render('index.ejs' , {best_Discount: best_discount[0]});
    
    
};

//Đăng xuất
const getLogout = function (req, res){
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clear the cookie if needed
        res.redirect('/');
    });  
};

//Trang sản phẩm
const getProduct = async function (req, res){
    let product = await db_AllProduct();
    let discount = await db_Discount();
    if (req.session.search){
        res.locals.search = req.session.search;
        delete req.session.search;
    }
    
    return res.render('product.ejs', {all_Product: product, all_Discount: discount});
    
};

const getIdProduct = async function (req, res){
    let id_product = req.params.id_product;
    let rating = await db_Productrating(id_product);
    let product = await db_IdProduct(id_product);
    let discount = await db_Discount();
    
    return res.render('product_detail.ejs', {id_Product: product[0], all_Discount: discount, rating: rating, baseForm: baseForm});
    
};



const postAddCart = function (req, res){
    if (req.session.isLoggedIn === true) {
        let Ma_san_pham = req.body.Ma_san_pham;
        let Ten_san_pham = req.body.Ten_san_pham;
        let Img = req.body.Img;
        let Gia_san_pham = req.body.Gia_san_pham;
        let So_luong = 1;
        let data = { Ma_san_pham, Ten_san_pham, Img, Gia_san_pham, So_luong };
    
        if (!req.session.cart) {        
            req.session.cart = [];
        }
    
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
        const productIndex = req.session.cart.findIndex(item => item.Ma_san_pham === data.Ma_san_pham);
    
        if (productIndex === -1) {
            // Sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
            req.session.cart.push(data);
        } else {
            // Sản phẩm đã tồn tại, cập nhật số lượng
            req.session.cart[productIndex].So_luong += 1;
        }
        const totalQuantity = req.session.cart.reduce((total, product) => total + product.So_luong, 0);
        // Gửi phản hồi về client
        res.send({ success: true, cart: totalQuantity });
    } else {
        res.send({ success: false });
    }
    
    
};


const getCatalog = async function (req, res){
    let id_catalog = req.params.id_catalog;
    let product = await db_Catalog(id_catalog);
    let discount = await db_Discount();
    return res.render('product.ejs', {all_Product: product, all_Discount: discount});
    
};


const getGroup = async function (req, res){

    let group1 = req.query.group1;
    let group2 = req.query.group2;
    let group3 = req.query.group3;
    let product = await db_Group(group1, group2, group3);
    let discount = await db_Discount();
    return res.render('product.ejs', {all_Product: product, all_Discount: discount});
    
};


const getDiscountProdcut = async function (req, res){
    let product = await db_DiscountProduct();
    let discount = await db_Discount();
    return res.render('product.ejs', {all_Product: product, all_Discount: discount});
    
};




const postSearch = function (req, res){
    const filter = req.body.filter;
    req.session.search = filter;
    // Thực hiện redirect bằng cách trả về một loại dấu hiệu
    res.send('redirect');
};



module.exports = {
    getHome,
    getLogout,
    getProduct,
    getIdProduct,
    postAddCart,
    getCatalog,
    getGroup,
    getDiscountProdcut,
    postSearch
};