QUnit.test('test floow.geo.latLong', function( assert ) {
    assert.equal( // Zero test
        floow.geo.latLong(0, 0).toString(),
        '(0&#0176;00&#8217;00.0&#8221;N, 0&#0176;00&#8217;00.0&#8221;E)'
    );
    assert.equal( // Floow office
        floow.geo.latLong(53.387135, -1.464492).toString(),
        '(53&#0176;23&#8217;13.7&#8221;N, 1&#0176;27&#8217;52.2&#8221;W)'
    );
    assert.equal( // South pole
        floow.geo.latLong(-63.578958, -55.786564).toString(),
        '(63&#0176;34&#8217;44.2&#8221;S, 55&#0176;47&#8217;11.6&#8221;W)'
    );
});

QUnit.test('test floow.geo.formatLatitude', function( assert ) {
    assert.equal( // Zero test
        floow.geo.formatLatitude(0, true),
        '0°00’00.0”N'
    );
    assert.equal( // Floow office
        floow.geo.formatLatitude(53.387135, true),
        '53°23’13.7”N'
    );
    assert.equal( // South pole
        floow.geo.formatLatitude(-63.578958, true),
        '63°34’44.2”S'
    );
});

QUnit.test('test floow.geo.formatLongitude', function( assert ) {
    assert.equal( // Zero test
        floow.geo.formatLongitude(0, true),
        '0°00’00.0”E'
    );
    assert.equal( // Floow office
        floow.geo.formatLongitude(-1.464492, true),
        '1°27’52.2”W'
    );
    assert.equal( // South pole
        floow.geo.formatLongitude(-55.786564, true),
        '55°47’11.6”W'
    );
});

QUnit.test('test floow.geo.latLong.distanceInKm', function( assert ) {
    assert.equal(
        floow.geo.latLong(0, 0)
            .distanceInKm(floow.geo.latLong(0, 0))
            .toFixed(2),
        '0.00'
    );
    assert.equal(
        floow.geo.latLong(51.044934999999995,13.777610000000001)
            .distanceInKm(floow.geo.latLong(51.050121999999995,13.775076))
            .toFixed(2),
        '0.60'
    );
    assert.equal(
        floow.geo.latLong(51.507351, -0.127758)
            .distanceInKm(floow.geo.latLong(53.381129, -1.470085))
            .toFixed(2),
        '227.34'
    );
});
