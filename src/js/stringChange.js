(function() {
  "use strict";
  class StringSwap {
    constructor(parent, strings, options = {}) {
      this.parent =
        typeof parent === "string" ? document.querySelector(parent) : parent;
      this.strings = strings;
      this.timestep = options.timestep || 150;
      this.delay = options.delay || 3000;
      this.current_iteration = 0;
      this.cycle = options.cycle || false;
      this.is_running = false;
      this.element;
      if (this.cycle === true) this.init();
    }

    // Initialize method
    init() {
      this.activeString = this.strings[this.current_iteration];
      setTimeout(() => {
        this.nextString();
      }, this.delay);
    }
    // Render string in DOM
    appendString(value) {
      this.parent.innerHTML = "";
      this.parent.append(value);
    }
    // Next string transition
    nextString() {
      if (this.is_running === true) return false;
      this.is_running = true;
      const current_iteration = this.current_iteration;
      const strings = this.strings;
      const current_string = strings[current_iteration % strings.length];
      const next_string = strings[(current_iteration + 1) % strings.length];
      const length =
        current_string.length > next_string.length
          ? current_string.length
          : next_string.length;
      repeat(
        index => {
          const result_string = this.switchChar(
            index,
            current_string,
            next_string
          );
          repeat(
            () => {
              this.activeString = this.randomize(result_string, index, "&*#$^");
            },
            3,
            this.timestep,
            0
          ).then(() => {
            return (this.activeString = result_string);
          });
        },
        length,
        this.timestep * length,
        0
      ).then(() => {
        // Delay between full string iterations
        this.is_running = false;
        this.current_iteration++;
        if (this.cycle === true) {
          wait(this.timestep + this.delay || 0).then(() => {
            this.nextString();
          });
        }
      });
    }
    // Random symbols generating function
    randomize(string, char_index, symbols_string) {
      const random_symbol_index = Math.floor(
        Math.random() * (symbols_string.length - 1)
      );
      let result = "";
      result =
        string.slice(0, char_index) +
        symbols_string[random_symbol_index] +
        string.slice(char_index + 1);
      return result;
    }

    // Individual character switch function
    switchChar(char_index, initial_string, target_string) {
      let result = "";

      result =
        target_string.slice(0, char_index + 1) +
        initial_string.slice(char_index + 1);

      return result;
    }
    checkRunning() {
      return this.is_running;
    }
    // On active string change function
    set activeString(value) {
      this.appendString(value);
    }
  }
  window.StringSwap = StringSwap;
})();
