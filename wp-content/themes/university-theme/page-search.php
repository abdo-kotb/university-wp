<?php

get_header();

while (have_posts()) {
  the_post();
  page_panner()
?>

  <div class="container container--narrow page-section">
    <?php
    $parent_id = wp_get_post_parent_id(get_the_ID());
    if ($parent_id) { ?>
      <div class="metabox metabox--position-up metabox--with-home-link">
        <p>
          <a class="metabox__blog-home-link" href="<?php echo get_permalink($parent_id) ?>"><i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title($parent_id) ?></a> <span class="metabox__main"><?php the_title() ?></span>
        </p>
      </div>
    <?php } ?>

    <?php
    $page_has_child = get_pages(array(
      'child_of' => get_the_ID()
    ));
    if ($parent_id or $page_has_child) { ?>
      <div class="page-links">
        <h2 class="page-links__title"><a href="<? echo get_the_permalink($parent_id) ?>"><? echo get_the_title($parent_id) ?></a></h2>
        <ul class="min-list">
          <?php
          if ($parent_id) {
            $find_child_of = $parent_id;
          } else {
            $find_child_of = get_the_ID();
          }

          wp_list_pages(array(
            'title_li' => null,
            'child_of' => $find_child_of,
            'sort_column' => 'menu_order'
          ))
          ?>
        </ul>
      </div>
    <? } ?>

    <div class="generic-content">
      <? get_search_form() ?>
    </div>
  </div>


<?php }

get_footer()

?>