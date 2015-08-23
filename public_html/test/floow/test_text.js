QUnit.test( 'test floow.text.leftPad', function( assert ) {
    assert.equal( floow.text.leftPad('', 0, ' '), '');
    assert.equal( floow.text.leftPad('text', 10, ' '), '      text');
    assert.equal( floow.text.leftPad('', 3, '0'), '000');
    assert.equal( floow.text.leftPad('12', 3, '0'), '012');
});