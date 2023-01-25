<div class="event-summary">
  <a class="event-summary__date t-center" href="#">
    <span class="event-summary__month">
      <?php
      $event_date = new DateTime(get_field('event_date'));
      echo $event_date->format('M');
      ?>
    </span>
    <span class="event-summary__day"><? echo $event_date->format('d') ?></span>
  </a>
  <div class="event-summary__content">
    <h5 class="event-summary__title headline headline--tiny"><a href="<? the_permalink() ?>"><? the_title() ?></a></h5>
    <p>
      <?php
      if (has_excerpt()) the_excerpt();
      else {
        echo wp_trim_words(get_the_content(), 18);
        echo '...';
      }
      ?>
      <a href="<? the_permalink() ?>" class="nu gray">Learn more</a>
    </p>
  </div>
</div>