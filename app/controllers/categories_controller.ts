// import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  public async index({ response }: HttpContext) {
    try {
      const categories = await Category.query().where('active', true).orderBy('name', 'asc')

      return response.status(200).json({
        message: 'Lista de categorias',
        categories,
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erro ao buscar categorias',
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    //faz a requisição utilizando os parametros de nome e descrição
    const data = request.only(['name', 'description'])

    //verifica se o nome foi passado como parametro
    if (!data.name) {
      return response.status(400).json({
        error: 'O nome da categoria é obrigatório',
      })
    }

    try {
      //apos a validação armazena os dados e cria os itens no banco de acordo com o model
      const category = await Category.create({
        name: data.name,
        description: data.description || 'Sem descrição',
        active: true,
      })
      //retorna uma resposta de sucesso caso dê certo
      return response.status(201).json({
        message: 'Categoria criada com sucesso',
        category,
      })
    } catch (error) {
      //retorna uma resposta em caso de erro
      return response.status(400).json({
        error: 'Erro ao criar categoria. Verifique se o nome já existe',
      })
    }
  }

  public async update({ request, response, params }: HttpContext) {
    try {
      const productId = params.id
      const product = await Product.findOrFail(productId)
      const data = request.only(['name', 'description', 'price', 'categoryId'])

      product.merge({
        name: data.name || product.name,
        description: data.description || product.description,
        price: data.price ?? product.price,
        categoryId: data.categoryId ?? product.categoryId,
      })

      await product.save()

      return response.status(200).json({
        message: 'Produto atualizado com sucesso',
        product,
      })
    } catch (error) {
      return response.status(404).json({
        error: 'Produto não encontrado',
      })
    }
  }
}
