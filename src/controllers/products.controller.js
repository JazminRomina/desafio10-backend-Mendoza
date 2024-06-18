import { ProductService } from "../services/products.service.js"
import { getProductsFaker } from "../utils/faker.js"
import customError from "../services/errors/custom-error.js"
import generateErrorProds from "../services/errors/infoProds.js"
import { Errors } from "../services/errors/enum.js"

export class ProductsController {
    prods = async(req, res) => {
        try{
            const products = await ProductService.getAllProdsViews(req)
            res.status(200).json(products.response)
        }
        catch(error){
            res.status(500).json('There is an error in the server.')
        }
    }

    findId = async(req, res) => {
        let pid = req.params.pid
        try{
            const findProd = await ProductService.findIdProd(pid)
            res.json(findProd)
        }
        catch (error){
            res.status(500).json('There is an error with the ID / Item not Found.')
        }
    }

    addProd = async(req, res, next) => {
        const newProduct = req.body
        try{
            if(!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock || !newProduct.status || !newProduct.category){
                console.log(newProduct)
                throw customError.createError({
                    name: "New Product",
                    cause: generateErrorProds({newProduct}),
                    message: "Error al intentar crear un producto",
                    code: Errors.TYPE_INVALID
                })
            }
            const product = await ProductService.addProducts(newProduct)
            res.send({message: 'This Product has been added', product: product})
        }
        catch(error){
            next(error)
        }
    }

    changeProd = async(req, res) => {
        let pid = req.params.pid
        const prod = req.body
        try{
            const prodChange = await ProductService.updateProd(pid, prod)
            res.send({message: 'This Product has been changed', product: prodChange})
        }
        catch(error){
            res.status(500).json('There is a problem with the change of the product.')
        }
    }

    deleteProd = async(req, res) => {
        let pid = req.params.pid
        try{
            const delProduct = await ProductService.deleteProduct(pid)
            res.send({message: 'This Product has been eliminated', product: delProduct})
        }
        catch(error){
            res.status(500).json('We could not delete the product.')
        }
    }

    mocks = (req, res) => {
        const products = []
        try{
            for(let i = 0; i < 100; i++){
                products.push(getProductsFaker())
            }
            res.json(products)
        }
        catch(error){
            res.status(500).json({message: 'We could not get faker products.'})
        }
    }
}