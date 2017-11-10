// @link https://gist.github.com/htmlpack/e9c6b6c3c22736aa6a1e8473311b115b
async function paginate(query, options = {}) {
  const pagination = {};

  const per_page = +options.per_page || 15;
  let page = +options.page || 1;
  if ( page < 1 ) page = 1;
  const offset = (page - 1)  * per_page;

  const countPromise = query.clone().count('* as count').first()
  const queryPromise = query.offset(offset).limit(per_page)

  const count = (await countPromise).count;
  const rows = await queryPromise;
  pagination.data = rows;
  pagination.total = count;
  pagination.per_page = per_page;
  pagination.offset = offset;
  pagination.to = offset + rows.length;
  pagination.last_page = Math.ceil(count / per_page);
  pagination.current_page = page;
  pagination.from = offset;
  return pagination;
}

module.exports = paginate