const strHelper = {
  //String
  codeBlock(str, syntax = "") {
    return `\`\`\`${syntax}\n${str}\n\`\`\`\n`;
  },
  titleCase(str) {
    str = String(str);
    str = str.replace(/_/g, " ");
    var splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  },
};

module.exports = strHelper;
