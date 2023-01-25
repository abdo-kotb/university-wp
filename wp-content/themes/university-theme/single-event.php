<?php

get_header();

while (have_posts()) {
  the_post();
  page_panner()
?>

  <div class="container container--narrow page-section">
    <div class="metabox metabox--position-up metabox--with-home-link">
      <p>
        <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('event') ?>"><i class="fa fa-home" aria-hidden="true"></i> Events Home</a> <span class="metabox__main"><? the_title() ?></span>
      </p>
    </div>

    <div class="generic-content"><? the_content() ?></div>

    <?php
    $related_programs = get_field('related_programs');

    if ($related_programs) {
      echo '<hr class="section-break" />';
      echo '<h2 class="headline headline--medium">Related Program(s)</h2>';
      echo '<ul class="link-list min-list">';
      foreach ($related_programs as $program) {
    ?>
        <Li><a href="<? echo get_the_permalink($program) ?>"><? echo get_the_title($program) ?></a></Li>
    <? }
      echo '</ul>';
    }

    ?>
  </div>
<?php }

get_footer()

?>