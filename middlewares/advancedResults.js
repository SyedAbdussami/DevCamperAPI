const advancedResults = (model, populate) => async (req, res, next) => {
  // console.log('in middleware');
  const reqQuery = { ...req.query };
  // console.log(req.query);
  const removeFields = ['select', 'sort', 'page', 'limit'];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  const queryStr = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // console.log(queryStr);

  let query = model.find(JSON.parse(queryStr)).populate(populate);

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    // console.log(fields);
    query = query.select(fields);
  }
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    // console.log(fields);
    query = query.sort(fields);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  query = query.skip(startIndex).limit(limit);

  const results = await query;
  const totalDocs = await model.countDocuments();

  const pagination = {};
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  if (endIndex < totalDocs) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
