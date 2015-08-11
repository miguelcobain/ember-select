import Ember from 'ember';
import layout from '../templates/components/ember-select';

var KEY_ESC = 27;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_RETURN = 13;

export default Ember.Component.extend({
  layout: layout,
  classNames: ['selectize-control', 'plugin-remove_button'],
  classNameBindings: ['multiple:multi:single'],
  filterText: '',

  selection: Ember.computed('multiple', function() {
    return this.get('multiple') ? Ember.A() : null;
  }),

  options: Ember.computed(function() {
    return Ember.A();
  }),

  /**
   * If in multiple mode, contains options that aren't selected.
   */
  notSelectedOptions: Ember.computed('options.@each', 'selection.@each', function() {
    let options = this.get('options');
    let selection = this.get('selection');
    if (this.get('multiple')) {
      return options.filter(item => !selection.contains(item));
    } else {
      return options;
    }
  }),

  /**
   * Holds options which label contained `filterText`
   */
  filteredOptions: Ember.computed('notSelectedOptions.@each', 'filterText', function() {
    let notSelectedOptions = this.get('notSelectedOptions');
    let filterText = this.get('filterText');
    if (Ember.isPresent(filterText)) {
      return Ember.A(notSelectedOptions.filter(item => item.toLowerCase().indexOf(filterText.toLowerCase()) !== -1));
    } else {
      return Ember.A(notSelectedOptions);
    }
  }),

  hasOptions: Ember.computed.or('filteredOptions.length', 'create').readOnly(),

  placeholderIfEmpty: Ember.computed('placeholder', 'hasItems', function() {
    let placeholder = this.get('placeholder');
    let hasItems = this.get('hasItems');

    return hasItems ? '' : placeholder;
  }),

  /**
   * Is `true` when an option is selected in singl mode
   * or when the selection array length is equal to `maxItems`
   */
  isFull: Ember.computed('maxItems', 'selection.@each', function() {
    let multiple = this.get('multiple');
    let selection = this.get('selection');
    let maxItems = this.get('maxItems');

    return (!multiple && selection) || (multiple && selection && maxItems && Ember.get(selection, 'length') >= maxItems);
  }).readOnly(),

  hasItems: Ember.computed('selection.@each', function() {
    let multiple = this.get('multiple');
    let selection = this.get('selection');

    return (!multiple && selection) || (multiple && selection && Ember.get(selection, 'length'));
  }).readOnly(),

  dropdownStyle: Ember.computed(function() {
    let control = this.$('.selectize-input');
		let offset = control.position();
		offset.top += control.outerHeight(true);
    return new Ember.Handlebars.SafeString(`width: ${control.outerWidth()}px; top: ${offset.top}px; left: ${offset.left}px;`);
  }).volatile(),

  dropdownOpen: false,
  dropdownActive: Ember.computed.and('hasOptions', 'dropdownOpen'),

  //use setter to bound values between 0 and length
  activeIndex: Ember.computed('filteredOptions.length', {
    get() {
      let len = this.get('filteredOptions.length');
      return this._lastActiveIndex = this.getBoundedIndex(this._lastActiveIndex, len);
    },
    set(key, value) {
      let len = this.get('filteredOptions.length');
      return this._lastActiveIndex = this.getBoundedIndex(value, len);
    }
  }),

  getBoundedIndex(value, length) {
    return Math.min(Math.max(value, 0), length - 1) || 0;
  },

  close() {
    if (this.get('dropdownOpen')) {
      this.set('dropdownOpen', false);
      this.set('filterText', '');
    }
  },

  open() {
    if (!this.get('dropdownOpen') && this.get('hasOptions')) {
      this.set('dropdownOpen', true);
      this.set('activeIndex', 0);
    }
  },

  toggle() {
    if (this.get('dropdownOpen')) {
      this.close();
    } else {
      this.open();
    }
  },

  select(option) {
    if (this.get('multiple')) {
      this.get('selection').addObject(option);
    } else {
      this.set('selection', option);
    }

    this.set('filterText', '');

    if (this.get('isFull') || this.get('filteredOptions.length') === 0) {
      this.close();
    }
  },

  deselect(option) {
    if (this.get('multiple')) {
      this.get('selection').removeObject(option);
    } else {
      this.set('selection', null);
    }
    this.$('.selectize-input > input').focus();
  },

  focusInput() {
    if (!this.get('isFocused')) {
      this.$('.selectize-input > input').focus();
      this.set('isFocused', true);
    }
  },

  actions: {

    controlClick() {
      this.toggle();
      this.focusInput();
    },

    /**
     * input events
     *
     * keydown - handle option selection with arrow keys
     * keyup - trigger `type` / search change
     * keypress - trigger `createItem` if multiple and char is delimiter
     * blur - reset input value
     *
     */

    select(option) {
      this.select(option);
      if (this.get('multiple')) {
        this.ignoreBlur = true;
      }
    },

    deselect(option) {
      this.deselect(option);
      this.open();
      if (this.get('multiple')) {
        this.ignoreBlur = true;
      }
    },

    inputFocus() {
      this.set('isFocused', true);
      if (this.get('filteredOptions.length') > 0) {
        this.open();
      }
    },

    inputBlur() {
      if (this.ignoreBlur) {
        this.ignoreBlur = false;
        this.focusInput();
        return false;
      } else {
        this.set('isFocused', false);
        this.close();
      }
    },

    inputKeyPress(str, event) {
      switch (event.keyCode) {
        case KEY_ESC:
          this.set('isFocused', false);
          this.close();
          break;
        case KEY_UP:
          this.decrementProperty('activeIndex');
          break;
        case KEY_DOWN:
          if (this.get('dropdownOpen')) {
            this.incrementProperty('activeIndex');
          }
          this.open();
          break;
        case KEY_RETURN:
          if (this.get('dropdownOpen')) {
            let activeIndex = this.get('activeIndex');
            let activeOption = this.get('filteredOptions').objectAt(activeIndex);
            this.set('isFocused', false);
            this.select(activeOption);
          }
          break;
      }

      if (this.get('isFull')) {
        event.preventDefault();
      }
    },

    optionHover(index) {
      this.set('activeIndex', index);
    }
  }
});
