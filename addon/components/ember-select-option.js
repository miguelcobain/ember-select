import Ember from 'ember';
import layout from '../templates/components/ember-select-option';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['option'],
  classNameBindings: ['active'],
  attributeBindings: ['dataSelectable:data-selectable'],
  dataSelectable: true,

  label: Ember.computed('option', function() {
    let option = this.get('option');
    let regExp = this.get('regExp');
    let html = option.replace(regExp, '<span class="highlight">$&</span>');
    return new Ember.Handlebars.SafeString(html);
  }),

  regExp: Ember.computed('highlight', function() {
    let highlight = this.get('highlight');
    return new RegExp(highlight);
  }),

  active: Ember.computed('activeIndex', 'index', function() {
    return this.get('activeIndex') === this.get('index');
  }),

  mouseDown() {
    this.sendAction('select', this.get('option'));
  },

  mouseEnter() {
    this.sendAction('option-hover', this.get('index'));
  }
});
