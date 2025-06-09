import Product from '#models/product'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StockBalanceController {
  async calcularSaldo({ request, response }: HttpContextContract) {
    try {
      // Obtém o ID do produto a partir dos parâmetros da requisição ou da query string
      const { id } = request.params() || request.qs()

      // Verifica se o ID foi fornecido, caso contrário retorna um erro 400
      if (!id) {
        return response.status(400).json({
          error: 'ID do produto é obrigatório',
        })
      }

      // Busca o produto no banco de dados pelo ID, lançando um erro caso não seja encontrado
      const product = await Product.findOrFail(id)

      // Retorna os dados do produto, incluindo o saldo (quantidade disponível)
      return response.json({
        product_id: product.id,
        name: product.name,
        saldo: product.quantity,
      })
    } catch (error) {
      // Retorna um erro 404 caso o produto não seja encontrado
      return response.status(404).json({
        error: 'Produto não encontrado',
      })
    }
  }

  async listarSaldos({ response }: HttpContextContract) {
    try {
      // Busca todos os produtos com quantidade maior que zero no banco de dados
      const products = await Product.query()
        .select('id', 'name', 'quantity')
        .where('quantity', '>', 0)

      // Retorna uma lista de produtos com seus respectivos saldos
      return response.json({
        products: products.map((product) => ({
          product_id: product.id,
          name: product.name,
          saldo: product.quantity,
        })),
      })
    } catch (error) {
      // Retorna um erro 404 caso ocorra algum problema ao buscar os produtos
      response.status(404).json({
        error: 'Erro ao buscar produtos',
      })
    }
  }
}
