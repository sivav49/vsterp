import { VsterpPage } from './app.po';

describe('vsterp App', () => {
  let page: VsterpPage;

  beforeEach(() => {
    page = new VsterpPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
