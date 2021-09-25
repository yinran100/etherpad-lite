'use strict';

describe('caret focus', function () {
  describe('doesnt focus on editor using focusOnEditor URL Param', function () {
    before(async function () {
      await helper.aNewPad({
        params: {
          focusOnEditor: 'false'
        }
      });
    });

    it('does not focus when focusOnEditor is set to false', async function () {
      const activeElement = helper.padChrome$.document.activeElement;
      await helper.waitForPromise(() => $(activeElement).hasClass('readwrite'));
    });

  });

  describe('does focus on editor using focusOnEditor URL Param', function () {
    before(async function () {
      await helper.aNewPad({
        params: {
          focusOnEditor: 'true'
        }
      });
    });

    it('does focus when focusOnEditor is set to true', async function () {
      const activeElement = helper.padChrome$.document.activeElement;
      console.log(activeElement)
      await helper.waitForPromise(() => $(activeElement).attr('name') === 'ace_outer');
    });
  });

});
