/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const StockMovementController = () => import('#controllers/stock_movements_controller')
const StockBalanceController = () => import('#controllers/stock_balance')
const ProductRegisterController = () => import('#controllers/product_register')
const CategoriesController = () => import('#controllers/categories_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.get('/movimentacoes', [StockMovementController, 'index'])
    router.post('/movimentacoes', [StockMovementController, 'store'])
    router.get('/saldos/:id', [StockBalanceController, 'calcularSaldo'])
    router.get('/saldos', [StockBalanceController, 'listarSaldos'])
    router.post('/produtos', [ProductRegisterController, 'store'])
    router.get('/produtos', [ProductRegisterController, 'index'])
    router.put('/produtos/:id', [ProductRegisterController, 'update'])
    router.get('/categorias', [CategoriesController, 'index'])
    router.post('/categorias', [CategoriesController, 'store'])
    router.put('/categorias/:id', [CategoriesController, 'update'])
  })
  .prefix('/api')
