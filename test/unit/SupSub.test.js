suite('SupSub', function() {
  var mq;
  setup(function() {
    mq = MathQuill.MathField($('<span></span>').appendTo('#mock')[0]);
  });
  teardown(function() {
    $(mq.el()).remove();
  });

  function prayWellFormedPoint(pt) { prayWellFormed(pt.parent, pt[L], pt[R]); }

  var expecteds = [
    'x_{ab} x_{ba}, x_a^b x_a^b; x_{ab} x_{ba}, x_a^b x_a^b; x_a x_a, x_a^{} x_a^{}',
    'x_b^a x_b^a, x^{ab} x^{ba}; x_b^a x_b^a, x^{ab} x^{ba}; x_{}^a x_{}^a, x^a x^a'
  ];
  var expectedsAfterC = [
    'x_{abc} x_{bca}, x_a^{bc} x_a^{bc}; x_{ab}c x_{bca}, x_a^bc x_a^bc; x_ac x_{ca}, x_a^{}c x_a^{}c',
    'x_{bc}^a x_{bc}^a, x^{abc} x^{bca}; x_b^ac x_b^ac, x^{ab}c x^{bca}; x_{}^ac x_{}^ac, x^ac x^{ca}'
  ];
  'sub super'.split(' ').forEach(function(initSupsub, i) {
    var initialLatex = 'x_a x^a'.split(' ')[i];

    'typed, wrote, wrote empty'.split(', ').forEach(function(did, j) {
      var doTo = [
        function(mq, supsub) { mq.typedText(supsub).typedText('b'); },
        function(mq, supsub) { mq.write(supsub+'b'); },
        function(mq, supsub) { mq.write(supsub+'{}'); }
      ][j];

      'sub super'.split(' ').forEach(function(supsub, k) {
        var cmd = '_^'.split('')[k];

        'after before'.split(' ').forEach(function(side, l) {
          var moveToSide = [
            noop,
            function(mq) { mq.moveToLeftEnd().keystroke('Right'); }
          ][l];

          var expected = expecteds[i].split('; ')[j].split(', ')[k].split(' ')[l];
          var expectedAfterC = expectedsAfterC[i].split('; ')[j].split(', ')[k].split(' ')[l];

          test('initial '+initSupsub+'script then '+did+' '+supsub+'script '+side, function() {
            mq.latex(initialLatex);
            assert.equal(mq.latex(), initialLatex);

            moveToSide(mq);

            doTo(mq, cmd);
            assert.equal(mq.latex().replace(/ /g, ''), expected);

            prayWellFormedPoint(mq.controller.cursor);

            mq.typedText('c');
            assert.equal(mq.latex().replace(/ /g, ''), expectedAfterC);
          });
        });
      });
    });
  });

  test('render LaTeX with 2 SupSub\'s in a row', function() {
    mq.latex('x_a_b');
    assert.equal(mq.latex(), 'x_{ab}');

    mq.latex('x_a_{}');
    assert.equal(mq.latex(), 'x_a');

    mq.latex('x_{}_a');
    assert.equal(mq.latex(), 'x_a');

    mq.latex('x^a^b');
    assert.equal(mq.latex(), 'x^{ab}');

    mq.latex('x^a^{}');
    assert.equal(mq.latex(), 'x^a');

    mq.latex('x^{}^a');
    assert.equal(mq.latex(), 'x^a');
  });
});
