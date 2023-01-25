<?php
get_header();
page_panner(array(
  'title' => 'Search Results',
  'subtitle' => 'You searched for &ldquo;' . esc_html(get_search_query(false)) . '&rdquo;'
))
?>

<div class="container container--narrow page-section">
  <?php
  if (!have_posts()) {
    echo '<h2 class="headline headline--small-plus">No results match that search.</h2>';
  }
  while (have_posts()) {
    the_post();
    echo get_post_type();
    get_template_part('template-parts/content', get_post_type());
  }
  echo paginate_links();

  get_search_form();
  ?>
</div>

<? get_footer(); ?>