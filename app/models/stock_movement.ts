import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/relations'
import Product from './product.js'

export default class StockMovement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: 'entrada' | 'saida'

  @column()
  public quantity: number

  @column()
  public productId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @column.dateTime()
  public movedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
