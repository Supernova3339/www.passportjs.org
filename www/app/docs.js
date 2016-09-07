define(['jquery', 'page'],
function($, page) {
  
  var $toc, $gotop
    , _tocOffset, _gotopOffset, _contentOffset;
  
  
  
  function onReady() {
    $toc = $('.sub-menu nav');
    $gotop = $('.go-top');
    
    _tocOffset = $toc.offset();
    _gotopOffset = $gotop.offset();
    _contentOffset = $('.guides section').first().offset();
    
    // Select the active section.
    var s = $('.guides section.active');
    if (!s.length) { return; }
    
    // Find the link within the table of contents to the active section.
    var sref = $toc.find('a[href="/docs/' + s.attr('id') + '"]');
    
    // Remove the `active` class from all chapters within the table of contents,
    // except for the chapter containing the active section.
    //
    // Each chapter is displayed using an accordion control, which can be
    // expanded or collapsed to reveal the sections within the chapter.
    // Removing the `active` class has the effect of collapsing the chapter.
    //
    // The server renders all chapters within the table of contents as active,
    // so that links are visible to all user agents, including those which do
    // not support JavaScript or have JavaScript disabled.  When client-side
    // scripting is available, the user experience is improved by collapsing
    // non-active chapters.  This obeys the principle of progressive
    // enhancement.
    sref.closest('[data-accordion]').siblings().find('[data-content]').removeClass('active');
    
    // TODO: Collapse general section if overview is active (ie, no active section)
  }
  
  // TODO: Recompute offsets on resize event
  
  function onScroll(ev) {
    var top = $(window).scrollTop();
    
    $toc.toggleClass('fixed', _tocOffset && _tocOffset.top < top);
    $gotop.toggleClass('fixed', _gotopOffset && _gotopOffset.top < top);
    
    
    // Select the section that has scrolled into the content viewport.
    var x = _contentOffset.left;
    var y = _contentOffset.top - top;
    var el = document.elementFromPoint(x, (y < 0 ? 0 : y));
    var s = $(el).closest('section');
    if (!s.length) { return; }
    
    // If the section is alreday active, no further DOM manipulation is
    // necessary.
    if (s.hasClass('active')) { return; }
    
    // 
    s.addClass('active');
    s.siblings().removeClass('active');
    
    // Find the link within the table of contents to the active section.
    var sref = $toc.find('a[href="/docs/' + s.attr('id') + '"]');
    sref.addClass('active').closest('[data-content]').addClass('active');
    sref.closest('li').siblings().find('a').removeClass('active');
    
    
    sref.closest('[data-accordion]').siblings().find('a').removeClass('active')
      .closest('[data-content]').removeClass('active');
  }
  
  function onToCClick(ev) {
    console.log('ON CLICK!')
    //console.log(ev)
    console.log(ev.currentTarget.href)
    
    var segs = ev.currentTarget.href.split('/');
    var slug = segs[segs.length - 1];
    console.log(slug);
    
    var s = $('#' + slug);
    console.log(s.length);
    
    return false;
    
    //var s = $('.guides section.active');
    //if (!s.length) { return; }
    
    
    
    //return false;
  }
  
  
  
  
  
  
  return function() {
    
    
    
    $(document).ready(onReady);
    $(window).on('scroll', onScroll);
  
  $(document).on('click', '.go-top', function(ev) {
    console.log('scroll top');
    scrollToId('#top');
    return false;
  });
  
  //$('a#logo').on('click', onToCClick);
  $('.sub-menu a').on('click', onToCClick);
  
  //$('.submenu a').on('click', onToCClick);
  //$(document).on('click','.sub-menu a', onToCClick);
  
  /*
  $(document).on('click', '.sub-menu a', function(ev) {
    console.log('submenu click');
    console.log(ev.currentTarget);
    console.log(ev.currentTarget.href)
    return false;
    
    var container = $('#replace')
    
    //$.pjax.click(ev, {container: container})
    $.pjax.click(ev, {container: container })
    return false;
    
   // var id = '#' + ctx.params.document;
    //var id = 'facebook';
    //scrollToId(id);
    //return false;
  });
  */
  
  /*
  page('/docs/:document', function (ctx, next) {
    // FIXME: open search is undefined
    if ('providers' === ctx.params.document) return openSearch.call(document);
    closeSearch.call(document);
    var id = '#' + ctx.params.document;
    scrollToId(id);
  });
  page.start();
  */
  
  function scrollToId(id) {
    var scroll = $(id).offset().top - 30;
    $('html, body').animate({ scrollTop: scroll }, 500);
  }
  
  /**
   * Contextual helpers
   * Depends on globally context variable values
   */
  
  $submenu = $('.sub-menu nav');
  //$gotop = $('.go-top');
  submenuOffset = $submenu.offset();
  //gotopOffset = $gotop.offset();

  function toggleFixedNavigation(ev) {
    $submenu.toggleClass('fixed', submenuOffset && submenuOffset.top < $(window).scrollTop());
    $gotop.toggleClass('fixed', gotopOffset && gotopOffset.top < $(window).scrollTop());
  }

  function toggleActiveSections(ev) {
    var sections = $('.entry section');
    var submenu_height = $submenu.outerHeight();
    var cur_pos = $(window).scrollTop();

    sections.each(function() {
      var top = $(this).offset().top - 50;
      var bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        $submenu.find('a').removeClass('active').closest('[data-content]').removeClass('active');
        sections.removeClass('active');

        $(this).addClass('active');
        $submenu.find('a[href="/docs/' + $(this).attr('id') + '"]').addClass('active').closest('[data-content]').addClass('active');
      }
    });
  }
  // end docs
  
  
  // TODO: Factor this out of this file
  function closeSearch () {
    // closing search
    $("body").removeClass("is-search");
    // cleaning inputs
    $(".search-con form input").text('');
    $(".search-con form input").blur();
    $('.tt-input, .tt-hint').removeClass('bigger');
    // cleaning results
    $(".results section").html('');
    $(".search-con .info-line span").text('0');
  }
  
  }
  
});