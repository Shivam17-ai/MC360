/**
 * Pagination helper for Mongoose queries
 * Usage: const { data, pagination } = await paginate(Model, query, options);
 */

const paginate = async (model, filter = {}, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };
  const populate = options.populate || "";
  const select = options.select || "";

  const [data, total] = await Promise.all([
    model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate)
      .select(select),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

module.exports = paginate;