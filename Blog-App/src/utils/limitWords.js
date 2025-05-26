function limitWords(text, count = 6) {
  const words = text.split(" ");
  return words.length > count ? words.slice(0, count).join(" ") + "..." : text;
}

module.exports = limitWords;