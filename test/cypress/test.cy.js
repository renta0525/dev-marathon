// 24KM：確認画面の保存テスト
describe('顧客情報確認画面のテスト', () => {
  it('保存ボタンを押したとき、成功アラートが表示されること', () => {
    cy.intercept('POST', '**/add-customer', {
      statusCode: 200,
      body: { success: true },
    }).as('addCustomer');

    const params = new URLSearchParams({
      companyName: 'テスト会社',
      industry: 'IT',
      contact: '03-1234-5678',
      location: '東京'
    });

    cy.visit(`/renta_ueno/customer/add-confirm.html?${params.toString()}`);

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('#submit-btn').click();
    cy.wait('@addCustomer');

    cy.get('@alertStub').should('have.been.calledWith', '顧客情報が正常に登録されました！');
  });
});


// 25KM(1)：一覧ページの表示確認テスト（★見出しを英語に修正）
describe('顧客一覧画面のテスト', () => {
  it('一覧ページが表示され、列名が含まれていること', () => {
    cy.visit('/renta_ueno/customer/list.html');

    cy.contains('Company Name').should('exist');
    cy.contains('Contact').should('exist');
  });
});


// 25KM(2)：詳細ページの入力欄存在テスト（★name属性でチェック）
describe('顧客詳細画面のテスト', () => {
  it('詳細ページが開き、入力欄が表示されていること', () => {
    cy.visit('/renta_ueno/customer/detail.html?id=1');

    cy.contains('顧客詳細').should('exist');

    cy.get('input[name="company_name"]').should('exist');
    cy.get('input[name="industry"]').should('exist');
    cy.get('input[name="contact"]').should('exist');
    cy.get('input[name="location"]').should('exist');
  });
});
