import StockMovement from '../models/stock_movement.js'
import Product from '../models/product.js'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

export default class StockMovementController {
  public async index({ }: HttpContext) {
    return await StockMovement.query().preload('product').orderBy('movedAt', 'desc')
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['type', 'quantity', 'productId', 'product_id'])

    // Aceita tanto productId quanto product_id
    const productId = data.productId || data.product_id

    const product = await Product.findOrFail(productId)

    if (data.type === 'entrada') {
      product.quantity += data.quantity
    } else if (data.type === 'saida') {
      if (product.quantity < data.quantity) {
        return response.badRequest({ message: 'Quantidade insuficiente em estoque' })
      }
      product.quantity -= data.quantity
    }

    await product.save()

    const movement = await StockMovement.create({
      type: data.type,
      quantity: data.quantity,
      productId: productId,
      movedAt: DateTime.now(),
    })

    return movement
  }
}
