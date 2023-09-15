(function($) {
    $(document).ready(function (){

        function slide($slideshow, slideTo) {
            var $items = $slideshow.find('.slideshow__item')
            var $itemCurrent = $slideshow.find('.slideshow__item--current');
            var $dots = $slideshow.find('.slideshow__dot');
            var $dotCurrent = $slideshow.find('.slideshow__dot--current');
            var current = $itemCurrent.index();

            $itemCurrent.removeClass('slideshow__item--current');
            $slideshow.find('.slideshow__item').eq(slideTo).addClass('slideshow__item--current');

            $dotCurrent.removeClass('slideshow__dot--current');
            $slideshow.find('.slideshow__dot').eq(slideTo).addClass('slideshow__dot--current');
        }

        $('.slideshow__dot').on('mouseenter', function () {
            slide( $(this).parents('.slideshow'), $(this).index());
        });

    });
})(jQuery);
