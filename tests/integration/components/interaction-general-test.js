import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-select', 'Interaction | General | ember select', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-select}}`);

  assert.ok(this.$('.selectize-control').length);
});

test('sets not-full class in single mode', function(assert) {
  assert.expect(1);

  this.render(hbs`{{ember-select}}`);

  assert.ok(this.$('.selectize-input').hasClass('not-full'));
});

test('sets not-full class in multiple mode', function(assert) {
  assert.expect(1);

  this.set('selection', Ember.A(['option 1', 'option 2']));

  this.render(hbs`{{ember-select multiple=true selection=selection}}`);

  assert.ok(this.$('.selectize-input').hasClass('not-full'));
});

test('sets full class in single mode', function(assert) {
  assert.expect(1);

  this.set('selection', 'option 1');

  this.render(hbs`{{ember-select selection=selection}}`);

  assert.ok(this.$('.selectize-input').hasClass('full'));
});

test('sets full class in multiple mode', function(assert) {
  assert.expect(1);

  this.set('selection', Ember.A(['option 1', 'option 2']));

  this.render(hbs`{{ember-select multiple=true selection=selection maxItems=2}}`);

  assert.ok(this.$('.selectize-input').hasClass('full'));
});

test('dropdown has correct number of options', function(assert) {
  assert.expect(1);

  this.set('options', Ember.A(['1', '2', '3']));

  this.render(hbs`{{ember-select options=options}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
  });

  assert.equal(this.$('.selectize-dropdown .option').length, 3);
});

test('typing on input filters results', function(assert) {
  assert.expect(1);

  this.set('options', Ember.A(['Chuck Testa', 'Nikola Tesla', 'Sage Cattabriga-Alosa']));

  this.render(hbs`{{ember-select options=options filterText=filterText}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
    //TODO simulate input event
    this.set('filterText', 'ch');
  });

  assert.equal(this.$('.selectize-dropdown .option').length, 1);
});

test('typing on input highlights search results', function(assert) {
  assert.expect(1);

  this.set('options', Ember.A(['Chuck Testa', 'Nikola Tesla', 'Sage Cattabriga-Alosa']));

  this.render(hbs`{{ember-select options=options filterText=filterText}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
    //TODO simulate input event
    this.set('filterText', 'sa');
  });

  assert.equal(this.$('.selectize-dropdown .option .highlight').length, 2);
});

test('typing on input an unexisting substring hides dropdown', function(assert) {
  assert.expect(2);

  this.set('options', Ember.A(['Chuck Testa', 'Nikola Tesla', 'Sage Cattabriga-Alosa']));

  this.render(hbs`{{ember-select options=options filterText=filterText}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
  });

  assert.equal(this.$('.selectize-dropdown').length, 1);

  Ember.run(() => {
    //TODO simulate input event
    this.set('filterText', 'xyz');
  });

  assert.equal(this.$('.selectize-dropdown').length, 0);
});

test('when input loses focus, it gets cleared', function(assert) {
  assert.expect(2);

  this.set('options', Ember.A(['Chuck Testa', 'Nikola Tesla', 'Sage Cattabriga-Alosa']));

  this.render(hbs`{{ember-select options=options filterText=filterText}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
    //TODO simulate input event
    this.set('filterText', 'sa');
  });

  assert.equal(this.$('.selectize-input > input').val(), 'sa');

  Ember.run(() => {
    this.$('.selectize-input > input').trigger(Ember.$.Event('focusout'));
  });

  assert.equal(this.$('.selectize-input > input').val(), '');
});

test('when dropdown opens, active class is set on first option', function(assert) {
  assert.expect(1);

  this.set('options', Ember.A(['Chuck Testa', 'Nikola Tesla', 'Sage Cattabriga-Alosa']));

  this.render(hbs`{{ember-select options=options}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
  });

  assert.ok(this.$('.selectize-dropdown .option').first().hasClass('active'));
});

test('on mouseover active class is set, previous active element returns to normal', function(assert) {
  assert.expect(2);

  this.set('options', Ember.A(['Chuck Testa', 'Nikola Tesla', 'Sage Cattabriga-Alosa']));

  this.render(hbs`{{ember-select options=options}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
    this.$('.selectize-dropdown .option').eq(2).trigger(Ember.$.Event('mouseenter'));
  });

  assert.ok(!this.$('.selectize-dropdown .option').eq(0).hasClass('active'));
  assert.ok(this.$('.selectize-dropdown .option').eq(2).hasClass('active'));
});
