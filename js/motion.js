/* global NexT, CONFIG */

NexT.motion = {};

NexT.motion.integrator = {
  queue: [],
  cursor: -1,
  init : function() {
    this.queue = [];
    this.cursor = -1;
    return this;
  },
  add: function(fn) {
    this.queue.push(fn);
    return this;
  },
  next: function() {
    this.cursor++;
    let fn = this.queue[this.cursor];
    typeof fn === 'function' && fn(NexT.motion.integrator);
  },
  bootstrap: function() {
    this.next();
  }
};

NexT.motion.middleWares = {
  logo: function(integrator) {
    const sequence = [];
    const column = document.querySelector('.column');
    const brand = document.querySelector('.brand');
    const title = document.querySelector('.site-title');
    const subtitle = document.querySelector('.site-subtitle');
    const toggle = document.querySelectorAll('.toggle');

    column && sequence.push({
      e: column,
      p: {opacity: 1, top: 0},
      o: {duration: 0}
    });
    
    brand && sequence.push({
      e: brand,
      p: {opacity: 1},
      o: {duration: 200}
    });

    toggle && sequence.push({
      e: toggle,
      p: 'transition.fadeIn',
      o: {duration: 50}
    })

    title && sequence.push({
      e: title,
      p: {opacity: 1, top: 0},
      o: {duration: 200}
    });

    subtitle && sequence.push({
      e: subtitle,
      p: {opacity: 1, top: 0},
      o: {duration: 200}
    });

    if (sequence.length > 0) {
      sequence[sequence.length - 1].o.complete = () => {
        integrator.next();
      };
      Velocity.RunSequence(sequence);
    } else {
      integrator.next();
    }

    if (CONFIG.motion.async) {
      integrator.next();
    }
  },

  menu: function(integrator) {
    Velocity(document.querySelectorAll('.menu-item'), 'transition.slideDownIn', {
      display: null,
      duration: 200,
      complete: () => {
        integrator.next();
      }
    });

    if (CONFIG.motion.async) {
      integrator.next();
    }
  },

  postList: function(integrator) {
    const postBlock = document.querySelectorAll('.post-block, .pagination, .comments');
    const postBlockTransition = CONFIG.motion.transition.post_block;
    const postHeader = document.querySelectorAll('.post-header');
    const postHeaderTransition = CONFIG.motion.transition.post_header;
    const postBody = document.querySelectorAll('.post-body');
    const postBodyTransition = CONFIG.motion.transition.post_body;
    const collHeader = document.querySelectorAll('.collection-header');
    const collHeaderTransition = CONFIG.motion.transition.coll_header;
    const hasPost = postBlock.length > 0;

    if (hasPost) {
      const postMotionOptions = {
        stagger : 100,
        drag    : true,
        complete: function() {
          integrator.next();
        }
      };

      if (CONFIG.motion.transition.post_block) {
        Velocity(postBlock, 'transition.' + postBlockTransition, postMotionOptions);
      }
      if (CONFIG.motion.transition.post_header) {
        Velocity(postHeader, 'transition.' + postHeaderTransition, postMotionOptions);
      }
      if (CONFIG.motion.transition.post_body) {
        Velocity(postBody, 'transition.' + postBodyTransition, postMotionOptions);
      }
      if (CONFIG.motion.transition.coll_header) {
        Velocity(collHeader, 'transition.' + collHeaderTransition, postMotionOptions);
      }
    }

    if (CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini') {
      integrator.next();
    }
  },

  sidebar: function(integrator) {
    const sidebar = document.querySelector('.sidebar-inner');
    const sidebarTransition = CONFIG.motion.transition.sidebar;
    integrator.next();
    // Only for Pisces | Gemini.
    if (sidebarTransition && (CONFIG.scheme === 'Pisces' || CONFIG.scheme === 'Gemini')) {
      Velocity(sidebar, 'transition.' + sidebarTransition, {
        display: null,
        duration: 200,
        complete: () => {
          // After motion complete need to remove transform from sidebar to let affix work on Pisces | Gemini.
          sidebar.style.transform = 'initial';
        }
      });
    }
    integrator.next();
  }
};
