Snakey.css = {};

Snakey.css.format = function(css) {
  let parser = new CSSParser();
  return parser.parse(css).cssText();
}

Snakey.css.check = function(css) {
  let parser = new CSSParser();
  let sheet = parser.parse(css);
  let errors = [];
  sheet.cssRules.forEach(rule => {
    if(rule.error) errors.push({
      type: "rule",
      text: rule.parsedCssText,
      line: rule.currentLine
    });
    if(rule.cssRules) rule.cssRules.forEach(subrule => {
      if(subrule.error) errors.push({
        type: "subrule",
        text: subrule.parsedCssText,
        line: subrule.currentLine,
        parent: {
          name: rule.name,
          type: rule.type
        }
      });
    })
  })
  if(errors.length !== 0) return { ok: false, errors, sheet };
    else return { ok: true, sheet };
}