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



        $('.param__handler').on('click', function () {
            const $param = $(this).parents('.param');
            if( !$param.hasClass('param--expanded') ) {
                $('.param').removeClass('param--expanded');
                $param.addClass('param--expanded');
            } else {
                $param.removeClass('param--expanded');
            }
        });

        $(document).on('click', function (event) {
            if (!$(event.target).closest('.param').length) {
                $('.param').removeClass('param--expanded');
            }
        });

        $(document).on('keyup', function (event) {
            if (event.keyCode === 27) {
                $('.param').removeClass('param--expanded');
            }
        });

    });
})(jQuery);
