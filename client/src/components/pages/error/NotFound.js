import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const NotFound = () => (
	<div className="error-page not-found">
		<div className="content">
			<h1 className="title">404</h1>
			<h2 className="desc">
				<FormattedMessage
					id="pages.NotFoundPage.pageNotFound"
					defaultMessage="Sorry, Page Not Found"
				/>
			</h2>
			<Link to="/">
				<FormattedMessage
					id="pages.NotFoundPage.home"
					defaultMessage="Go Back to Home Page"
				/>
			</Link>
		</div>
	</div>
);

export default NotFound;

/* TODO: figure out how to add this script
<script>
  // credit: Fabio Ottaviani
  var lFollowX = 0,
      lFollowY = 0,
      x = 0,
      y = 0,
      friction = 1 / 30;

  function animate() {
    x += (lFollowX - x) * friction;
    y += (lFollowY - y) * friction;

    translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';

    $('.error-page').css({
      '-webit-transform': translate,
      '-moz-transform': translate,
      'transform': translate
    });

    window.requestAnimationFrame(animate);
  }

  $(window).on('mousemove click', function(e) {

    var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
    var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
    lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
    lFollowY = (10 * lMouseY) / 100;

  });

  animate();
</script>
 */
