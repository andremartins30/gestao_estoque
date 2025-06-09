import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'

export default class ProductRegisterController {
  public async store({ request, response }: HttpContext) {
    // Obtém os dados enviados na requisição
    const data = request.only(['name', 'description', 'price', 'quantity'])

    // Valida se o campo "name" foi fornecido
    if (!data.name) {
      return response.status(400).json({
        error: 'O nome do produto é obrigatório',
      })
    }

    // Define valores padrão para os campos opcionais
    const productData = {
      name: data.name,
      description: data.description || 'Sem descrição',
      price: data.price ?? 0.0,
      quantity: data.quantity ?? 0,
    }

    // Cria o produto no banco de dados
    const product = await Product.create(productData)

    // Retorna o produto criado como resposta
    return response.status(201).json({
      message: 'Produto cadastrado com sucesso',
      product,
    })
  }

  public async index({ response }: HttpContext) {
    try {
      const products = await Product.all()

      return response.status(200).json({
        message: 'Lista de produtos',
        products,
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erro ao buscar produtos',
      })
    }
  }

  public async update({ request, response, params }: HttpContext) {
    try {
      // Obtém o ID do produto a partir dos parâmetros da rota
      const productId = params.id

      // Busca o produto no banco de dados
      const product = await Product.findOrFail(productId)

      // Obtém os dados enviados na requisição
      const data = request.only(['name', 'description', 'price'])

      // Atualiza apenas os campos permitidos
      product.merge({
        name: data.name || product.name,
        description: data.description || product.description,
        price: data.price ?? product.price,
      })

      // Salva as alterações no banco de dados
      await product.save()

      // Retorna o produto atualizado como resposta
      return response.status(200).json({
        message: 'Produto atualizado com sucesso',
        product,
      })
    } catch (error) {
      // Retorna um erro 404 caso o produto não seja encontrado
      return response.status(404).json({
        error: 'Produto não encontrado',
      })
    }
  }
}
