$(function () {
    $(document).on("click", '.js-toggle-code', function (e) {
        e.preventDefault();
        e.stopPropagation;
        var link = $(this),
            pre = link.parent().next('.js-pre');
        if(link.hasClass('collapsed')){
            link.removeClass('collapsed');
            pre.slideDown(300);
        }
        else {
            link.addClass('collapsed');
            pre.slideUp(300);
        }
    });
});