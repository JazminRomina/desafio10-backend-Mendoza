import ticketsModel from "../models/tickets.model.js"
import usersModel from "../models/users.model.js"
import { CartService } from "../services/carts.service.js"
import { ProductService } from "../services/products.service.js"

export class CartsController {
    newCart = async(req, res) => {
        try{
            const cart = await CartService.createCart([])
            res.send({message: 'There is a new cart', cart: cart})
        }
        catch(error){
            res.status(500).json({error: 'ID Not found.'})
        }
    }

    cartIdFound = async(req, res) => {
        let id = req.params.id
        try{
            const findId = await CartService.findId(id)
            res.json(findId)
        }
        catch(error){
            res.status(500).json('There is an error in the server.')
        }
    }

    addProdtotheCart = async(req, res) => {
        try{
            let cid = req.params.cid
            let pid = req.params.pid
            await CartService.addProductToTheCart(cid, pid)
            res.status(200).json({ message: 'The product has been added.'})
        }
        catch(error){
            res.status(500).json('There is an error in the server.')
        }
    }

    deleteProdFromCart = async(req, res) => {
        try{
            let cid = req.params.cid
            let pid = req.params.pid
            await CartService.deleteaProductFromTheCart(cid, pid)
            res.send('The product has been eliminated from the cart.')
        }
        catch(error){
            res.status(500).json('There is an error in the server.')
        }
    }

    updateProdCart = async(req, res) => {
        let cid = req.params.cid
        let prods = req.body
        try{
            await CartService.updateProductsFromCart(cid,prods)
            res.send('Products have been updated.')
        }
        catch(error){
            res.status(500).json('There is an error in the server.')
        }
    }

    updateQuantity = async(req, res) => {
        let cid = req.params.cid
        let pid = req.params.pid
        const quantityProd = req.body
        try{
            await CartService.updateQuantity(cid,pid, quantityProd)
            res.send('The quantity of the product has been changed.')
        }
        catch(error){
            res.status(500).json('There is an error in the server.')
        }
    }

    deleteAllFromCart = async(req, res) => {
        let cid = req.params.cid
        try{
            await CartService.deleteAllProdsInTheCart(cid)
            res.send('All products have been deleted.')
        }
        catch(error){
            res.status(500).json('There is an error in the server.')
        }
    }

    purchase = async(req, res) => {
        let cid = req.params.cid
        try{
            const notAvailable = []
            const findIdCart = await CartService.getCartById(cid)
            const prodsCart = findIdCart.products
            let totalPrice = 0
            for (const prod of prodsCart){
                const prodId = prod.product
                const findProd = await ProductService.findIdProd(prodId)
                const product = findProd[0]
                findProd.map(p => {
                    if(p.stock >= prod.quantity){
                        totalPrice += prod.quantity * product.price
                        p.stock -= prod.quantity
                        p.save()
                    }
                    else{
                        notAvailable.push({product: p, quantity: prod.quantity})
                    }
                })
                }

            if (totalPrice === 0) {
                return res.status(400).json({ error: 'No products available for purchase.' })
            }
            const cartUser = await usersModel.findOne({cart: cid})
            const getTicket = await ticketsModel.create({
                purchaser: cartUser.email,
                amount: totalPrice
            })
            await getTicket.save()

            const userCart = await CartService.findId(cid)
            userCart.products = notAvailable
            await userCart.save()

            res.send('Purchase')
        }
        catch(error){
            res.status(500).json({ error: 'There is an error in the server.' })
        }
    }
}