(function($) {
    $(document).ready(function (){

        function slide($slideshow, slideTo) {
            const $items = $slideshow.find('.slideshow__item')
            const $itemCurrent = $slideshow.find('.slideshow__item--current');
            const $dots = $slideshow.find('.slideshow__dot');
            const $dotCurrent = $slideshow.find('.slideshow__dot--current');
            const current = $itemCurrent.index();

            $itemCurrent.removeClass('slideshow__item--current');
            $slideshow.find('.slideshow__item').eq(slideTo).addClass('slideshow__item--current');

            $dotCurrent.removeClass('slideshow__dot--current');
            $slideshow.find('.slideshow__dot').eq(slideTo).addClass('slideshow__dot--current');
        }

        $('.slideshow__dot').on('click', function () {
            slide($(this).parents('.slideshow'), $(this).index());
        });

        $('.slideshow__ghost').on('mouseenter', function () {
            slide($(this).parents('.slideshow'), $(this).index());
        });


        if(window.matchMedia("(max-width: 1199px)").matches) {

            $(".slideshow").swipe({

                swipe: function (event, direction, distance, duration, fingerCount, fingerData) {

                    const $slideshow = $(event.target).parents('.slideshow');
                    const $currentItem = $slideshow.find('.slideshow__dot--current');

                    if (direction === 'left') {
                        if ($currentItem.next('.slideshow__dot').length) {
                            slide($slideshow, $currentItem.next('.slideshow__dot').index())
                        } else {
                            slide($slideshow, $currentItem.siblings('.slideshow__dot').first().index());
                        }
                    }

                    if (direction === 'right') {
                        if ($currentItem.prev('.slideshow__dot').length) {
                            slide($slideshow, $currentItem.prev('.slideshow__dot').index())
                        } else {
                            slide($slideshow, $currentItem.siblings('.slideshow__dot').last().index());
                        }
                    }

                }
            });
        }

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



        $('.filters__handler').on('click', function () {
            $(this).parents('.filters').toggleClass('filters--expanded');
        });

    });
})(jQuery);
