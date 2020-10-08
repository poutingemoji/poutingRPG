const arrHelper = {
  disambiguation(items, label, property = "name") {
    const itemList = items
      .map(
        (item) =>
          `"${(property ? item[property] : item).replace(/ /g, "\xa0")}"`
      )
      .join(",   ");
    return `Multiple ${label} found, please be more specific: ${itemList}`;
  },
  paginate(items, page = 1, pageLength = 10) {
    const maxPage = Math.ceil(items.length / pageLength);
    if (page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    const startIndex = (page - 1) * pageLength;
    return {
      items:
        items.length > pageLength
          ? items.slice(startIndex, startIndex + pageLength)
          : items,
      page,
      maxPage,
      pageLength,
    };
  },
  arrayShuffle(array) {
    for (
      var i = 0, length = array.length, swap = 0, temp = "";
      i < length;
      i++
    ) {
      swap = Math.floor(Math.random() * (i + 1));
      temp = array[swap];
      array[swap] = array[i];
      array[i] = temp;
    }
    return array;
  },
  percentageChance(values, chances) {
    for (var i = 0, pool = []; i < chances.length; i++) {
      for (var i2 = 0; i2 < chances[i]; i2++) {
        pool.push(i);
      }
    }
    console.log(pool.length)
    return values[arrHelper.arrayShuffle(pool)[0]];
  },
};

module.exports = arrHelper;
