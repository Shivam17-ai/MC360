/**
 * Paginate a Mongoose query
 * @param {Model}  model   - Mongoose model
 * @param {object} query   - filter object
 * @param {object} options - { page, limit, sort, populate, select }
 */
export const paginate = async (model, query = {}, options = {}) => {
  const page     = Math.max(1, parseInt(options.page)  || 1)
  const limit    = Math.min(100, parseInt(options.limit) || 10)
  const skip     = (page - 1) * limit
  const sort     = options.sort     || { createdAt: -1 }
  const populate = options.populate || ''
  const select   = options.select   || ''

  const [data, total] = await Promise.all([
    model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate)
      .select(select)
      .lean(),
    model.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage:    page < totalPages ? page + 1 : null,
      prevPage:    page > 1         ? page - 1 : null,
    },
  }
}

/**
 * Parse pagination params from request query
 * @param {object} query - req.query
 */
export const getPaginationParams = (query) => ({
  page:  parseInt(query.page)  || 1,
  limit: parseInt(query.limit) || 10,
  sort:  query.sort || '-createdAt',
})