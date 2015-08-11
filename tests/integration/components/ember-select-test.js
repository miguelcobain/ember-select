import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-select', 'Integration | Component | ember select', {
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
