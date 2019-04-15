var Localize = {
  documentReadyAsPromised: function (doc) {
    return new Promise(function (resolve, reject) {
      if (doc.readyState !== 'loading') resolve();
      else doc.addEventListener('DOMContentLoaded', resolve);
    });
  },

  localizeHtml: function (parentEl) {
      var replaceFunc = function (match, p1) {
        return p1 ? i18n(p1) : '';
      };
      Array.prototype.forEach.call(parentEl.querySelectorAll('*'), function (el) {
      if (el.hasAttribute('data-i18n')) {
        el.innerHTML = el.getAttribute('data-i18n').replace(/__MSG_(\w+)__/g, replaceFunc);
        el.removeAttribute('data-i18n');
      }

      if (el.hasAttribute('data-i18n-tooltip')) {
          el.setAttribute('data-tippy-content', el.getAttribute('data-i18n-tooltip').replace(/__MSG_(\w+)__/g, replaceFunc));
          el.removeAttribute('data-i18n-tooltip');
        }
        if (el.hasAttribute('data-i18n-placeholder')) {
          el.setAttribute('placeholder', el.getAttribute('data-i18n-placeholder').replace(/__MSG_(\w+)__/g, replaceFunc));
          el.removeAttribute('data-i18n-placeholder');
        }
      });

      Array.prototype.forEach.call(parentEl.querySelectorAll('i18n'), function (el) {
        el.outerHTML = i18n(el.innerText) || '';
      });
  },

  documentReadyAndLocalisedAsPromised: function (doc) {
      var self = this;
      return self.documentReadyAsPromised(doc).then(function () {
          return self.localizeHtml(doc);
      });
  },

  resolveTooltips: function () {
    tippy('[data-tippy-content]');
    Array.prototype.forEach.call(document.querySelectorAll('[data-tippy-content]'), function (el) {
      el.removeAttribute('data-tippy-content');
      el.removeAttribute('data-tippy-placement');
      el.removeAttribute('data-tippy-interactive');
    });
  }
};