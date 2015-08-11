import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global syn */

moduleForComponent('ember-select', 'Interaction | Single | ember select', {
  integration: true
});

test('clicking select control gives it focus class', function(assert) {
  assert.expect(1);

  this.render(hbs`{{ember-select}}`);

  Ember.run(() => {
    syn.click(this.$('.selectize-input')).delay(350, function() {
      assert.ok(this.$('.selectize-input').hasClass('input-active'));
    });
  });
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


test('selecting an option removes focused class', function(assert) {
  assert.expect(2);

  this.set('options', Ember.A(['1', '2', '3']));

  this.render(hbs`{{ember-select options=options}}`);

  Ember.run(() => {
    this.$('.selectize-input').trigger(Ember.$.Event('mousedown'));
  });

  assert.ok(this.$('.selectize-input').hasClass('input-active'));
debugger;
  Ember.run(() => {
    this.$('.selectize-dropdown .option').first().trigger(Ember.$.Event('mousedown'));
  });

  assert.ok(!this.$('.selectize-input').hasClass('input-active'));
});
