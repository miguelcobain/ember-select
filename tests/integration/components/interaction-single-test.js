import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-select', 'Interaction | Single | ember select', {
  integration: true
});

test('clicking select control gives it focus class', function(assert) {
  assert.expect(1);

  this.render(hbs`{{ember-select}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger('mousedown');
  });
  assert.ok(this.$('.selectize-input').hasClass('input-active'));
});

test('clicking select control doesn\'t open dropdown if empty', function(assert) {
  assert.expect(1);

  this.render(hbs`{{ember-select}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger('mousedown');
  });

  assert.equal(this.$('.selectize-dropdown').length, 0);
});

test('clicking select control toggles dropdown if not empty', function(assert) {
  assert.expect(2);

  this.set('options', Ember.A(['1', '2', '3']));

  this.render(hbs`{{ember-select options=options}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger('mousedown');
  });

  assert.equal(this.$('.selectize-dropdown').length, 1);

  Ember.run(() => {
    this.$('.selectize-input').trigger('mousedown');
  });

  assert.equal(this.$('.selectize-dropdown').length, 0);
});


/*test('selecting an option removes focused class', function(assert) {
  assert.expect(2);

  this.set('options', Ember.A(['1', '2', '3']));

  this.render(hbs`{{ember-select options=options}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
  });

  assert.ok(this.$('.selectize-input').hasClass('input-active'));

  Ember.run(() => {
    this.$('.selectize-dropdown .option').first().trigger(Ember.$.Event('mousedown'));
  });

  assert.ok(!this.$('.selectize-input').hasClass('input-active'));
});*/

test('selecting an option shows its label on input', function(assert) {
  assert.expect(1);

  this.set('options', Ember.A(['1', '2', '3']));

  this.render(hbs`{{ember-select options=options}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
    this.$('.selectize-dropdown .option').first().trigger(Ember.$.Event('mousedown'));
  });

  assert.equal(this.$('.selectize-input .item').text(), '1');
});

test('when an item is selected, dropdown still opens (isFull test)', function(assert) {
  assert.expect(3);

  this.set('options', Ember.A(['Chuck Testa', 'Nikola Tesla', 'Sage Cattabriga-Alosa']));

  this.render(hbs`{{ember-select options=options}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
  });

  assert.equal(this.$('.selectize-dropdown').length, 1);

  Ember.run(() => {
    this.$('.selectize-dropdown .option').first().trigger(Ember.$.Event('mousedown'));
  });

  assert.equal(this.$('.selectize-dropdown').length, 0);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
  });

  assert.equal(this.$('.selectize-dropdown').length, 1);
});
